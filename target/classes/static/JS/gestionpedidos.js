// ===== VARIABLES GLOBALES =====
let paginaActual = 0;
let filtroActual = 'todas';
let totalPages = 1;
let searchTimeout = null;
let editingOrderId = null;

// ===== TRADUCCIÓN DE ESTADOS (MAPEANDO A LOS 4 ESTADOS DEL USUARIO) =====
const estadoTraducciones = {
    // Backend -> Español
    'PENDING': 'Pendiente',
    'PAID': 'Pendiente', // PAID se muestra como Pendiente
    'IN_TRANSIT': 'En Tránsito',
    'SHIPPED': 'En Tránsito', // SHIPPED se muestra como En Tránsito
    'DELIVERED': 'Entregado',
    'COMPLETED': 'Entregado', // COMPLETED se muestra como Entregado
    'CANCELLED': 'Cancelado',
    'PROCESSING': 'En Tránsito' // PROCESSING se muestra como En Tránsito
};

//Mapeo de estados frontend a backend
const estadosBackendMap = {
    'PENDIENTE': 'PENDING',
    'EN_TRANSITO': 'IN_TRANSIT',
    'ENTREGADO': 'DELIVERED',
    'CANCELADO': 'CANCELLED'
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
    ['nuevaDireccion', 'nuevoEstado'].forEach(id => {
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

// Validar dirección (max 100 chars, letras, números, espacios, #, -, coma, paréntesis, puntos)
function validateAddress(address) {
    const trimmed = address.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > 100) return false;
    return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s#,\-\(\).]+$/.test(trimmed);
}

// ===== INPUT MASKING Y VALIDACIÓN EN TIEMPO REAL =====
function setupInputMasks() {
    const direccionInput = document.getElementById('nuevaDireccion');
    if (direccionInput) {
        direccionInput.addEventListener('input', function (e) {
            let val = e.target.value;
            val = val.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s#,\-\(\).]/g, '');
            val = val.replace(/\s{2,}/g, ' ');
            if (val.length > 100) val = val.substring(0, 100);

            e.target.value = val;

            if (val.trim().length === 0) {
                setError('nuevaDireccion', 'La dirección es requerida');
            } else if (!validateAddress(val)) {
                setError('nuevaDireccion', 'Dirección inválida (solo letras, números, #, -, coma)');
            } else {
                clearError('nuevaDireccion');
            }
        });
    }

    const estadoSelect = document.getElementById('nuevoEstado');
    if (estadoSelect) {
        estadoSelect.addEventListener('change', function (e) {
            if (e.target.value === '') {
                setError('nuevoEstado', 'Debe seleccionar un estado');
            } else {
                clearError('nuevoEstado');
            }
        });
    }
}

// ===== FUNCIÓN PARA MOSTRAR NOTIFICACIÓN =====
function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById('notificacion');
    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.id = 'notificacion';
        notificacion.className = 'notificacion';
        document.body.appendChild(notificacion);
    }

    notificacion.textContent = mensaje;
    notificacion.classList.add('mostrar');

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}

// ===== FUNCIÓN PARA FILTRAR PEDIDOS =====
function filtrarPedidos(estado) {
    filtroActual = estado;
    paginaActual = 0;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const buttons = document.querySelectorAll('.filter-btn');
    for (let btn of buttons) {
        if (btn.textContent.toLowerCase().includes(estado.toLowerCase()) ||
            (estado === 'todas' && btn.textContent === 'Todos') ||
            (estado === 'IN_TRANSIT' && btn.textContent.includes('Tránsito'))) {
            btn.classList.add('active');
            break;
        }
    }

    fetchOrders();
}

// ===== FUNCIÓN PARA BUSCAR PEDIDOS =====
function buscarPedidos() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        paginaActual = 0;
        fetchOrders();
    }, 300);
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

// ===== FETCH ORDERS =====
async function fetchOrders() {
    const token = localStorage.getItem('token');
    const search = document.getElementById('searchInput').value;

    let url = `/api/admin/orders?page=${paginaActual}&size=10`;
    if (filtroActual !== 'todas') {
        url += `&status=${filtroActual}`;
    }
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            renderOrders(data.content);
            updatePagination(data);
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

            if (stats.deliveryStats) {
                document.getElementById('totalOrders').textContent = stats.deliveryStats.total;
                document.getElementById('pendingOrders').textContent = stats.deliveryStats.pending;
                document.getElementById('deliveredOrders').textContent = stats.deliveryStats.delivered;
                document.getElementById('cancelledOrders').textContent = stats.deliveryStats.cancelled;
            }
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No se encontraron pedidos</td></tr>';
        return;
    }

    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-status', order.status.toLowerCase());

        // CORRECCIÓN 3: Colores según domicilios.css
        let statusClass = 'pending'; // amarillo (PENDIENTE, PAID)
        if (order.status === 'IN_TRANSIT' || order.status === 'SHIPPED' || order.status === 'PROCESSING') {
            statusClass = 'transito'; // azul (#00d4ff)
        } else if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
            statusClass = 'entregado'; // verde (#00ff88)
        } else if (order.status === 'CANCELLED') {
            statusClass = 'cancelled'; // rojo
        }

        const date = new Date(order.orderDate).toLocaleDateString('es-CO');
        const userEmail = order.user ? order.user.email : 'Unknown';
        const userName = order.user && order.user.name ? order.user.name : 'N/A';
        const avatarLetter = userName.charAt(0).toUpperCase();
        const productName = order.items && order.items.length > 0 ? order.items[0].product.name : 'N/A';
        const estadoTraducido = traducirEstado(order.status);

        tr.innerHTML = `
            <td><span class="order-id">#${order.id}</span></td>
            <td>
                <div class="customer-info">
                    <div class="customer-avatar">${avatarLetter}</div>
                    <div class="customer-details">
                        <div class="customer-name">${userName}</div>
                        <div class="customer-email">${userEmail}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="product-info">
                    <div class="product-image">👟</div>
                    <span class="product-name">${productName}</span>
                </div>
            </td>
            <td>${date}</td>
            <td><span class="price">$${order.totalAmount.toLocaleString()}</span></td>
            <td><span class="status-badge ${statusClass}">${estadoTraducido}</span></td>
            <td>
                 <div class="action-buttons">
                     <button class="action-btn" onclick="verDetallesPedido(${order.id})" title="Ver detalles">👁️</button>
                     <button class="action-btn" onclick="editarPedido(${order.id})" title="Editar">✏️</button>
                 </div>
             </td>
        `;
        tbody.appendChild(tr);
    });
}

function updatePagination(data) {
    totalPages = data.totalPages;
    const container = document.querySelector('.pagination');
    container.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.textContent = '←';
    prevBtn.onclick = () => cambiarPagina('prev');
    if (data.first) prevBtn.disabled = true;
    container.appendChild(prevBtn);

    let startPage = Math.max(0, paginaActual - 1);
    let endPage = Math.min(totalPages - 1, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-btn ${i === paginaActual ? 'active' : ''}`;
        btn.textContent = i + 1;
        btn.onclick = () => cambiarPagina(i + 1);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.textContent = '→';
    nextBtn.onclick = () => cambiarPagina('next');
    if (data.last) nextBtn.disabled = true;
    container.appendChild(nextBtn);
}

// ===== MODAL FUNCTIONS =====
function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    clearAllErrors();
}

async function verDetallesPedido(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const order = await response.json();
            const userEmail = order.user ? order.user.email : 'Unknown';
            const userName = order.user && order.user.name ? order.user.name : 'N/A';

            // CORRECCIÓN 1: Mostrar lista de productos
            let productsList = '';
            if (order.items && order.items.length > 0) {
                productsList = order.items.map(item =>
                    `${item.product.name} x${item.quantity}`
                ).join(', ');
            } else {
                productsList = 'N/A';
            }

            const date = new Date(order.orderDate).toLocaleString('es-CO');
            const estadoTraducido = traducirEstado(order.status);
            const shippingAddress = order.shippingAddress || 'No especificada';

            let statusClass = 'pending';
            if (order.status === 'IN_TRANSIT' || order.status === 'SHIPPED' || order.status === 'PROCESSING') statusClass = 'transito';
            else if (order.status === 'DELIVERED' || order.status === 'COMPLETED') statusClass = 'entregado';
            else if (order.status === 'CANCELLED') statusClass = 'cancelled';

            const detallesContent = document.getElementById('detallesContent');
            detallesContent.innerHTML = `
                <div style="line-height: 2;">
                    <p><strong>ID del Pedido:</strong> #${order.id}</p>
                    <p><strong>Fecha:</strong> ${date}</p>
                    <p><strong>Estado:</strong> <span class="status-badge ${statusClass}">${estadoTraducido}</span></p>
                    <hr style="border-color: rgba(57, 255, 20, 0.2); margin: 20px 0;">
                    <h4 style="color: var(--neon-green); margin-bottom: 10px;">Información del Cliente</h4>
                    <p><strong>Nombre:</strong> ${userName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Dirección:</strong> ${shippingAddress}</p>
                    <hr style="border-color: rgba(57, 255, 20, 0.2); margin: 20px 0;">
                    <h4 style="color: var(--neon-green); margin-bottom: 10px;">Detalles del Pedido</h4>
                    <p><strong>Productos:</strong> ${productsList}</p>
                    <p><strong>Total:</strong> <span style="color: var(--success-green); font-weight: 700; font-size: 24px;">$${order.totalAmount.toLocaleString()}</span></p>
                </div>
            `;
            document.getElementById('modalDetalles').classList.add('active');
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        mostrarNotificacion('❌ Error al cargar los detalles del pedido');
    }
}

async function editarPedido(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const order = await response.json();
            editingOrderId = id;

            const userEmail = order.user ? order.user.email : '';
            const userName = order.user && order.user.name ? order.user.name : 'N/A';

            // CORRECCIÓN 1: Mostrar lista de productos con cantidades
            let productsList = '';
            if (order.items && order.items.length > 0) {
                productsList = order.items.map(item =>
                    `${item.product.name} x${item.quantity}`
                ).join(', ');
            }

            const shippingAddress = order.shippingAddress || '';
            const cleanAddress = shippingAddress.replace(/\s*\([^)]*\)\s*$/, '');

            clearAllErrors();

            // Populate form
            document.getElementById('nuevoCliente').value = userName;
            document.getElementById('nuevoEmail').value = userEmail;
            document.getElementById('nuevoProducto').value = productsList;
            document.getElementById('nuevaDireccion').value = cleanAddress;
            document.getElementById('nuevoEstado').value = order.status;
            document.getElementById('nuevoEstado').setAttribute('disabled', true);

            document.getElementById('modalNuevoPedido').classList.add('active');
        }
    } catch (error) {
        console.error('Error fetching order for edit:', error);
        mostrarNotificacion('❌ Error al cargar el pedido para editar');
    }
}

async function guardarNuevoPedido() {
    if (!editingOrderId) {
        mostrarNotificacion('⚠️ Solo se permite editar pedidos existentes');
        return;
    }

    const direccion = document.getElementById('nuevaDireccion').value.trim();
    const estado = document.getElementById('nuevoEstado').value;
    const producto = document.getElementById('nuevoProducto').value;

    // Validaciones finales
    let hasErrors = false;

    if (!validateAddress(direccion)) {
        setError('nuevaDireccion', 'Dirección inválida o requerida');
        hasErrors = true;
    }

    if (!estado || estado === '') {
        setError('nuevoEstado', 'Debe seleccionar un estado');
        hasErrors = true;
    }

    if (hasErrors) {
        mostrarNotificacion('⚠️ Por favor corrige los errores en el formulario');
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${editingOrderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            mostrarNotificacion('❌ Error al obtener datos del pedido');
            return;
        }

        const currentOrder = await response.json();
        const productName = currentOrder.items && currentOrder.items.length > 0
            ? currentOrder.items[0].product.name
            : producto;
        const quantity = currentOrder.items && currentOrder.items.length > 0
            ? currentOrder.items[0].quantity
            : 1;

        const updateResponse = await fetch(`/api/admin/orders/${editingOrderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName: productName,
                quantity: quantity,
                status: estado,
                shippingAddress: direccion
            })
        });

        if (updateResponse.ok) {
            mostrarNotificacion('✅ Pedido actualizado exitosamente');
            cerrarModal('modalNuevoPedido');
            fetchOrders();
        } else {
            const error = await updateResponse.json();
            mostrarNotificacion('❌ ' + (error.error || 'Error al actualizar el pedido'));
        }
    } catch (error) {
        console.error('Error updating order:', error);
        mostrarNotificacion('❌ Error al actualizar el pedido');
    }
}

async function eliminarPedido(id) {
    if (!confirm('🗑️ ¿Estás seguro de cancelar este pedido?\n\nEl stock será restaurado automáticamente.')) {
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/admin/orders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            mostrarNotificacion('✅ Pedido cancelado y stock restaurado');
            fetchOrders();
        } else {
            const error = await response.json();
            mostrarNotificacion('❌ ' + (error.error || 'Error al cancelar el pedido'));
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        mostrarNotificacion('❌ Error al cancelar el pedido');
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    setupInputMasks();
    fetchOrders();
});

// ===== CERRAR MODAL AL HACER CLIC FUERA =====
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        clearAllErrors();
    }
}

// ===== MENSAJE DE BIENVENIDA EN CONSOLA =====
console.log('%c🚀 SNIKER - Gestión de Pedidos Cargado', 'color: #39ff14; font-size: 20px; font-weight: bold;');
console.log('%cSistema de Pedidos v2.1 - Estados estandarizados + Colores corregidos', 'color: #b026ff; font-size: 14px;');
