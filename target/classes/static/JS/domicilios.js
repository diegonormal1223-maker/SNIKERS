// ===== VARIABLES GLOBALES =====
let paginaActual = 0;
let filtroEstado = 'todos';
let searchTimeout = null;

// CONFIGURACIÓN DE ESTADOS
const ESTADOS = {
    'PENDING': { clase: 'pendiente', texto: 'Pendiente', progreso: 15, icono: '⏳', color: '#fbbf24' },
    'PAID': { clase: 'pendiente', texto: 'Confirmado', progreso: 30, icono: '💰', color: '#fbbf24' },
    'SHIPPED': { clase: 'transito', texto: 'En Tránsito', progreso: 65, icono: '🚚', color: '#3b82f6' },
    'IN_TRANSIT': { clase: 'transito', texto: 'En Tránsito', progreso: 65, icono: '🚚', color: '#3b82f6' },
    'DELIVERED': { clase: 'entregado', texto: 'Entregado', progreso: 100, icono: '✅', color: '#10b981' },
    'CANCELLED': { clase: 'cancelado', texto: 'Cancelado', progreso: 0, icono: '❌', color: '#ef4444' }
};

document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarDomicilios();

    const buscarInput = document.getElementById('inputBusqueda');
    if (buscarInput) {
        buscarInput.addEventListener('keyup', buscarDomicilios);
    }
});

// ===== 1. CARGA DE TARJETAS KPI =====
async function cargarEstadisticas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const stats = data.deliveryStats;

            if (stats) {
                if (document.getElementById('kpiTotal')) document.getElementById('kpiTotal').textContent = stats.total || 0;
                if (document.getElementById('kpiTransito')) document.getElementById('kpiTransito').textContent = stats.transit || 0;
                if (document.getElementById('kpiPendientes')) document.getElementById('kpiPendientes').textContent = stats.pending || 0;
                if (document.getElementById('kpiEntregados')) document.getElementById('kpiEntregados').textContent = stats.delivered || 0;
            }
        }
    } catch (e) {
        console.error("Error cargando estadísticas:", e);
    }
}

// ===== 2. CARGA DE LISTADO =====
async function cargarDomicilios() {
    const token = localStorage.getItem('token');
    const busqueda = document.getElementById('inputBusqueda')?.value || '';
    const contenedor = document.getElementById('gridDomicilios');

    if (!token) {
        mostrarNotificacion('Sesión requerida', 'error');
        return;
    }

    let url = `/api/admin/orders?page=${paginaActual}&size=20`;

    if (filtroEstado !== 'todos') {
        let backendStatus = '';
        switch (filtroEstado) {
            case 'pendiente': backendStatus = 'PENDING'; break;
            case 'transito': backendStatus = 'SHIPPED'; break;
            case 'entregado': backendStatus = 'DELIVERED'; break;
            case 'cancelado': backendStatus = 'CANCELLED'; break;
        }
        if (backendStatus) url += `&status=${backendStatus}`;
    }

    if (busqueda) url += `&search=${encodeURIComponent(busqueda)}`;

    try {
        contenedor.style.opacity = '0.5';
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });

        if (response.ok) {
            const data = await response.json();
            renderizarTarjetas(data.content || []);
        } else {
            contenedor.innerHTML = '<p class="mensaje-vacio">Error al cargar datos.</p>';
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p class="mensaje-vacio">Error de conexión.</p>';
    } finally {
        contenedor.style.opacity = '1';
    }
}

function renderizarTarjetas(pedidos) {
    const contenedor = document.getElementById('gridDomicilios');
    contenedor.innerHTML = '';

    if (!pedidos || pedidos.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">No se encontraron domicilios.</p>';
        return;
    }

    const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

    pedidos.forEach(pedido => {
        const usuario = pedido.user || { name: 'Cliente', email: '' };
        const iniciales = usuario.name ? usuario.name.substring(0, 2).toUpperCase() : 'NN';
        const direccion = pedido.shippingAddress || 'Dirección no registrada';

        const primerItem = pedido.items && pedido.items.length > 0 ? pedido.items[0] : null;
        const infoProducto = primerItem ? `${primerItem.product.name}` : 'Sin detalles';

        const config = ESTADOS[pedido.status] || ESTADOS['PENDING'];

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-domicilio';
        tarjeta.dataset.estado = config.clase;
        tarjeta.onclick = () => verSeguimiento(pedido.id);

        tarjeta.innerHTML = `
            <div class="encabezado-tarjeta">
                <span class="id-domicilio">#DOM-${pedido.id}</span>
                <span class="estado-domicilio ${config.clase}">${config.texto}</span>
            </div>
            <div class="cuerpo-tarjeta">
                <div class="info-cliente-domicilio">
                    <div class="avatar-grande" style="background-color: ${config.color}">${iniciales}</div>
                    <div class="datos-cliente">
                        <div class="nombre-cliente-domicilio">${usuario.name}</div>
                        <div class="telefono-cliente">${usuario.email}</div>
                    </div>
                </div>
                <div class="seccion-info">
                    <div class="titulo-info">📍 Dirección</div>
                    <div class="contenido-info">${direccion}</div>
                </div>
                <div class="seccion-info">
                    <div class="titulo-info">📦 Producto</div>
                    <div class="contenido-info">${infoProducto}</div>
                </div>
                <div class="monto-domicilio">${formatter.format(pedido.totalAmount)}</div>
                
                <div class="barra-progreso">
                    <div class="progreso-relleno ${config.clase}" style="width: ${config.progreso}%"></div>
                </div>
                <div class="tiempo-estimado">${obtenerMensajeTiempo(pedido.status, pedido.orderDate)}</div>
            </div>
            <div class="pie-tarjeta">
                <button class="boton-tarjeta primario" onclick="event.stopPropagation(); verSeguimiento(${pedido.id})">Gestionar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function obtenerMensajeTiempo(estado, fecha) {
    const date = new Date(fecha);
    if (estado === 'DELIVERED') return `✅ Entregado el ${date.toLocaleDateString()}`;
    if (estado === 'CANCELLED') return `❌ Cancelado`;
    if (estado === 'SHIPPED' || estado === 'IN_TRANSIT') return `⏱️ En camino desde ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return `📅 Pedido: ${date.toLocaleDateString()}`;
}

// ===== 3. MODAL Y ACCIONES =====
async function verSeguimiento(orderId) {
    const token = localStorage.getItem('token');
    const modal = document.getElementById('modalSeguimiento');

    try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar pedido');
        const pedido = await response.json();

        // 1. Renderizar Timeline ESTILIZADO
        const timeline = modal.querySelector('.timeline-tracking');
        timeline.innerHTML = generarHTMLTimelineDetallado(pedido.status, pedido.orderDate);

        // 2. Configurar Botones del Pie del Modal
        const pieModal = modal.querySelector('.pie-modal');
        pieModal.innerHTML = `<button class="boton-secundario" onclick="cerrarModal()">Cerrar</button>`;

        const estadoActual = pedido.status;
        let nextStatus = '';
        let btnText = '';

        if (estadoActual === 'PENDING' || estadoActual === 'PAID') {
            nextStatus = 'SHIPPED';
            btnText = '🚚 Iniciar Ruta';
        } else if (estadoActual === 'SHIPPED' || estadoActual === 'IN_TRANSIT') {
            nextStatus = 'DELIVERED';
            btnText = '✅ Confirmar Entrega';
        }

        // Botón Cancelar (Rojo)
        if (estadoActual !== 'DELIVERED' && estadoActual !== 'CANCELLED') {
            const btnCancel = document.createElement('button');
            btnCancel.className = 'boton-tarjeta'; // Usamos clase base para estilo
            btnCancel.textContent = '❌ Cancelar Pedido';
            btnCancel.style.backgroundColor = '#ef4444';
            btnCancel.style.color = 'white';
            btnCancel.style.marginLeft = 'auto';
            btnCancel.onclick = () => {
                if (confirm('¿Estás seguro de cancelar este domicilio? Esta acción no se puede deshacer.')) {
                    cambiarEstadoPedido(pedido.id, 'CANCELLED');
                }
            };
            pieModal.appendChild(btnCancel);
        }

        // Botón Avanzar Estado (Verde/Azul)
        if (nextStatus) {
            const btnAdvance = document.createElement('button');
            btnAdvance.className = 'boton-tarjeta primario';
            btnAdvance.textContent = btnText;
            btnAdvance.style.marginLeft = '10px';
            btnAdvance.onclick = () => cambiarEstadoPedido(pedido.id, nextStatus);
            pieModal.appendChild(btnAdvance);
        }

        modal.classList.add('active');
        modal.style.display = 'flex';

    } catch (error) {
        console.error(error);
        mostrarNotificacion('Error al cargar detalles', 'error');
    }
}

// [!code focus:start]
// Generador de Timeline con el estilo visual "Rico" (5 pasos)
function generarHTMLTimelineDetallado(estadoActual, fechaPedido) {
    const fechaStr = new Date(fechaPedido).toLocaleString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const esTransito = estadoActual === 'SHIPPED' || estadoActual === 'IN_TRANSIT' || estadoActual === 'DELIVERED';
    const esEntregado = estadoActual === 'DELIVERED';
    const esCancelado = estadoActual === 'CANCELLED';

    if (esCancelado) {
        return `
            <div class="timeline-item cancelado">
                <div class="timeline-punto"></div>
                <div class="timeline-contenido">
                    <div class="timeline-titulo">❌ Pedido Cancelado</div>
                    <div class="timeline-fecha">${new Date().toLocaleDateString()}</div>
                    <div class="timeline-descripcion">El proceso de entrega se ha detenido por cancelación.</div>
                </div>
            </div>`;
    }

    // Definimos los 5 pasos visuales que te gustaban
    // Mapeamos el estado del backend a estos pasos visuales
    // PENDING -> Paso 1 Activo
    // SHIPPED -> Pasos 1, 2, 3 Completados, Paso 4 Activo
    // DELIVERED -> Todos Completados

    const pasos = [
        {
            titulo: '✅ Pedido Confirmado',
            desc: 'El pedido ha sido recibido y verificado.',
            completado: true, // Siempre true si no está cancelado
            fecha: fechaStr
        },
        {
            titulo: '📦 En Preparación',
            desc: 'El producto está siendo empacado.',
            completado: esTransito || esEntregado,
            fecha: esTransito ? 'Completado' : 'En proceso...'
        },
        {
            titulo: '🚚 Asignado a Repartidor',
            desc: 'Conductor asignado para la ruta.',
            completado: esTransito || esEntregado,
            fecha: esTransito ? 'Completado' : 'Pendiente'
        },
        {
            titulo: '🛣️ En Camino',
            desc: 'El repartidor está en camino a tu ubicación.',
            completado: esEntregado,
            activo: esTransito && !esEntregado, // Activo solo si está en tránsito
            fecha: esTransito ? 'En ruta ahora' : 'Pendiente'
        },
        {
            titulo: '🏠 Entrega Exitosa',
            desc: 'Pedido entregado al cliente.',
            completado: esEntregado,
            activo: esEntregado,
            fecha: esEntregado ? 'Entregado' : 'Pendiente'
        }
    ];

    let html = '';

    pasos.forEach(paso => {
        let clase = '';
        if (paso.completado) clase = 'completado'; // Línea verde sólida
        else if (paso.activo) clase = 'activo';    // Línea verde punteada o punto activo

        // Estilo de línea y punto
        const estiloPunto = paso.completado || paso.activo ? '' : 'background: var(--texto-gris);';
        const estiloLinea = paso.completado ? '' : (paso.activo ? '' : 'background: #e2e8f0;');

        html += `
            <div class="timeline-item ${clase}">
                <div class="timeline-punto" style="${estiloPunto}"></div>
                <div class="timeline-linea" style="${estiloLinea}"></div>
                <div class="timeline-contenido" style="${!paso.completado && !paso.activo ? 'opacity: 0.5;' : ''}">
                    <div class="timeline-titulo">${paso.titulo}</div>
                    <div class="timeline-fecha">${paso.fecha}</div>
                    <div class="timeline-descripcion">${paso.desc}</div>
                </div>
            </div>
        `;
    });

    return html;
}
// [!code focus:end]

async function cambiarEstadoPedido(id, nuevoEstado) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/admin/orders/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: nuevoEstado })
        });

        if (response.ok) {
            mostrarNotificacion(`Estado actualizado correctamente`, 'exito');
            cerrarModal();
            cargarDomicilios();
            cargarEstadisticas();
        } else {
            const err = await response.json();
            throw new Error(err.message || 'Error en servidor');
        }
    } catch (error) {
        mostrarNotificacion('Error al actualizar: ' + error.message, 'error');
    }
}

// Funciones Auxiliares
function filtrarDomicilios(event, filtro) {
    filtroEstado = filtro;
    paginaActual = 0;
    document.querySelectorAll('.boton-filtro').forEach(btn => btn.classList.remove('activo'));
    if (event) event.target.classList.add('activo');
    cargarDomicilios();
}

function buscarDomicilios() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { paginaActual = 0; cargarDomicilios(); }, 400);
}

function actualizarDomicilios() {
    cargarDomicilios();
    cargarEstadisticas();
    mostrarNotificacion('Datos actualizados', 'exito');
}

function cerrarModal() {
    const modal = document.getElementById('modalSeguimiento');
    if (modal) { modal.classList.remove('active'); modal.style.display = 'none'; }
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notificacion');
    if (!notificacion) return;
    notificacion.textContent = mensaje;
    notificacion.style.background = tipo === 'error' ? '#ef4444' : '#10b981';
    notificacion.classList.add('mostrar');
    setTimeout(() => notificacion.classList.remove('mostrar'), 3000);
}

window.onclick = function (event) {
    const modal = document.getElementById('modalSeguimiento');
    if (event.target === modal) cerrarModal();
}