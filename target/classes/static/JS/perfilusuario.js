// GLOBAL VARIABLES
let currentAddresses = [];
let editingAddressId = null;
let userOrders = []; // Store fetched orders

// VER SECCION
function showSection(sectionName) {
    // Eliminar activo de todos los elementos de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Agregar activo al elemento hecho clic
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(sectionName)) {
            item.classList.add('active');
        }
    });

    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }

    // Desplazarse hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// VER NOTIFICACION
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;

    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff3860, #ff0000)';
        notification.style.color = 'white';
    } else {
        notification.style.background = '';
        notification.style.color = '';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// FETCH USER PROFILE
async function fetchProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'loginyregistro.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            if (user.role === 'ADMIN') {
                window.location.href = 'dashboard.html';
                return;
            }
            localStorage.setItem('user', JSON.stringify(user));

            // Sidebar
            document.getElementById('sidebarName').textContent = user.name;
            document.getElementById('sidebarEmail').textContent = user.email;
            document.getElementById('sidebarAvatar').textContent = user.name.charAt(0).toUpperCase();

            // Form
            document.getElementById('profileName').value = user.name;
            document.getElementById('profileEmail').value = user.email;
            document.getElementById('profilePhone').value = user.phone || '';
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'loginyregistro.html';
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }

    fetchOrders();
}

// TRADUCCIONES DE ESTADO EN ESPAÑOL
const traduccionesEstado = {
    'PENDING': 'Pendiente',
    'PAID': 'Confirmado',
    'SHIPPED': 'Enviado',
    'IN_TRANSIT': 'En Tránsito',
    'DELIVERED': 'Entregado',
    'COMPLETED': 'Completado',
    'CANCELLED': 'Cancelado',
    'PROCESSING': 'En Proceso'
};

function obtenerTextoEstado(status, refundRequested, refundStatus) {
    if (refundStatus === 'PENDING') return 'En espera';
    if (refundStatus === 'APPROVED') return 'Aprobado';
    if (refundStatus === 'REJECTED') return 'Rechazado';
    return traduccionesEstado[status] || status;
}

// FETCH ORDERS
async function fetchOrders() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/orders/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const orders = await response.json();
            // Calcular numeracion secuencial (correlativo 1, 2, 3...) ordenando cronologicamente
            const sortedCronologicamente = [...orders].sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            sortedCronologicamente.forEach((o, index) => {
                o.secuencial = index + 1;
            });
            userOrders = orders;
            renderOrders(orders);

            // Update stats
            document.getElementById('statOrders').textContent = orders.length;
            document.getElementById('navOrderCount').textContent = orders.length;

            // Si llegamos desde el checkout con un orderId específico, abrir su detalle
            const urlParams = new URLSearchParams(window.location.search);
            const targetOrderId = urlParams.get('orderId');
            if (targetOrderId) {
                viewOrder(parseInt(targetOrderId, 10));
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// RENDER ORDERS
function renderOrders(orders) {
    const container = document.getElementById('ordersList');
    if (!container) return;
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No tienes pedidos aún</h3>
                <p>¡Explora nuestro catálogo y encuentra tus sneakers favoritos!</p>
                <a href="catalogo.html" class="btn-primary">Ir al Catálogo</a>
            </div>
        `;
        return;
    }

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';

        let statusClass = 'processing';
        if (order.refundStatus === 'APPROVED') statusClass = 'refund-approved';
        else if (order.refundStatus === 'PENDING') statusClass = 'refund-pending';
        else if (order.refundStatus === 'REJECTED') statusClass = 'refund-rejected';
        else if (order.status === 'CANCELLED') statusClass = 'cancelled';
        else if (order.status === 'DELIVERED' || order.status === 'COMPLETED') statusClass = 'completed';
        else if (order.status === 'SHIPPED') statusClass = 'shipped';

        const textoEstado = obtenerTextoEstado(order.status, order.refundRequested, order.refundStatus);

        card.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">Pedido #${order.secuencial || order.id}</div>
                    <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <span class="order-status ${statusClass}">${textoEstado}</span>
            </div>
            <div class="order-items">
                 ${order.items.map(item => `
                    <div class="order-item-image">
                        <img src="${item.product.imageUrl || 'img/placeholder.jpg'}" alt="${item.product.name}">
                    </div>
                    <div class="order-item-details">
                        <div class="order-item-name">${item.product.name}</div>
                        <div class="order-item-meta">Cant: ${item.quantity} | $${item.price}</div>
                    </div>
                 `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: $${order.totalAmount}</div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="viewOrder(${order.id})">Ver Detalles</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// LOGOUT
function logout() {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
        showNotification('👋 Cerrando sesión...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// FORMULARIO PERSONAL
document.getElementById('personalForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    const token = localStorage.getItem('token');

    // VALIDACIONES
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(name)) {
        showNotification('⚠️ El nombre no debe contener números ni símbolos', 'error');
        return;
    }

    // Validar rango 300-350
    const phoneRegex = /^3\d{9}$/;
    let phoneValid = false;
    if (phone) {
        if (phoneRegex.test(phone)) {
            const prefix = parseInt(phone.substring(0, 3));
            if (prefix >= 300 && prefix <= 350) {
                phoneValid = true;
            }
        }
    }

    if (phone && !phoneValid) {
        showNotification('⚠️ El teléfono debe ser un número válido de Colombia (300-350...)', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Update UI
            document.getElementById('sidebarName').textContent = updatedUser.name;
            document.getElementById('sidebarAvatar').textContent = updatedUser.name.charAt(0).toUpperCase();

            showNotification('✓ Datos actualizados correctamente');
        } else {
            const errorMsg = await response.text();
            showNotification('⚠️ ' + (errorMsg || 'Error al actualizar datos'), 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('⚠️ Error de conexión', 'error');
    }
});



// ACCIONES DE ORDEN
function viewOrder(orderId) {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('⚠️ Pedido no encontrado', 'error');
        return;
    }

    const modalContent = document.getElementById('orderDetailContent');
    
    let statusClass = 'processing';
    if (order.refundStatus === 'APPROVED') statusClass = 'refund-approved';
    else if (order.refundStatus === 'PENDING') statusClass = 'refund-pending';
    else if (order.refundStatus === 'REJECTED') statusClass = 'refund-rejected';
    else if (order.status === 'CANCELLED') statusClass = 'cancelled';
    else if (order.status === 'DELIVERED' || order.status === 'COMPLETED') statusClass = 'completed';
    else if (order.status === 'SHIPPED') statusClass = 'shipped';

    const textoEstado = obtenerTextoEstado(order.status, order.refundRequested, order.refundStatus);

    const itemsHtml = order.items.map(item => `
        <div style="display: flex; align-items: center; gap: 15px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <img src="${item.product.imageUrl || 'img/placeholder.jpg'}" 
                 alt="${item.product.name}" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 600; color: white;">${item.product.name}</div>
                <div style="font-size: 0.9em; color: var(--text-gray);">
                    Cantidad: ${item.quantity} x $${item.price.toLocaleString()}
                </div>
            </div>
            <div style="font-weight: 700; color: var(--neon-green);">
                $${(item.quantity * item.price).toLocaleString()}
            </div>
        </div>
    `).join('');

    // Shipping Address formatting
    const address = order.shippingAddress || 'Dirección no disponible';

    // Discount handling
    const discountRow = order.discountAmount ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: var(--success-green);">
            <span>Descuento (${order.couponCode || 'Aplicado'}):</span>
            <span>-$${order.discountAmount.toLocaleString()}</span>
        </div>
    ` : '';

    const subtotal = order.totalAmount + (order.discountAmount || 0);

    // Refund Section Logic
    let refundSection = '';
    if (order.refundStatus === 'APPROVED') {
        refundSection = `
            <div style="margin-top: 15px; padding: 15px; background: rgba(57, 255, 20, 0.1); border: 1px solid var(--neon-green); border-radius: 8px; color: var(--neon-green);">
                <h4 style="margin: 0 0 5px;">✅ Reembolso Aprobado</h4>
                <p style="margin: 0; font-size: 0.9em;">${order.refundResponse || 'Tu reembolso ha sido aprobado y será procesado en breve.'}</p>
            </div>
        `;
    } else if (order.refundStatus === 'REJECTED') {
        refundSection = `
            <div style="margin-top: 15px; padding: 15px; background: rgba(255, 56, 96, 0.1); border: 1px solid #ff3860; border-radius: 8px; color: #ff3860;">
                <h4 style="margin: 0 0 5px;">❌ Solicitud Rechazada</h4>
                <p style="margin: 0; font-size: 0.9em;">Motivo: ${order.refundResponse || 'No especificado.'}</p>
            </div>
        `;
    } else if (order.refundRequested) {
        refundSection = `
            <div style="margin-top: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; color: var(--text-gray);">
                <h4 style="margin: 0 0 5px;">⏳ Solicitud en Revisión</h4>
                <p style="margin: 0; font-size: 0.9em;">Tu solicitud de reembolso está siendo revisada por un administrador.</p>
            </div>
        `;
    } else if (['PENDING', 'PAID', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
        refundSection = `
            <button class="btn-secondary" style="margin-top: 15px; width: 100%; border: 1px solid var(--neon-green); color: var(--neon-green); background: transparent;" 
                    onmouseover="this.style.background='rgba(57, 255, 20, 0.1)'" 
                    onmouseout="this.style.background='transparent'"
                    onclick="showRefundForm(${order.id})">
                Solicitar Reembolso
            </button>
        `;
    }

    modalContent.innerHTML = `
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h2 style="margin: 0; color: var(--neon-green);">Pedido #${order.secuencial || order.id}</h2>
                    <p style="margin: 5px 0 0; color: var(--text-gray);">
                        Realizado el ${new Date(order.orderDate).toLocaleString()}
                    </p>
                </div>
                <span class="order-status ${statusClass}" style="font-size: 0.9em;">
                    ${textoEstado}
                </span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px;">
                <h4 style="margin: 0 0 10px; color: var(--text-white);">📍 Dirección de Envío</h4>
                <p style="margin: 0; color: var(--text-gray); font-size: 0.95em; line-height: 1.4;">
                    ${address}
                </p>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px;">
                <h4 style="margin: 0 0 10px; color: var(--text-white);">💳 Método de Pago</h4>
                <p style="margin: 0; color: var(--text-gray); font-size: 0.95em;">
                    ${order.paymentMethod || 'No especificado'}
                </p>
            </div>
        </div>

        <h3 style="margin-bottom: 15px;">Productos</h3>
        <div style="margin-bottom: 25px;">
            ${itemsHtml}
        </div>

        <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: var(--text-gray);">Subtotal:</span>
                <span>$${subtotal.toLocaleString()}</span>
            </div>
            ${discountRow}
            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 1.2em; font-weight: 700;">
                <span>Total:</span>
                <span style="color: var(--neon-green);">$${order.totalAmount.toLocaleString()}</span>
            </div>
            ${refundSection}
        </div>
    `;

    document.getElementById('orderDetailModal').style.display = 'block';
}

function showRefundForm(orderId) {
    const modalContent = document.getElementById('orderDetailContent');
    const order = userOrders.find(o => o.id === orderId);

    if (!order) return;

    modalContent.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: var(--neon-green); margin-bottom: 15px;">Solicitar Reembolso</h2>
            <p style="color: var(--text-gray); margin-bottom: 25px;">
                Por favor, cuéntanos el motivo por el cual deseas solicitar el reembolso del pedido #${order.secuencial || orderId}.
            </p>

            <form onsubmit="submitRefund(event, ${orderId})" style="text-align: left;">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="refundReason" style="display: block; margin-bottom: 8px; color: var(--text-white);">Motivo del reembolso</label>
                    <textarea id="refundReason" rows="5" 
                        placeholder="Ej: El producto llegó dañado, talla incorrecta, etc."
                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; resize: none;" required></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <button type="button" class="btn-secondary" onclick="viewOrder(${orderId})" style="text-align: center;">
                        Cancelar
                    </button>
                    <button type="submit" class="btn-save" style="text-align: center;">
                        Confirmar Solicitud
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function submitRefund(event, orderId) {
    event.preventDefault();
    const reason = document.getElementById('refundReason').value;

    if (!reason.trim()) {
        showNotification('⚠️ Por favor especifica un motivo', 'error');
        return;
    }

    // API Call
    const btn = event.submitter;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Procesando...';

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/orders/${orderId}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reason })
        });

        if (response.ok) {
            showNotification('✅ Solicitud de reembolso enviada con éxito');
            closeOrderModal();
            fetchOrders(); // Refresh status
        } else {
            showNotification('⚠️ Error al enviar solicitud', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('⚠️ Error de conexión', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

function closeOrderModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

function getStatusClass(status) {
    switch (status) {
        case 'DELIVERED': return 'completed';
        case 'SHIPPED': return 'shipped';
        case 'CANCELLED': return 'cancelled';
        default: return 'processing';
    }
}


// ADDRESS MANAGEMENT
function addNewAddress() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Modal not found');
    }
}

function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('addressForm').reset();
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const addrModal = document.getElementById('addressModal');
    const orderModal = document.getElementById('orderDetailModal');

    if (event.target == addrModal) {
        closeAddressModal();
    }
    if (event.target == orderModal) {
        closeOrderModal();
    }
}

// AUTOCOMPLETE LOGIC
function initAutocomplete() {
    const deptInput = document.getElementById('addrState');
    const cityInput = document.getElementById('addrCity');
    const deptList = document.getElementById('departmentsList');
    const cityList = document.getElementById('citiesList');

    if (!deptInput || !cityInput || !deptList || !cityList || typeof colombiaData === 'undefined') return;

    // Populate Departments
    Object.keys(colombiaData).sort().forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        deptList.appendChild(option);
    });

    // Handle Department Change
    deptInput.addEventListener('change', function () {
        const selectedDept = this.value;
        cityList.innerHTML = ''; // Clear cities
        cityInput.value = ''; // Clear city input

        if (colombiaData[selectedDept]) {
            colombiaData[selectedDept].sort().forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                cityList.appendChild(option);
            });
        }
    });

    // Also update on input if it matches a valid department
    deptInput.addEventListener('input', function () {
        const selectedDept = this.value;
        if (colombiaData[selectedDept]) {
            cityList.innerHTML = '';
            colombiaData[selectedDept].sort().forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                cityList.appendChild(option);
            });
        }
    });
}

// INPUT MASKING
// INPUT MASKING
function setupInputMasks() {
    // Helper to allow only letters and spaces, max 30 chars, single space
    const maskName = (e) => {
        let val = e.target.value;

        // 1. Remove invalid characters (keep letters and spaces)
        val = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

        // 2. Enforce single space between words
        val = val.replace(/\s{2,}/g, ' ');

        // 3. Enforce max length 30
        if (val.length > 30) {
            val = val.substring(0, 30);
        }

        e.target.value = val;
    };

    // Helper to allow only numbers, max 10 chars, starts with 3, prefix 300-350
    const maskPhone = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits

        // Enforce max length 10
        if (val.length > 10) {
            val = val.substring(0, 10);
        }

        e.target.value = val;

        // Real-time validation feedback
        let isValid = true;
        let errorMsg = '';
        const errorEl = document.getElementById(e.target.id + '-error');

        // Check 1: Must be 10 digits
        if (val.length < 10) {
            isValid = false;
            if (val.length > 0) errorMsg = 'Debe tener 10 dígitos';
        }

        // Check 2: Must start with 3 and prefix between 300-350
        if (val.length >= 3) {
            const prefix = parseInt(val.substring(0, 3));
            if (prefix < 300 || prefix > 350) {
                isValid = false;
                errorMsg = 'Prefijo inválido (300-350)';
            }
        } else if (val.length > 0 && val.charAt(0) !== '3') {
            // Immediate feedback if first char is not 3
            isValid = false;
            errorMsg = 'Debe empezar con 3';
        }

        if (!isValid && val.length > 0) {
            e.target.classList.add('input-error');
            if (errorEl) {
                errorEl.textContent = errorMsg;
                errorEl.classList.add('visible');
            }
        } else {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    };

    // Profile Fields
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.addEventListener('input', maskName);

    const profilePhone = document.getElementById('profilePhone');
    if (profilePhone) profilePhone.addEventListener('input', maskPhone);

    // Address Fields - with comprehensive validations

    // Address Label validation (max 30 chars, single space, required)
    const maskAddressLabel = (e) => {
        let val = e.target.value;
        const errorEl = document.getElementById('addrLabel-error');

        // Remove invalid characters, enforce single space
        val = val.replace(/\s{2,}/g, ' ');

        // Enforce max length 30
        if (val.length > 30) {
            val = val.substring(0, 30);
        }

        e.target.value = val;

        // Show error if empty (on blur will be handled separately)
        if (val.trim().length === 0) {
            e.target.classList.add('input-error');
            if (errorEl) {
                errorEl.textContent = 'Campo requerido';
                errorEl.classList.add('visible');
            }
        } else {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    };

    // Recipient Name validation (letters only, single space, required)
    const maskRecipientName = (e) => {
        let val = e.target.value;
        const errorEl = document.getElementById('addrRecipient-error');

        // Remove invalid characters (keep only letters and spaces)
        val = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

        // Enforce single space
        val = val.replace(/\s{2,}/g, ' ');

        e.target.value = val;

        // Show error if empty
        if (val.trim().length === 0) {
            e.target.classList.add('input-error');
            if (errorEl) {
                errorEl.textContent = 'Campo requerido';
                errorEl.classList.add('visible');
            }
        } else {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    };

    // Street Address validation (max 60 chars, single space, required)
    const maskStreetAddress = (e) => {
        let val = e.target.value;
        const errorEl = document.getElementById('addrStreet-error');

        // Enforce single space
        val = val.replace(/\s{2,}/g, ' ');

        // Enforce max length 60
        if (val.length > 60) {
            val = val.substring(0, 60);
        }

        e.target.value = val;

        // Show error if empty
        if (val.trim().length === 0) {
            e.target.classList.add('input-error');
            if (errorEl) {
                errorEl.textContent = 'Campo requerido';
                errorEl.classList.add('visible');
            }
        } else {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    };

    // Department validation (must be in colombiaData)
    const validateDepartment = (e) => {
        const val = e.target.value.trim();
        const errorEl = document.getElementById('addrState-error');

        if (val.length === 0) {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
            return;
        }

        // Check if value exists in colombiaData
        if (typeof colombiaData !== 'undefined' && !colombiaData[val]) {
            e.target.classList.add('input-error');
            if (errorEl) {
                errorEl.textContent = 'Opción inválida';
                errorEl.classList.add('visible');
            }
        } else {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    };

    // City validation (must be in selected department's cities)
    const validateCity = (e) => {
        const val = e.target.value.trim();
        const errorEl = document.getElementById('addrCity-error');
        const deptInput = document.getElementById('addrState');

        if (val.length === 0) {
            e.target.classList.remove('input-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
            return;
        }

        // Check if value exists in the selected department's cities
        if (typeof colombiaData !== 'undefined' && deptInput && deptInput.value) {
            const cities = colombiaData[deptInput.value];
            if (cities && !cities.includes(val)) {
                e.target.classList.add('input-error');
                if (errorEl) {
                    errorEl.textContent = 'Opción inválida';
                    errorEl.classList.add('visible');
                }
            } else {
                e.target.classList.remove('input-error');
                if (errorEl) {
                    errorEl.classList.remove('visible');
                }
            }
        }
    };

    // Attach event listeners
    const addrLabel = document.getElementById('addrLabel');
    if (addrLabel) {
        addrLabel.addEventListener('input', maskAddressLabel);
        addrLabel.addEventListener('blur', maskAddressLabel);
    }

    const addrRecipient = document.getElementById('addrRecipient');
    if (addrRecipient) {
        addrRecipient.addEventListener('input', maskRecipientName);
        addrRecipient.addEventListener('blur', maskRecipientName);
    }

    const addrStreet = document.getElementById('addrStreet');
    if (addrStreet) {
        addrStreet.addEventListener('input', maskStreetAddress);
        addrStreet.addEventListener('blur', maskStreetAddress);
    }

    const addrState = document.getElementById('addrState');
    if (addrState) {
        addrState.addEventListener('input', validateDepartment);
        addrState.addEventListener('blur', validateDepartment);
    }

    const addrCity = document.getElementById('addrCity');
    if (addrCity) {
        addrCity.addEventListener('input', validateCity);
        addrCity.addEventListener('blur', validateCity);
    }

    const addrPhone = document.getElementById('addrPhone');
    if (addrPhone) addrPhone.addEventListener('input', maskPhone);
}



// FETCH ADDRESSES
async function fetchAddresses() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/addresses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            currentAddresses = await response.json();
            renderAddresses(currentAddresses);
            const statAddresses = document.getElementById('statAddresses');
            if (statAddresses) statAddresses.textContent = currentAddresses.length;
        }
    } catch (error) {
        console.error('Error fetching addresses:', error);
    }
}

// RENDER ADDRESSES
function renderAddresses(addresses) {
    const container = document.querySelector('.addresses-grid');
    if (!container) return;

    // Keep the "Add New" button
    const addButton = container.querySelector('.add-address-card');
    container.innerHTML = '';

    addresses.forEach(addr => {
        const card = document.createElement('div');
        card.className = 'address-card';

        // Check both 'default' and 'isDefault' properties
        const isDefault = addr.default === true || addr.isDefault === true;

        if (isDefault) card.classList.add('default');

        // Determine icon based on label
        let icon = '📍';
        const labelLower = (addr.label || '').toLowerCase();
        if (labelLower.includes('casa') || labelLower.includes('home')) icon = '🏠';
        else if (labelLower.includes('oficina') || labelLower.includes('work') || labelLower.includes('trabajo')) icon = '🏢';
        else if (labelLower.includes('edificio') || labelLower.includes('apto') || labelLower.includes('apartamento')) icon = '🏢';
        else if (labelLower.includes('universidad') || labelLower.includes('u')) icon = '🎓';

        // Format zip code display
        const zipDisplay = (addr.zipCode && addr.zipCode !== '00000') ? `- ${addr.zipCode}` : '';

        card.innerHTML = `
            <div class="address-type">
                <span class="address-icon">${icon}</span>
                <span class="address-label">${addr.label || 'Dirección'}</span>
                ${isDefault ? '<span class="default-badge">Principal</span>' : ''}
            </div>
            <div class="address-details">
                ${addr.recipientName || ''}<br>
                ${addr.streetAddress || ''}<br>
                ${addr.city || ''}, ${addr.state || ''}<br>
                ${addr.country || 'Colombia'} ${zipDisplay}<br>
                ${addr.phone || ''}
            </div>
            <div class="address-actions">
                ${!isDefault ? `<button class="btn-small" onclick="setDefaultAddress(${addr.id})">Principal</button>` : ''}
                <button class="btn-small" onclick="editAddress(${addr.id})">Editar</button>
                <button class="btn-small" onclick="deleteAddress(${addr.id})">Eliminar</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-append the add button at the end
    if (addButton) {
        container.appendChild(addButton);
    } else {
        // If it was lost, recreate it
        const addCard = document.createElement('div');
        addCard.className = 'add-address-card';
        addCard.onclick = addNewAddress;
        addCard.innerHTML = `
            <div class="add-icon">+</div>
            <div style="font-weight: 700; text-transform: uppercase; color: var(--neon-green);">
                Agregar Nueva Dirección
            </div>
        `;
        container.appendChild(addCard);
    }
}

// DELETE ADDRESS
async function deleteAddress(id) {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/addresses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showNotification('✓ Dirección eliminada');
            fetchAddresses();
        } else {
            showNotification('❌ Error al eliminar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// SET DEFAULT ADDRESS
async function setDefaultAddress(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/addresses/${id}/default`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showNotification('✓ Dirección predeterminada actualizada');
            fetchAddresses();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// EDIT ADDRESS
function editAddress(id) {
    const address = currentAddresses.find(a => a.id === id);
    if (!address) {
        console.error('Address not found');
        return;
    }

    editingAddressId = id; // Set global editing ID

    // Populate form
    document.getElementById('addrLabel').value = address.label || '';
    document.getElementById('addrRecipient').value = address.recipientName || '';
    document.getElementById('addrStreet').value = address.streetAddress || '';
    document.getElementById('addrState').value = address.state || '';
    document.getElementById('addrCity').value = address.city || '';
    document.getElementById('addrPhone').value = address.phone || '';

    // Update Modal Title
    const modalTitle = document.querySelector('#addressModal h2');
    if (modalTitle) modalTitle.textContent = 'Editar Dirección';

    // Update Button Text
    const submitBtn = document.querySelector('#addressForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Actualizar Dirección';

    // Show Modal
    const modal = document.getElementById('addressModal');
    if (modal) modal.style.display = 'block';
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchAddresses();
    initAutocomplete();
    setupInputMasks();

    // Redireccionamiento dinámico por parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const action = urlParams.get('action');
    if (tab) {
        showSection(tab);
    }
    if (action === 'add-address') {
        addNewAddress();
    }

    // SAVE ADDRESS LISTENER
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const addressData = {
                label: document.getElementById('addrLabel').value.trim(),
                recipientName: document.getElementById('addrRecipient').value.trim(),
                streetAddress: document.getElementById('addrStreet').value.trim(),
                city: document.getElementById('addrCity').value.trim(),
                state: document.getElementById('addrState').value.trim(),
                phone: document.getElementById('addrPhone').value.trim()
            };

            // VALIDACIONES
            if (!addressData.label || !addressData.streetAddress || !addressData.city || !addressData.state) {
                showNotification('⚠️ Por favor completa todos los campos obligatorios', 'error');
                return;
            }

            const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!nameRegex.test(addressData.recipientName)) {
                showNotification('⚠️ El nombre del destinatario no debe contener números ni símbolos', 'error');
                return;
            }

            // Validar rango 300-350
            const phoneRegex = /^3\d{9}$/;
            let phoneValid = false;
            if (phoneRegex.test(addressData.phone)) {
                const prefix = parseInt(addressData.phone.substring(0, 3));
                if (prefix >= 300 && prefix <= 350) {
                    phoneValid = true;
                }
            }

            if (!phoneValid) {
                showNotification('⚠️ El teléfono debe ser un número válido de Colombia (300-350...)', 'error');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'loginyregistro.html';
                return;
            }

            try {
                let url = '/api/addresses';
                let method = 'POST';

                // If editing, change URL and Method (assuming backend supports PUT /api/addresses/{id})
                // Since we didn't implement PUT /api/addresses/{id} in the backend plan yet, 
                // we might need to stick to CREATE or implement UPDATE in backend.
                // Wait, looking at the backend plan, we only implemented:
                // GET, POST, DELETE, PUT /default
                // We MISSING PUT /api/addresses/{id} for update!

                // For now, let's assume we need to implement it or use a workaround.
                // But the user asked to fix the "Edit" button.
                // I'll implement the frontend logic for PUT, and if it fails, I'll know I need to update backend.
                // Actually, I should check if I implemented update in backend.
                // Checking AddressController... I did NOT implement update address details.
                // I only implemented create, delete, and set default.

                // CRITICAL: I need to add update endpoint to backend first?
                // Or I can delete and re-create? No, that changes ID.
                // I will assume for this step I will try to use POST for now or fail gracefully?
                // No, I should do it right.

                // Let's implement the frontend logic assuming the endpoint exists or will exist.
                // Wait, I can't modify backend in this same turn easily without context switch.
                // But I can try to use POST to create a new one if I can't update?
                // No, "Edit" implies updating.

                // Let's check if I can quickly add the endpoint to backend in next step.
                // For this file modification, I will prepare the frontend to send PUT if editingAddressId is set.

                if (editingAddressId) {
                    // Ideally: url = `/api/addresses/${editingAddressId}`; method = 'PUT';
                    // But since I know I didn't make it, I will use a workaround or just log it for now?
                    // No, the user wants it to work.
                    // I will implement the frontend code to send the PUT request.
                    // And I will tell the user I need to update the backend to support it.

                    // ACTUALLY, I can just use the POST endpoint to create a new one and delete the old one?
                    // That's a hack.

                    // I will write the code to send PUT.
                    url = `/api/addresses/${editingAddressId}`;
                    method = 'PUT';
                }

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(addressData)
                });

                if (response.ok) {
                    showNotification(editingAddressId ? '✓ Dirección actualizada' : '✓ Dirección guardada');
                    closeAddressModal();
                    fetchAddresses(); // Refresh list
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Server Error:', errorData);
                    showNotification('❌ Error: ' + (errorData.message || 'No se pudo guardar'), 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('❌ Error de conexión', 'error');
            }
        });
    } else {
        console.error('Address form not found on load');
    }
});

function addNewAddress() {
    editingAddressId = null; // Reset editing ID

    // Reset form
    document.getElementById('addressForm').reset();

    // Reset Title and Button
    const modalTitle = document.querySelector('#addressModal h2');
    if (modalTitle) modalTitle.textContent = 'Agregar Nueva Dirección';

    const submitBtn = document.querySelector('#addressForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Guardar Dirección';

    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Modal not found');
    }
}
