let currentStep = 1;
let selectedAddress = null;
let selectedShipping = 1;
let selectedPayment = 'card';
let userAddresses = [];

// NAVEGACIÓN ENTRE PASOS
function nextStep(step) {
    if (!validateStep(currentStep)) {
        return;
    }

    document.getElementById(`step-${getStepName(currentStep)}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`step-${getStepName(step)}`).classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    document.getElementById(`step-${getStepName(currentStep)}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`step-${getStepName(step)}`).classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStepName(step) {
    const steps = ['', 'shipping', 'method', 'payment'];
    return steps[step];
}

function updateProgress() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-circle').textContent = '✓';
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.querySelector('.step-circle').textContent = stepNum;
        } else {
            step.querySelector('.step-circle').textContent = stepNum;
        }
    });

    const progress = ((currentStep - 1) / 2) * 100;
    document.getElementById('progressLine').style.width = progress + '%';
}

function validateStep(step) {
    switch (step) {
        case 1:
            return validateShipping();
        case 2:
            return true;
        case 3:
            return validatePayment();
        default:
            return true;
    }
}

function validateShipping() {
    if (!selectedAddress) {
        alert('Por favor selecciona una dirección de envío');
        return false;
    }
    return true;
}

function validatePayment() {
    if (selectedPayment !== 'card' && selectedPayment !== 'debit') {
        return true;
    }

    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardHolder = document.getElementById('cardHolder').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;

    let isValid = true;

    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        showError('cardNumber', 'El número de tarjeta debe tener 16 dígitos');
        isValid = false;
    }

    const holderWords = cardHolder.split(/\s+/).filter(word => word.length > 0);
    if (holderWords.length < 2) {
        showError('cardHolder', 'Ingresa nombre y apellido del titular');
        isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cardHolder)) {
        showError('cardHolder', 'El titular solo puede contener letras');
        isValid = false;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        showError('cardExpiry', 'Formato: MM/AA');
        isValid = false;
    } else {
        const [month, year] = cardExpiry.split('/').map(num => parseInt(num));
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            showError('cardExpiry', 'Mes inválido (01-12)');
            isValid = false;
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            showError('cardExpiry', 'La tarjeta está vencida');
            isValid = false;
        }
    }

    if (cardCVV.length < 3 || cardCVV.length > 4 || !/^\d+$/.test(cardCVV)) {
        showError('cardCVV', 'CVV debe tener 3 o 4 dígitos');
        isValid = false;
    }

    return isValid;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(`${inputId}-error`);

    input.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

// ADDRESS LOGIC
async function loadSavedAddresses() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNoAddresses();
        return;
    }

    try {
        const response = await fetch('/api/addresses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            userAddresses = await response.json();
            renderAddresses();
        } else {
            showNoAddresses();
        }
    } catch (error) {
        console.error('Error loading addresses:', error);
        showNoAddresses();
    }
}

function renderAddresses() {
    const savedContainer = document.getElementById('savedAddressesContainer');
    const noAddressContainer = document.getElementById('noAddressesContainer');
    const container = document.getElementById('savedAddressesList');

    if (userAddresses.length > 0) {
        savedContainer.style.display = 'block';
        noAddressContainer.style.display = 'none';

        container.innerHTML = userAddresses.map(addr => `
            <div class="address-card" onclick="selectAddress(${addr.id})" data-id="${addr.id}">
                <div class="address-type">${getAddressIcon(addr.label)} ${addr.label}</div>
                <div class="address-details">
                    <strong>${addr.recipientName}</strong><br>
                    ${addr.streetAddress}<br>
                    ${addr.city}, ${addr.state}<br>
                    📞 ${addr.phoneNumber}
                </div>
            </div>
        `).join('');

        if (!selectedAddress && userAddresses.length > 0) {
            selectAddress(userAddresses[0].id);
        }
    } else {
        showNoAddresses();
    }
}

function showNoAddresses() {
    const savedContainer = document.getElementById('savedAddressesContainer');
    const noAddressContainer = document.getElementById('noAddressesContainer');

    savedContainer.style.display = 'none';
    noAddressContainer.style.display = 'block';
}

function getAddressIcon(label) {
    const l = label.toLowerCase();
    if (l.includes('casa') || l.includes('hogar')) return '🏠';
    if (l.includes('oficina') || l.includes('trabajo')) return '🏢';
    if (l.includes('universidad') || l.includes('estudio')) return '🎓';
    return '📍';
}

function redirectToAddresses() {
    window.location.href = 'perfilusuario.html?tab=addresses&action=add-address';
}

function selectAddress(id) {
    document.querySelectorAll('.address-card').forEach(card => {
        card.classList.remove('selected');
    });

    const card = document.querySelector(`.address-card[data-id="${id}"]`);
    if (card) card.classList.add('selected');

    selectedAddress = id;
}

function selectShipping(id) {
    document.querySelectorAll('.shipping-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.shipping-option').classList.add('selected');
    selectedShipping = id;
}

function selectPayment(type) {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    event.target.closest('.payment-method').classList.add('selected');
    selectedPayment = type;

    const cardForm = document.getElementById('cardForm');
    if (type === 'card' || type === 'debit') {
        cardForm.classList.add('show');
    } else {
        cardForm.classList.remove('show');
    }
}

// LOAD CART SUMMARY
async function loadOrderSummary() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const cart = await response.json();
            renderCartSummary(cart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function renderCartSummary(cart) {
    const container = document.querySelector('.summary-items');
    if (!container) return;

    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<div class="summary-item">Tu carrito está vacío</div>';
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.items.map(item => {
        const total = item.product.price * item.quantity;
        subtotal += total;
        return `
            <div class="summary-item">
                <div class="summary-item-image">
                    <img src="${item.product.imageUrl || 'img/placeholder.jpg'}" alt="${item.product.name}">
                </div>
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.product.name}</div>
                    <div class="summary-item-meta">Talla: ${item.size || 'N/A'} | Cantidad: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">$${total.toLocaleString()}</div>
            </div>
        `;
    }).join('');

    let discountPercent = 0;
    let couponCode = null;
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
        try {
            const couponData = JSON.parse(savedCoupon);
            discountPercent = couponData.discountPercent;
            couponCode = couponData.code;
        } catch (e) {
            console.error('Error loading saved coupon:', e);
        }
    }

    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;

    const summaryValues = document.querySelectorAll('.summary-value');
    if (summaryValues.length >= 5) {
        summaryValues[0].textContent = `$${subtotal.toLocaleString()}`;

        if (discount > 0) {
            summaryValues[2].textContent = `-$${discount.toLocaleString()}`;
            summaryValues[2].style.color = 'var(--neon-green)';
        } else {
            summaryValues[2].textContent = '$0.00';
        }

        summaryValues[4].textContent = `$${total.toLocaleString()}`;
    }
}

async function completeOrder() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión');
        window.location.href = 'loginyregistro.html';
        return;
    }

    if (!validatePayment()) {
        return;
    }

    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '⏳ Procesando...';

    let fullAddress = '';
    if (selectedAddress) {
        const addr = userAddresses.find(a => a.id === selectedAddress);
        if (addr) {
            fullAddress = `${addr.streetAddress}, ${addr.city}, ${addr.state} (${addr.recipientName})`;
        }
    }

    const savedCoupon = localStorage.getItem('appliedCoupon');
    let couponCode = null;
    let discountPercent = null;

    if (savedCoupon) {
        try {
            const couponData = JSON.parse(savedCoupon);
            couponCode = couponData.code;
            discountPercent = couponData.discountPercent;
        } catch (e) {
            console.error('Error parsing coupon:', e);
        }
    }

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shippingAddress: fullAddress,
                paymentMethod: selectedPayment === 'card' ? 'CREDIT_CARD' : 'DEBIT_CARD',
                couponCode: couponCode,
                discountPercent: discountPercent
            })
        });

        if (response.ok) {
            const order = await response.json();

            document.getElementById('step-payment').classList.remove('active');
            document.getElementById('successScreen').classList.add('show');
            document.getElementById('orderNumber').textContent = `SNKR-${order.id}`;

            // Actualizar el enlace "Ver mi pedido" con el ID del pedido real
            const verPedidoBtn = document.querySelector('.success-btn.secondary');
            if (verPedidoBtn) {
                verPedidoBtn.href = `perfilusuario.html?tab=orders&orderId=${order.id}`;
            }

            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active');
                step.classList.add('completed');
                step.querySelector('.step-circle').textContent = '✓';
            });
            document.getElementById('progressLine').style.width = '100%';

            window.scrollTo({ top: 0, behavior: 'smooth' });
            localStorage.removeItem('appliedCoupon');

        } else {
            throw new Error('Error creating order');
        }
    } catch (error) {
        console.error(error);
        alert('Error al procesar el pedido. Intenta nuevamente.');
        btn.disabled = false;
        btn.textContent = 'Completar Pedido 🎉';
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function () {
    // Card number validation
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = formattedValue;
            document.getElementById('cardDisplay').textContent = formattedValue || '**** **** **** ****';
        });
    }

    // Card holder validation
    const cardHolder = document.getElementById('cardHolder');
    if (cardHolder) {
        cardHolder.addEventListener('input', function (e) {
            let value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            e.target.value = value.toUpperCase();
            document.getElementById('holderDisplay').textContent = value.toUpperCase() || 'TU NOMBRE';
        });
    }

    // Card expiry validation
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            document.getElementById('expiryDisplay').textContent = value || 'MM/AA';
        });
    }

    // CVV validation
    const cardCVV = document.getElementById('cardCVV');
    if (cardCVV) {
        cardCVV.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // Clear errors on input
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('error');
            const errorDiv = document.getElementById(`${this.id}-error`);
            if (errorDiv) errorDiv.classList.remove('show');
        });
    });

    updateProgress();
    loadOrderSummary();
    loadSavedAddresses();
});

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.target.matches('textarea')) {
        e.preventDefault();
        const nextBtn = document.querySelector('.checkout-section.active .btn-next');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        }
    }
});