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

                let actionsContent = '';
                if (order.refundStatus === 'PENDING') {
                    actionsContent = `
                        <button class="icon-btn action-approve" onclick="approveRefund(${order.id})" title="Aprobar">✅</button>
                        <button class="icon-btn action-reject" onclick="openRejectModal(${order.id})" title="Rechazar">❌</button>
                    `;
                } else {
                    actionsContent = `<span style="color: #888; font-size: 0.9em;">Finalizado</span>`;
                }

                tr.innerHTML = `
                    <td>#${order.id}</td>
                    <td>${userEmail}</td>
                    <td title="${order.refundReason}" style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${order.refundReason}
                    </td>
                    <td>$${order.totalAmount.toLocaleString()}</td>
                    <td><span class="badge-refund-pending">${order.refundStatus}</span></td>
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
    document.getElementById('modalRechazo').style.display = 'block';
}

function closingRejectModal() {
    document.getElementById('modalRechazo').style.display = 'none';
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
