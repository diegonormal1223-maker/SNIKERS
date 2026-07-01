// ===== VARIABLES GLOBALES =====
let paginaActual = 0;
let filtroActual = 'todas';
let totalPages = 1;
let searchTimeout = null;
let editingOrderId = null;
let originalQuantity = 0; // Para recalcular stock en edición
let fechaInicio = null;
let fechaFin = null;
let availableProducts = []; // Productos cargados dinámicamente

// ===== TRADUCCIÓN DE ESTADOS =====
const estadoTraducciones = {
    'PENDING': 'Pendiente',
    'IN_TRANSIT': 'En Tránsito',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregado',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada',
    'PROCESSING': 'En Proceso'
};

function traducirEstado(estado) {
    return estadoTraducciones[estado] || estado;
}

// ===== FUNCIONES DE VALIDACIÓN =====

function setError(id, message) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`${id}-error`);

    if (input) {
        input.classList.add('error');
        input.classList.remove('success');
    }
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearError(id) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`${id}-error`);

    if (input) {
        input.classList.remove('error');
        input.classList.add('success');
    }
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

function clearAllErrors() {
    ['nuevoCliente', 'nuevoTelefono', 'nuevoEmail', 'nuevoProducto', 'nuevaCantidad'].forEach(id => {
        const input = document.getElementById(id);
        const errorEl = document.getElementById(`${id}-error`);

        if (input) {
            input.classList.remove('error', 'success');
        }
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    });
}

// Validar nombre (letras y espacios, mínimo 2 palabras)
function validateName(name) {
    const trimmed = name.trim();
    if (trimmed.length === 0) return false;
    // Al menos 2 palabras
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return false;
    // Solo letras y espacios
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);
}

// Validar email (estricto: min 2 chars antes de @, min 2 chars antes del dominio)
function validateEmail(email) {
    const trimmed = email.trim();
    // Patrón estricto: username mínimo 2 chars (empieza con letra), dominio mínimo 2 chars
    const regex = /^[a-zA-Z][a-zA-Z0-9._%+-]{1,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;
    return regex.test(trimmed);
}

// Validar teléfono colombiano (300-350, 10 dígitos)
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return false;
    if (!cleaned.startsWith('3')) return false;

    const prefix = parseInt(cleaned.substring(0, 3));
    return prefix >= 300 && prefix <= 350;
}

// Validar que no sea secuencia inválida
function isInvalidSequence(num) {
    if (!num) return false;
    // Todos iguales
    if (/^(\d)\1+$/.test(num)) return true;
    // Secuencia ascendente/descendente
    const asc = "01234567890123456789";
    if (asc.includes(num)) return true;
    const desc = "98765432109876543210";
    if (desc.includes(num)) return true;
    return false;
}

// ===== INPUT MASKING Y VALIDACIÓN EN TIEMPO REAL =====
function setupInputMasks() {
    // Cliente - solo letras y espacios
    const clienteInput = document.getElementById('nuevoCliente');
    if (clienteInput) {
        clienteInput.addEventListener('input', function (e) {
            let val = e.target.value;
            // Remover caracteres inválidos
            val = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            // Espacios simples
            val = val.replace(/\s{2,}/g, ' ');
            // Max 50 caracteres
            if (val.length > 50) val = val.substring(0, 50);

            e.target.value = val;

            // Validación en vivo
            if (val.trim().length === 0) {
                setError('nuevoCliente', 'El nombre es requerido');
            } else if (!validateName(val)) {
                setError('nuevoCliente', 'Ingresa nombre y apellido (mín. 2 palabras)');
            } else {
                clearError('nuevoCliente');
            }
        });
    }

    // Teléfono - solo números
    const telefonoInput = document.getElementById('nuevoTelefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function (e) {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 10) val = val.substring(0, 10);

            e.target.value = val;

            // Validación en vivo
            if (val.length === 0) {
                setError('nuevoTelefono', 'El teléfono es requerido');
            } else if (val.length < 10) {
                setError('nuevoTelefono', 'Debe tener 10 dígitos');
            } else if (isInvalidSequence(val)) {
                setError('nuevoTelefono', 'Número inválido (secuencia)');
            } else if (!validatePhone(val)) {
                setError('nuevoTelefono', 'Prefijo inválido (300-350)');
            } else {
                clearError('nuevoTelefono');
            }
        });
    }

    // Email
    const emailInput = document.getElementById('nuevoEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function (e) {
            let val = e.target.value;
            // Remover caracteres inválidos
            val = val.replace(/[^A-Za-z0-9._%+\-@]/g, '');
            // Solo un @
            const atCount = (val.match(/@/g) || []).length;
            if (atCount > 1) val = val.replace(/@+$/, '');

            e.target.value = val;

            // Validación en vivo
            if (val.length === 0) {
                setError('nuevoEmail', 'El email es requerido');
            } else if (!val.includes('@')) {
                clearError('nuevoEmail');
            } else if (!validateEmail(val)) {
                setError('nuevoEmail', 'Email no válido (ej: nombre@dominio.com)');
            } else {
                clearError('nuevoEmail');
            }
        });
    }

    // Producto - validar selección
    const productoSelect = document.getElementById('nuevoProducto');
    if (productoSelect) {
        productoSelect.addEventListener('change', function (e) {
            if (e.target.value === '') {
                setError('nuevoProducto', 'Debe seleccionar un producto');
            } else {
                clearError('nuevoProducto');
                updateStockInfo();
            }
        });
    }

    // Cantidad - validar
    const cantidadInput = document.getElementById('nuevaCantidad');
    if (cantidadInput) {
        cantidadInput.addEventListener('input', function (e) {
            const val = parseInt(e.target.value);
            const maxStock = getSelectedProductStock();

            if (isNaN(val) || val < 1) {
                setError('nuevaCantidad', 'La cantidad mínima es 1');
            } else if (maxStock > 0 && val > maxStock) {
                setError('nuevaCantidad', `Stock disponible: ${maxStock} unidades`);
            } else {
                clearError('nuevaCantidad');
            }
        });
    }
}

// ===== CARGA DINÁMICA DE PRODUCTOS =====
async function loadProducts() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/admin/products/active', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            availableProducts = await response.json();
            renderProductOptions();
        } else {
            console.error('Error loading products');
            mostrarNotificacion('❌ Error al cargar productos');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProductOptions() {
    const select = document.getElementById('nuevoProducto');
    if (!select) return;

    // Limpiar opciones excepto la primera
    select.innerHTML = '<option value="">Seleccionar producto...</option>';

    // Agregar productos
    availableProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.setAttribute('data-stock', product.stock);
        option.setAttribute('data-price', product.price);
        option.textContent = `${product.name} - $${product.price} (Stock: ${product.stock})`;
        select.appendChild(option);
    });
}

function getSelectedProductStock() {
    const select = document.getElementById('nuevoProducto');
    if (!select || !select.value) return 0;

    const selectedOption = select.options[select.selectedIndex];
    const stock = selectedOption.getAttribute('data-stock');
    return parseInt(stock) || 0;
}

function updateStockInfo() {
    const stock = getSelectedProductStock();
    const stockInfo = document.getElementById('stockInfo');

    if (stockInfo && stock > 0) {
        stockInfo.textContent = `📦 Disponible: ${stock} unidades`;
        stockInfo.style.display = 'block';
        stockInfo.style.color = stock < 10 ? 'var(--amarillo-alerta)' : 'var(--texto-gris)';
    } else if (stockInfo) {
        stockInfo.style.display = 'none';
    }
}

// ===== FUNCIÓN PARA MOSTRAR NOTIFICACIÓN =====
function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    notificacion.textContent = mensaje;
    notificacion.classList.add('mostrar');

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}

// ===== FUNCIÓN PARA CAMBIAR PERÍODO =====
function cambiarPeriodo() {
    const selector = document.getElementById('selectorPeriodo');
    const periodo = selector.value;
    const hoy = new Date();

    fechaInicio = null;
    fechaFin = null;

    switch (periodo) {
        case 'hoy':
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            break;
        case 'semana':
            const diaSemana = hoy.getDay() || 7;
            fechaInicio = new Date(hoy);
            fechaInicio.setDate(hoy.getDate() - diaSemana + 1);
            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin = new Date(hoy);
            fechaFin.setHours(23, 59, 59, 999);
            break;
        case 'mes':
            fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
            break;
        case 'trimestre':
            const trimestre = Math.floor(hoy.getMonth() / 3);
            fechaInicio = new Date(hoy.getFullYear(), trimestre * 3, 1);
            fechaFin = new Date(hoy.getFullYear(), (trimestre + 1) * 3, 0);
            break;
        case 'ano':
            fechaInicio = new Date(hoy.getFullYear(), 0, 1);
            fechaFin = new Date(hoy.getFullYear(), 11, 31);
            break;
    }

    mostrarNotificacion(`📅 Actualizando datos para: ${selector.options[selector.selectedIndex].text}`);
    paginaActual = 0;
    fetchOrders();
}

// ===== FUNCIÓN PARA FILTRAR VENTAS =====
function filtrarVentas(estado) {
    filtroActual = estado;
    paginaActual = 0;

    document.querySelectorAll('.boton-filtro').forEach(btn => {
        btn.classList.remove('activo');
    });

    const buttons = document.querySelectorAll('.boton-filtro');
    for (let btn of buttons) {
        if (btn.textContent.toLowerCase().includes(estado.toLowerCase()) ||
            (estado === 'todas' && btn.textContent === 'Todas') ||
            (estado === 'in_transit' && btn.textContent.includes('Tránsito'))) {
            btn.classList.add('activo');
            break;
        }
    }

    fetchOrders();
}

// ===== FUNCIÓN PARA BUSCAR VENTAS =====
function buscarVentas() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        paginaActual = 0;
        fetchOrders();
    }, 300);
}

// ===== FUNCIÓN PARA ABRIR MODAL NUEVA VENTA =====
async function abrirModalNuevaVenta() {
    editingOrderId = null;
    originalQuantity = 0; clearAllErrors();

    document.getElementById('nuevoCliente').value = '';
    document.getElementById('nuevoTelefono').value = '';
    document.getElementById('nuevoEmail').value = '';
    document.getElementById('nuevoProducto').value = '';
    document.getElementById('nuevaCantidad').value = '1';
    document.getElementById('nuevoEstado').value = 'PENDING';

    // Remover atributos readonly/disabled (para nuevo pedido todos son editables)
    document.getElementById('nuevoCliente').removeAttribute('readonly');
    document.getElementById('nuevoTelefono').removeAttribute('readonly');
    document.getElementById('nuevoEmail').removeAttribute('readonly');
    document.getElementById('nuevoProducto').removeAttribute('disabled');
    document.getElementById('nuevaCantidad').removeAttribute('readonly');
    document.getElementById('nuevoEstado').removeAttribute('disabled');

    // Cargar productos
    await loadProducts();

    const modal = document.getElementById('modalNuevaVenta');
    modal.classList.add('activo');
}

// ===== FUNCIÓN PARA CERRAR MODAL =====
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('activo');
    clearAllErrors();
}

// ===== FUNCIÓN PARA GUARDAR NUEVA VENTA =====
async function guardarNuevaVenta() {
    const cliente = document.getElementById('nuevoCliente').value.trim();
    const telefono = document.getElementById('nuevoTelefono').value.trim();
    const email = document.getElementById('nuevoEmail').value.trim();
    const producto = document.getElementById('nuevoProducto').value;
    const cantidad = parseInt(document.getElementById('nuevaCantidad').value);
    const estado = document.getElementById('nuevoEstado').value;

    // === VALIDACIONES FINALES ===
    let hasErrors = false;

    if (!validateName(cliente)) {
        setError('nuevoCliente', 'Ingresa nombre y apellido válidos');
        hasErrors = true;
    }

    if (!validatePhone(telefono) || isInvalidSequence(telefono)) {
        setError('nuevoTelefono', 'Teléfono inválido (300-350, 10 dígitos)');
        hasErrors = true;
    }

    if (!validateEmail(email)) {
        setError('nuevoEmail', 'Email no válido');
        hasErrors = true;
    }

    if (!producto || producto === '') {
        setError('nuevoProducto', 'Debe seleccionar un producto');
        hasErrors = true;
    }

    const maxStock = getSelectedProductStock();
    if (isNaN(cantidad) || cantidad < 1) {
        setError('nuevaCantidad', 'La cantidad debe ser mayor a 0');
        hasErrors = true;
    } else if (maxStock > 0 && cantidad > maxStock) {
        setError('nuevaCantidad', `Stock insuficiente (disponible: ${maxStock})`);
        hasErrors = true;
    }

    if (hasErrors) {
        mostrarNotificacion('⚠️ Por favor corrige los errores en el formulario');
        return;
    }

    const token = localStorage.getItem('token');

    // === EDITAR VENTA ===
    if (editingOrderId) {
        try {
            const response = await fetch(`/api/admin/orders/${editingOrderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productName: producto,
                    quantity: cantidad,
                    status: estado
                })
            });

            if (response.ok) {
                mostrarNotificacion('✅ Venta actualizada exitosamente');
                cerrarModal('modalNuevaVenta');
                fetchOrders();
            } else {
                const error = await response.json();
                mostrarNotificacion('❌ ' + (error.error || 'Error al actualizar la venta'));
            }
        } catch (error) {
            console.error('Error updating order:', error);
            mostrarNotificacion('❌ Error al actualizar la venta');
        }
    }
    // === CREAR NUEVA VENTA ===
    else {
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerEmail: email,
                    productName: producto,
                    quantity: cantidad,
                    status: estado
                })
            });

            if (response.ok) {
                mostrarNotificacion('✅ Venta creada exitosamente');
                cerrarModal('modalNuevaVenta');
                fetchOrders();
            } else {
                const error = await response.json();
                let errorMsg = error.error || 'Error al crear la venta';

                // Traducir errores comunes
                if (errorMsg.includes('User not found')) {
                    errorMsg = '❌ El correo no está registrado en el sistema';
                } else if (errorMsg.includes('Insufficient stock')) {
                    errorMsg = '❌ No hay stock suficiente para este producto';
                } else if (errorMsg.includes('Product not found')) {
                    errorMsg = '❌ El producto seleccionado no existe';
                }

                mostrarNotificacion(errorMsg);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            mostrarNotificacion('❌ Error al crear la venta');
        }
    }
}

// ===== FUNCIÓN PARA VER DETALLES DE VENTA =====
async function verDetallesVenta(ventaId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${ventaId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const order = await response.json();
            const userEmail = order.user ? order.user.email : 'Unknown';
            const userName = order.user && order.user.name ? order.user.name : 'N/A';
            const productName = order.items && order.items.length > 0 ? order.items[0].product.name : 'N/A';
            const quantity = order.items && order.items.length > 0 ? order.items[0].quantity : 0;
            const date = new Date(order.orderDate).toLocaleString('es-CO');
            const estadoTraducido = traducirEstado(order.status);

            let statusClass = 'pendiente';
            if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
                statusClass = 'completada';
            } else if (order.status === 'IN_TRANSIT' || order.status === 'EN_TRANSITO') {
                statusClass = 'transito';
            } else if (order.status === 'CANCELLED') {
                statusClass = 'cancelada';
            }

            const contenido = document.getElementById('contenidoDetalles');
            contenido.innerHTML = `
                <div style="line-height: 2;">
                    <p><strong>ID de la Venta:</strong> #${order.id}</p>
                    <p><strong>Fecha:</strong> ${date}</p>
                    <p><strong>Estado:</strong> <span class="estado-venta ${statusClass}">${estadoTraducido}</span></p>
                    <hr style="border-color: rgba(57, 255, 20, 0.2); margin: 20px 0;">
                    <h4 style="color: var(--neon-verde); margin-bottom: 10px;">Información del Cliente</h4>
                    <p><strong>Nombre:</strong> ${userName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <hr style="border-color: rgba(57, 255, 20, 0.2); margin: 20px 0;">
                    <h4 style="color: var(--neon-verde); margin-bottom: 10px;">Detalles del Producto</h4>
                    <p><strong>Producto:</strong> ${productName}</p>
                    <p><strong>Cantidad:</strong> ${quantity}</p>
                    <p><strong>Total:</strong> <span style="color: var(--verde-exito); font-weight: 700; font-size: 24px;">$${order.totalAmount.toLocaleString()}</span></p>
                </div>
            `;
            document.getElementById('modalDetalles').classList.add('activo');
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        mostrarNotificacion('❌ Error al cargar los detalles de la venta');
    }
}

// ===== FUNCIÓN PARA EDITAR VENTA =====
async function editarVenta(ventaId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${ventaId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const order = await response.json();
            editingOrderId = ventaId;

            const userEmail = order.user ? order.user.email : '';
            const userName = order.user && order.user.name ? order.user.name : 'N/A';
            const productName = order.items && order.items.length > 0 ? order.items[0].product.name : '';
            const quantity = order.items && order.items.length > 0 ? order.items[0].quantity : 1;

            // Guardar cantidad original para recalcular stock
            originalQuantity = quantity;

            // Cargar productos primero
            await loadProducts();

            clearAllErrors();

            // Llenar campos del formulario
            document.getElementById('nuevoCliente').value = userName;
            document.getElementById('nuevoTelefono').value = '3001234567'; // Default
            document.getElementById('nuevoEmail').value = userEmail;
            document.getElementById('nuevoProducto').value = productName;
            document.getElementById('nuevaCantidad').value = quantity;
            document.getElementById('nuevoEstado').value = order.status;

            // RESTRICCIÓN: Impedir cualquier modificación en la edición (incluido el estado)
            document.getElementById('nuevoCliente').setAttribute('readonly', true);
            document.getElementById('nuevoTelefono').setAttribute('readonly', true);
            document.getElementById('nuevoEmail').setAttribute('readonly', true);
            document.getElementById('nuevoProducto').setAttribute('disabled', true);
            document.getElementById('nuevaCantidad').setAttribute('readonly', true);
            document.getElementById('nuevoEstado').setAttribute('disabled', true);

            document.getElementById('modalNuevaVenta').classList.add('activo');
        }
    } catch (error) {
        console.error('Error fetching order for edit:', error);
        mostrarNotificacion('❌ Error al cargar la venta para editar');
    }
}

// ===== FUNCIÓN PARA ELIMINAR VENTA (SOFT DELETE) =====
async function eliminarVenta(ventaId) {
    if (!confirm(`🗑️ ¿Estás seguro de cancelar la venta #${ventaId}?\n\nEl stock será restaurado automáticamente.`)) {
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${ventaId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            mostrarNotificacion('✅ Venta cancelada y stock restaurado');
            fetchOrders();
        } else {
            const error = await response.json();
            mostrarNotificacion('❌ ' + (error.error || 'Error al cancelar la venta'));
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        mostrarNotificacion('❌ Error al cancelar la venta');
    }
}

// ===== FUNCIÓN PARA CAMBIAR DE PÁGINA =====
function cambiarPagina(pagina) {
    if (pagina === 'prev' && paginaActual > 0) {
        paginaActual--;
    } else if (pagina === 'next' && paginaActual < totalPages - 1) {
        paginaActual++;
    } else if (typeof pagina === 'number') {
        paginaActual = pagina - 1;
    }

    fetchOrders();
}

// ===== CERRAR MODAL AL HACER CLIC FUERA =====
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('activo');
        clearAllErrors();
    }
}

// ===== FETCH ORDERS =====
async function fetchOrders() {
    const token = localStorage.getItem('token');
    const search = document.getElementById('inputBusqueda').value;

    let url = `/api/admin/orders?page=${paginaActual}&size=10`;
    if (filtroActual !== 'todas') {
        url += `&status=${filtroActual}`;
    }
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    if (fechaInicio && fechaFin) {
        const startStr = fechaInicio.toISOString().split('T')[0];
        const endStr = fechaFin.toISOString().split('T')[0];
        url += `&startDate=${startStr}&endDate=${endStr}`;
    }

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            renderOrders(data.content);
            updatePagination(data);

            document.getElementById('contadorVentas').textContent = data.totalElements;
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }

    // Fetch Stats
    try {
        const statsResponse = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsResponse.ok) {
            const stats = await statsResponse.json();

            if (document.getElementById('totalSalesValue')) {
                document.getElementById('totalSalesValue').textContent = '$' + stats.totalSales.toLocaleString();
            }
            if (document.getElementById('totalSalesCount')) {
                document.getElementById('totalSalesCount').textContent = stats.totalOrders + ' ventas realizadas';
            }

            if (document.getElementById('salesToday') && stats.salesToday) {
                document.getElementById('salesToday').textContent = '$' + stats.salesToday.totalAmount.toLocaleString();
            }
            if (document.getElementById('salesTodayCount') && stats.salesToday) {
                document.getElementById('salesTodayCount').textContent = stats.salesToday.count + ' ventas completadas';
            }
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById('cuerpoTablaVentas');
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No se encontraron ventas</td></tr>';
        return;
    }

    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-estado', order.status.toLowerCase());

        let statusClass = 'pendiente';
        if (order.status === 'DELIVERED' || order.status === 'COMPLETED') statusClass = 'completada';
        else if (order.status === 'IN_TRANSIT' || order.status === 'EN_TRANSITO') statusClass = 'transito';
        else if (order.status === 'CANCELLED') statusClass = 'cancelada';

        const date = new Date(order.orderDate).toLocaleDateString('es-CO');
        const userEmail = order.user ? order.user.email : 'Unknown';
        const userName = order.user && order.user.name ? order.user.name : 'N/A';
        const avatarLetter = userName.charAt(0).toUpperCase();
        const productName = order.items && order.items.length > 0 ? order.items[0].product.name : 'N/A';
        const estadoTraducido = traducirEstado(order.status);

        tr.innerHTML = `
            <td><span class="id-venta">#${order.id}</span></td>
            <td>
                <div class="info-cliente">
                    <div class="avatar-cliente">${avatarLetter}</div>
                    <div class="detalles-cliente">
                        <div class="nombre-cliente">${userName}</div>
                        <div class="email-cliente">${userEmail}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="info-producto">
                    <div class="imagen-producto-mini">👟</div>
                    <span class="nombre-producto">${productName}</span>
                </div>
            </td>
            <td>${date}</td>
            <td><span class="precio-venta">$${order.totalAmount.toLocaleString()}</span></td>
            <td><span class="estado-venta ${statusClass}">${estadoTraducido}</span></td>
            <td>
                <div class="botones-accion">
                    <button class="boton-accion" onclick="verDetallesVenta(${order.id})" title="Ver detalles">👁️</button>
                    <button class="boton-accion" onclick="editarVenta(${order.id})" title="Editar">✏️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updatePagination(data) {
    totalPages = data.totalPages;
    const container = document.getElementById('paginacion');
    container.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'boton-pagina';
    prevBtn.textContent = '←';
    prevBtn.onclick = () => cambiarPagina('prev');
    if (data.first) prevBtn.disabled = true;
    container.appendChild(prevBtn);

    let startPage = Math.max(0, paginaActual - 1);
    let endPage = Math.min(totalPages - 1, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `boton-pagina ${i === paginaActual ? 'activo' : ''}`;
        btn.textContent = i + 1;
        btn.onclick = () => cambiarPagina(i + 1);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'boton-pagina';
    nextBtn.textContent = '→';
    nextBtn.onclick = () => cambiarPagina('next');
    if (data.last) nextBtn.disabled = true;
    container.appendChild(nextBtn);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    setupInputMasks();
    loadProducts(); // Cargar productos al inicio
    fetchOrders();

    const searchInput = document.getElementById('inputBusqueda');
    if (searchInput) {
        searchInput.addEventListener('input', buscarVentas);
    }
});

// ===== MENSAJE DE BIENVENIDA EN CONSOLA =====
console.log('%c🚀 SNIKER - Gestión de Ventas Cargado', 'color: #39ff14; font-size: 20px; font-weight: bold;');
console.log('%cSistema de Ventas v2.0 - Con validaciones y gestión de stock', 'color: #b026ff; font-size: 14px;');
