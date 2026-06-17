let currentPage = 0;
let currentFilters = {
    search: '',
    role: '',
    status: ''
};

document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarUsuarios();

    // Manejo defensivo: verificar que el elemento existe antes de agregar listener
    const buscarInput = document.getElementById('buscarUsuario');
    if (buscarInput) {
        buscarInput.addEventListener('keyup', buscarUsuarios);
    }

    // Listener para el formulario de Creación/Edición
    const formulario = document.getElementById('formularioUsuario');
    if (formulario) {
        formulario.addEventListener('submit', guardarUsuario);
    }

    // --- VALIDACIONES EN VIVO ---
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordHint = document.getElementById('passwordHint');

    if (nombreInput) {
        nombreInput.addEventListener('input', function () {
            let v = this.value;
            v = v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
            v = v.replace(/\s{2,}/g, ' ');
            this.value = v;
            if (v.trim().length === 0) {
                setError('nombre', 'Escribe el nombre completo');
                return;
            }
            if (!validateName(v)) {
                setError('nombre', 'Mínimo dos nombres y sin números');
                return;
            }
            clearError('nombre');
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function () {
            let v = this.value;
            v = v.replace(/[^A-Za-z0-9._%+\-@]/g, '');
            const atCount = (v.match(/@/g) || []).length;
            if (atCount > 1) v = v.replace(/@+$/, '');
            this.value = v;
            if (v.length === 0) {
                setError('email', 'El email no puede estar vacío');
                return;
            }
            if (!v.includes('@')) {
                clearError('email');
                return;
            }
            if (!validateCustomEmail(v)) {
                setError('email', 'Correo no válido');
                return;
            }
            clearError('email');
        });
    }

    if (telefonoInput) {
        telefonoInput.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 10) v = v.slice(0, 10);
            this.value = v;
            if (v.length === 0) {
                clearError('telefono'); // Opcional
                return;
            }
            if (v.length < 10) {
                setError('telefono', 'Debe tener 10 dígitos');
                return;
            }
            if (isInvalidSequence(v)) {
                setError('telefono', 'Número inválido');
                return;
            }
            if (!validatePhone(v)) {
                setError('telefono', 'Número colombiano inválido');
                return;
            }
            clearError('telefono');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('focus', () => {
            if (passwordStrength) passwordStrength.classList.add('show');
            if (passwordHint) passwordHint.classList.add('show');
        });

        passwordInput.addEventListener('blur', () => {
            if (passwordInput.value.length === 0) {
                if (passwordStrength) passwordStrength.classList.remove('show');
                if (passwordHint) passwordHint.classList.remove('show');
            }
        });

        passwordInput.addEventListener('input', function () {
            const v = this.value;
            // Strength bar logic
            if (passwordStrength) {
                let score = 0;
                if (v.length >= 8) score++;
                if (/[A-Z]/.test(v)) score++;
                if (/[a-z]/.test(v)) score++;
                if (/\d/.test(v)) score++;
                if (/[\W_]/.test(v)) score++;

                const bar = passwordStrength.querySelector('.password-strength-bar');
                if (score <= 2) {
                    bar.style.width = '33%';
                    bar.className = 'password-strength-bar strength-weak';
                } else if (score <= 4) {
                    bar.style.width = '66%';
                    bar.className = 'password-strength-bar strength-medium';
                } else {
                    bar.style.width = '100%';
                    bar.className = 'password-strength-bar strength-strong';
                }
            }

            if (v.length > 0 && !validatePassword(v)) {
                // No mostramos error inmediato mientras escribe, solo hint y barra
                // Pero si queremos ser estrictos:
                // setError('password', 'Contraseña débil');
            } else {
                clearError('password');
            }

            // Revalidar confirmación si ya tiene valor
            if (confirmPasswordInput && confirmPasswordInput.value.length > 0) {
                if (confirmPasswordInput.value !== v) {
                    setError('confirmPassword', 'Las contraseñas no coinciden');
                } else {
                    clearError('confirmPassword');
                }
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function () {
            const pass = passwordInput ? passwordInput.value : '';
            if (this.value !== pass) {
                setError('confirmPassword', 'Las contraseñas no coinciden');
            } else {
                clearError('confirmPassword');
            }
        });
    }
});

// --- FUNCIONES DE VALIDACIÓN ---

function setError(id, message) {
    const err = document.getElementById(`${id}-error`);
    const input = document.getElementById(id);
    if (input) {
        input.classList.add('error');
        input.classList.remove('success');
    }
    if (err) {
        err.textContent = message || '';
        err.classList.add('show');
    }
}

function clearError(id) {
    const err = document.getElementById(`${id}-error`);
    const input = document.getElementById(id);
    if (input) {
        input.classList.remove('error');
        input.classList.add('success');
    }
    if (err) {
        err.textContent = '';
        err.classList.remove('show');
    }
}

function clearAllErrors() {
    ['nombre', 'email', 'telefono', 'password', 'confirmPassword'].forEach(id => {
        const input = document.getElementById(id);
        const err = document.getElementById(`${id}-error`);
        if (input) {
            input.classList.remove('error', 'success');
            input.value = ''; // Limpiar valor también
        }
        if (err) {
            err.classList.remove('show');
            err.textContent = '';
        }
    });
    // Resetear barra de fuerza
    const bar = document.querySelector('.password-strength-bar');
    if (bar) {
        bar.style.width = '0';
        bar.className = 'password-strength-bar';
    }
    const strength = document.getElementById('passwordStrength');
    if (strength) strength.classList.remove('show');
    const hint = document.getElementById('passwordHint');
    if (hint) hint.classList.remove('show');
}

function validateName(name) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/;
    return regex.test(String(name).trim());
}

function validateCustomEmail(email) {
    const regex = /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(String(email).trim());
}

function validatePhone(phone) {
    if (!phone) return true;
    const cleaned = String(phone).trim();
    if (!/^\d{10}$/.test(cleaned)) return false;
    if (cleaned.startsWith('3')) {
        const prefix = parseInt(cleaned.substring(0, 3));
        return prefix >= 300 && prefix <= 350;
    }
    const areaCode = cleaned.substring(0, 2);
    const validAreaCodes = ['60', '61', '62', '64', '65', '67', '68'];
    return validAreaCodes.includes(areaCode);
}

function isInvalidSequence(num) {
    if (!num) return false;
    if (/^(\d)\1+$/.test(num)) return true;
    const asc = "01234567890123456789";
    if (asc.includes(num)) return true;
    const desc = "98765432109876543210";
    if (desc.includes(num)) return true;
    return false;
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(String(password));
}

window.togglePassword = function (id, icon) {
    const input = document.getElementById(id);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.textContent = '🙈';
    } else {
        input.type = 'password';
        if (icon) icon.textContent = '👁️';
    }
};

// --- FIN FUNCIONES DE VALIDACIÓN ---

function aplicarFiltros() {
    currentFilters.role = document.getElementById('filtroRol').value;
    currentFilters.status = document.getElementById('filtroEstado').value;
    cargarUsuarios(0);
}

function buscarUsuarios() {
    currentFilters.search = document.getElementById('buscarUsuario').value;
    cargarUsuarios(0);
}

function abrirModalNuevoUsuario() {
    clearAllErrors(); // Limpiar errores y campos
    document.getElementById('usuarioId').value = '';
    document.getElementById('tituloModal').textContent = 'Nuevo Usuario';
    document.getElementById('modalUsuario').classList.add('mostrar');
}

async function cargarUsuarios(page = 0) {
    currentPage = page;
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No hay token de autenticación');
        mostrarNotificacion('Debes iniciar sesión primero', 'error');
        setTimeout(() => {
            window.location.href = 'loginyregistro.html';
        }, 1500);
        return;
    }

    try {
        let url = `/api/admin/users?page=${page}&size=10`;
        if (currentFilters.search) url += `&search=${currentFilters.search}`;
        if (currentFilters.role) url += `&role=${currentFilters.role}`;
        if (currentFilters.status) url += `&status=${currentFilters.status}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            console.error('Error de autenticación:', response.status);
            localStorage.removeItem('token');
            mostrarNotificacion('Sesión expirada. Redirigiendo al login...', 'error');
            setTimeout(() => {
                window.location.href = 'loginyregistro.html';
            }, 1500);
            return;
        }

        if (!response.ok) {
            throw new Error(`Error al cargar usuarios: ${response.status}`);
        }

        const data = await response.json();
        const usuarios = Array.isArray(data.content) ? data.content : [];

        const userIds = usuarios.map(u => u.id).join(',');
        const statsMap = await fetchOrderStatsForUsers(userIds, token);

        renderizarTabla(usuarios, statsMap);
        renderizarPaginacion(data);

    } catch (error) {
        console.error('Error completo:', error);
        mostrarNotificacion('Error al cargar usuarios', 'error');
        renderizarTabla([]);
    }
}

async function fetchOrderStatsForUsers(userIds, token) {
    const statsMap = {};
    if (!userIds) return statsMap;

    const promises = userIds.split(',').map(async userId => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/order-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const stats = await response.json();
                statsMap[userId] = stats;
            } else {
                statsMap[userId] = { orderCount: 0, totalSpent: 0 };
            }
        } catch (e) {
            statsMap[userId] = { orderCount: 0, totalSpent: 0 };
        }
    });

    await Promise.all(promises);
    return statsMap;
}

function renderizarTabla(usuarios, statsMap = {}) {
    const tbody = document.getElementById('tablaUsuariosBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!usuarios || !Array.isArray(usuarios) || usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No se encontraron usuarios</td></tr>';
        return;
    }

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');

        const iniciales = usuario.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const rolClass = usuario.role === 'ADMIN' ? 'admin' : 'cliente';
        const rolText = usuario.role === 'ADMIN' ? 'Admin' : 'Cliente';

        let statusBgColor = '#10b981';
        let statusText = 'Activo';
        if (usuario.status === 'INACTIVE') {
            statusBgColor = '#6b7280';
            statusText = 'Inactivo';
        } else if (usuario.status === 'BLOCKED') {
            statusBgColor = '#ef4444';
            statusText = 'Bloqueado';
        }

        const fechaRegistro = usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

        const userStats = statsMap[usuario.id] || { orderCount: 0, totalSpent: 0 };
        const pedidos = userStats.orderCount;
        const totalGastado = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(userStats.totalSpent);

        let estadoBotonHTML = '';
        if (usuario.role !== 'ADMIN') {
            if (usuario.status === 'ACTIVE') {
                estadoBotonHTML = `<button class="boton-icono peligro" title="Bloquear" onclick="cambiarEstadoUsuario(${usuario.id}, 'BLOCKED')">🚫</button>`;
            } else if (usuario.status === 'BLOCKED') {
                estadoBotonHTML = `<button class="boton-icono" title="Desbloquear" onclick="cambiarEstadoUsuario(${usuario.id}, 'ACTIVE')">🔓</button>`;
            } else if (usuario.status === 'INACTIVE') {
                estadoBotonHTML = `<button class="boton-icono" title="Activar" onclick="cambiarEstadoUsuario(${usuario.id}, 'ACTIVE')">✅</button>`;
            }
        }

        tr.innerHTML = `
            <td>
                <div class="info-usuario">
                    <div class="avatar-usuario">${iniciales}</div>
                    <div class="detalles-usuario">
                        <div class="nombre-usuario">${usuario.name}</div>
                        <div class="email-usuario">${usuario.email}</div>
                    </div>
                </div>
            </td>
            <td><span style="font-weight: 600; color: var(--neon-verde);">#${usuario.id}</span></td>
            <td><span class="insignia-rol ${rolClass}">${rolText}</span></td>
            <td style="font-weight: 700;">${pedidos}</td>
            <td style="font-weight: 700; color: var(--neon-verde);">${totalGastado}</td>
            <td>${fechaRegistro}</td>
            <td>
                <span style="background-color: ${statusBgColor}; color: white; padding: 5px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; display: inline-block; text-transform: uppercase;">${statusText}</span>
            </td>
            <td>
                <div class="botones-accion">
                    <button class="boton-icono" title="Ver Detalles" onclick="verDetallesUsuario(${usuario.id})">👁</button>
                    <button class="boton-icono" title="Editar" onclick="editarUsuario(${usuario.id})">✏️</button>
                    ${estadoBotonHTML}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarPaginacion(data) {
    const paginacion = document.getElementById('paginacion');
    if (!paginacion) return;

    paginacion.innerHTML = '';

    if (data.totalPages <= 1) return;

    const buttonStyle = `
        padding: 8px 12px;
        margin: 0 4px;
        border: 1px solid #2d3748;
        background-color: #1a202c;
        color: #a0aec0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        min-width: 40px;
        transition: all 0.2s;
    `;

    const activeButtonStyle = `
        padding: 8px 12px;
        margin: 0 4px;
        border: 1px solid #48bb78;
        background-color: #48bb78;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        min-width: 40px;
    `;

    const disabledButtonStyle = `
        padding: 8px 12px;
        margin: 0 4px;
        border: 1px solid #2d3748;
        background-color: #1a202c;
        color: #4a5568;
        border-radius: 6px;
        cursor: not-allowed;
        font-size: 14px;
        min-width: 40px;
        opacity: 0.5;
    `;

    const btnPrev = document.createElement('button');
    btnPrev.textContent = '←';
    btnPrev.disabled = data.first;
    btnPrev.style.cssText = data.first ? disabledButtonStyle : buttonStyle;
    btnPrev.onclick = () => !data.first && cargarUsuarios(currentPage - 1);
    if (!data.first) {
        btnPrev.onmouseover = () => { btnPrev.style.backgroundColor = '#2d3748'; };
        btnPrev.onmouseout = () => { btnPrev.style.backgroundColor = '#1a202c'; };
    }
    paginacion.appendChild(btnPrev);

    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(data.totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
        startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.style.cssText = i === currentPage ? activeButtonStyle : buttonStyle;
        btn.onclick = () => cargarUsuarios(i);
        if (i !== currentPage) {
            btn.onmouseover = () => { btn.style.backgroundColor = '#2d3748'; };
            btn.onmouseout = () => { btn.style.backgroundColor = '#1a202c'; };
        }
        paginacion.appendChild(btn);
    }

    const btnNext = document.createElement('button');
    btnNext.textContent = '→';
    btnNext.disabled = data.last;
    btnNext.style.cssText = data.last ? disabledButtonStyle : buttonStyle;
    btnNext.onclick = () => !data.last && cargarUsuarios(currentPage + 1);
    if (!data.last) {
        btnNext.onmouseover = () => { btnNext.style.backgroundColor = '#2d3748'; };
        btnNext.onmouseout = () => { btnNext.style.backgroundColor = '#1a202c'; };
    }
    paginacion.appendChild(btnNext);
}

async function cargarEstadisticas() {
    const token = localStorage.getItem('token');

    if (!token) {
        document.getElementById('totalUsuarios').textContent = '0';
        document.getElementById('usuariosActivos').textContent = '0';
        document.getElementById('usuariosNuevos').textContent = '0';
        return;
    }

    try {
        const response = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            document.getElementById('totalUsuarios').textContent = '0';
            document.getElementById('usuariosActivos').textContent = '0';
            document.getElementById('usuariosNuevos').textContent = '0';
            return;
        }

        if (response.ok) {
            const stats = await response.json();
            const totalUsuarios = stats.totalUsers || 0;

            const allUsersResponse = await fetch('/api/admin/users?size=1000', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (allUsersResponse.ok) {
                const data = await allUsersResponse.json();
                const usuarios = data.content || [];

                const totalClientes = totalUsuarios;
                const usuariosActivos = usuarios.filter(u => u.status === 'ACTIVE' && u.role === 'USER').length;

                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const usuariosNuevos = usuarios.filter(u => {
                    if (!u.createdAt || u.role !== 'USER') return false;
                    const createdDate = new Date(u.createdAt);
                    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
                }).length;

                document.getElementById('totalUsuarios').textContent = totalClientes;
                document.getElementById('usuariosActivos').textContent = usuariosActivos;
                document.getElementById('usuariosNuevos').textContent = usuariosNuevos;
            } else {
                document.getElementById('totalUsuarios').textContent = totalUsuarios;
            }
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        document.getElementById('totalUsuarios').textContent = '0';
        document.getElementById('usuariosActivos').textContent = '0';
        document.getElementById('usuariosNuevos').textContent = '0';
    }
}

function cerrarModal() {
    document.getElementById('modalUsuario').classList.remove('mostrar');
}

function cerrarModalDetalles() {
    document.getElementById('modalDetalles').classList.remove('mostrar');
}

async function editarUsuario(id) {
    const token = localStorage.getItem('token');

    if (!token) {
        mostrarNotificacion('Debes iniciar sesión primero', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            mostrarNotificacion('Sesión expirada. Redirigiendo...', 'error');
            setTimeout(() => window.location.href = 'loginyregistro.html', 1500);
            return;
        }

        if (!response.ok) throw new Error('Usuario no encontrado');
        const usuario = await response.json();

        clearAllErrors(); // Limpiar errores previos

        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('nombre').value = usuario.name;
        document.getElementById('email').value = usuario.email;
        document.getElementById('telefono').value = usuario.phone || '';
        document.getElementById('rol').value = usuario.role;
        document.getElementById('estado').value = usuario.status;
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';

        document.getElementById('tituloModal').textContent = 'Editar Usuario';
        document.getElementById('modalUsuario').classList.add('mostrar');

    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al cargar usuario', 'error');
    }
}

async function guardarUsuario(e) {
    e.preventDefault();

    const id = document.getElementById('usuarioId').value;
    const token = localStorage.getItem('token');

    if (!token) {
        mostrarNotificacion('Debes iniciar sesión primero', 'error');
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // --- VALIDACIONES FINALES ANTES DE ENVIAR ---
    let isValid = true;

    if (!validateName(nombre)) {
        setError('nombre', 'Nombre inválido');
        isValid = false;
    }

    if (!validateCustomEmail(email)) {
        setError('email', 'Email inválido');
        isValid = false;
    }

    if (telefono && (!validatePhone(telefono) || isInvalidSequence(telefono))) {
        setError('telefono', 'Teléfono inválido');
        isValid = false;
    }

    if (!id && !password) {
        setError('password', 'Contraseña obligatoria');
        isValid = false;
    }

    if (password) {
        if (!validatePassword(password)) {
            setError('password', 'Contraseña débil');
            isValid = false;
        }
        if (password !== confirmPassword) {
            setError('confirmPassword', 'No coinciden');
            isValid = false;
        }
    }

    if (!isValid) {
        mostrarNotificacion('Por favor corrige los errores', 'error');
        return;
    }

    const formData = {
        name: nombre,
        email: email,
        phone: telefono,
        role: document.getElementById('rol').value,
        status: document.getElementById('estado').value
    };

    if (password) {
        formData.password = password;
    }

    let url = '/api/admin/users';
    let method = 'POST';

    if (id) {
        url = `/api/admin/users/${id}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            mostrarNotificacion('Sesión expirada. Redirigiendo...', 'error');
            setTimeout(() => window.location.href = 'loginyregistro.html', 1500);
            return;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(`Error al guardar: ${errorData.message || response.statusText}`);
        }

        cerrarModal();
        cargarUsuarios(currentPage);
        cargarEstadisticas();
        mostrarNotificacion(`Usuario ${id ? 'actualizado' : 'creado'} correctamente`, 'exito');

    } catch (error) {
        console.error(error);
        mostrarNotificacion(error.message, 'error');
    }
}

async function cambiarEstadoUsuario(id, nuevoEstado) {
    const token = localStorage.getItem('token');

    if (!token) {
        mostrarNotificacion('Debes iniciar sesión primero', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/admin/users/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: nuevoEstado })
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            mostrarNotificacion('Sesión expirada. Redirigiendo...', 'error');
            setTimeout(() => window.location.href = 'loginyregistro.html', 1500);
            return;
        }

        if (!response.ok) throw new Error('Error al actualizar estado');

        cargarUsuarios(currentPage);
        cargarEstadisticas();
        mostrarNotificacion('Estado actualizado correctamente', 'exito');

    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al actualizar estado', 'error');
    }
}

async function verDetallesUsuario(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Usuario no encontrado');
        const usuario = await response.json();

        document.getElementById('detalleNombre').textContent = usuario.name;
        document.getElementById('detalleEmail').textContent = usuario.email;
        document.getElementById('detalleTelefono').textContent = usuario.phone || '-';
        document.getElementById('detalleId').textContent = `#${usuario.id}`;
        document.getElementById('detalleRol').textContent = usuario.role === 'ADMIN' ? 'Administrador' : 'Cliente';
        document.getElementById('detalleEstado').textContent = usuario.status;
        document.getElementById('detalleFechaRegistro').textContent = usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES') : '-';

        document.getElementById('modalDetalles').classList.add('mostrar');

    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al cargar detalles', 'error');
    }
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.className = 'notificacion mostrar';
    if (tipo === 'error') {
        notificacion.style.background = 'var(--rojo-error)';
    } else {
        notificacion.style.background = 'linear-gradient(135deg, var(--neon-verde), #2ecc40)';
    }

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}