document.addEventListener('DOMContentLoaded', () => {
    fetchRefundRequests();
});

async function fetchRefundRequests() {
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('cuerpoTablaReembolsos');

    try {
        const response = await fetch('/api/orders/refunds', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const orders = await response.json();
            tbody.innerHTML = '';

            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay solicitudes de reembolso pendientes</td></tr>';
                return;
            }

            orders.forEach(order => {
                const tr = document.createElement('tr');
                const userEmail = order.user ? order.user.email : 'N/A';
                const userName = order.user && order.user.name ? order.user.name : 'Cliente';
                const avatarLetter = userName.charAt(0).toUpperCase();

                let actionsContent = '';
                let statusText = 'En espera';
                let statusClass = 'pendiente';

                if (order.refundStatus === 'APPROVED') {
                    statusText = 'Aprobado';
                    statusClass = 'completada';
                    actionsContent = `<span style="color: #888; font-size: 0.9em; font-weight: 600;">Finalizado</span>`;
                } else if (order.refundStatus === 'REJECTED') {
                    statusText = 'Rechazado';
                    statusClass = 'cancelada';
                    actionsContent = `<span style="color: #888; font-size: 0.9em; font-weight: 600;">Finalizado</span>`;
                } else {
                    actionsContent = `
                        <div class="botones-accion">
                            <button class="boton-accion" onclick="approveRefund(${order.id})" title="Aprobar" style="border-color: var(--verde-exito); color: var(--verde-exito);">✅</button>
                            <button class="boton-accion" onclick="openRejectModal(${order.id})" title="Rechazar" style="border-color: var(--rojo-error); color: var(--rojo-error);">❌</button>
                        </div>
                    `;
                }

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
                    <td title="${order.refundReason}" style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: middle; color: var(--texto-gris);">
                        ${order.refundReason}
                    </td>
                    <td><span class="precio-venta">$${order.totalAmount.toLocaleString()}</span></td>
                    <td><span class="estado-venta ${statusClass}">${statusText}</span></td>
                    <td>
                        ${actionsContent}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            console.error('Failed to fetch refunds');
        }
    } catch (error) {
        console.error('Error fetching refunds:', error);
    }
}

async function approveRefund(orderId) {
    if (!confirm('¿Estás seguro de APROBAR esta solicitud de reembolso?')) return;
    await processRefundResponse(orderId, 'APPROVED', 'Tu reembolso fue aprobado. En los próximos días se te devolverá el dinero.');
}

function openRejectModal(orderId) {
    document.getElementById('rechazoOrderId').value = orderId;
    document.getElementById('motivoRechazo').value = '';
    document.getElementById('modalRechazo').classList.add('activo');
}

function closingRejectModal() {
    document.getElementById('modalRechazo').classList.remove('activo');
}
// Alias for HTML onclick
window.cerrarModalRechazo = closingRejectModal;

async function confirmReject() {
    const orderId = document.getElementById('rechazoOrderId').value;
    const reason = document.getElementById('motivoRechazo').value;

    if (!reason.trim()) {
        alert('Debes especificar un motivo.');
        return;
    }

    await processRefundResponse(orderId, 'REJECTED', reason);
    closingRejectModal();
}
window.confirmarRechazo = confirmReject;

async function processRefundResponse(orderId, status, responseMsg) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/orders/${orderId}/refund/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status, response: responseMsg })
        });

        if (res.ok) {
            alert(`Solicitud ${status === 'APPROVED' ? 'Aprobada' : 'Rechazada'} correctamente.`);
            fetchRefundRequests();
        } else {
            alert('Error al procesar la solicitud.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión.');
    }
}
