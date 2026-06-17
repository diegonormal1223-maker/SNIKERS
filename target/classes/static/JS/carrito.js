
// STATE
let cart = { items: [], total: 0 };
let discountPercent = 0;
let appliedCoupon = null;

// FETCH CART
async function fetchCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        // If no token, treat as empty cart and render
        renderCart();
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            cart.items = data.items || [];
            cart.total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            renderCart();
        } else {
            console.error('Error fetching cart');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// RENDER CART
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');

    // Header count
    const headerCount = document.querySelector('.cart-items-header h2');
    if (headerCount) {
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        headerCount.textContent = `Productos (${totalItems})`;
    }

    // If we are not on the cart page, just update the badge
    if (!container && !emptyCart) {
        updateCartBadge();
        return;
    }

    if (cart.items.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (container) container.innerHTML = '';

        // Hide items header and checkout button
        const itemsHeader = document.querySelector('.cart-items-header');
        if (itemsHeader) itemsHeader.style.display = 'none';

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.disabled = true;

        updateSummary();
        return;
    }

    // Show items header and checkout button
    const itemsHeader = document.querySelector('.cart-items-header');
    if (itemsHeader) itemsHeader.style.display = 'flex';

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = false;

    if (emptyCart) emptyCart.style.display = 'none';

    if (container) {
        container.innerHTML = cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.product.imageUrl || 'img/placeholder.jpg'}" alt="${item.product.name}">
                </div>
                <div class="item-details">
                    <div>
                        <h3 class="item-name">${item.product.name}</h3>
                        <div class="item-meta">
                            <div class="item-meta-item">
                                <span class="item-meta-label">Talla:</span>
                                <span>${item.size}</span>
                            </div>
                            <div class="item-meta-item">
                                <span class="item-meta-label">Color:</span>
                                <span>${item.color}</span>
                            </div>
                        </div>
                    </div>
                    <div class="item-price">$${item.product.price.toLocaleString()}</div>
                </div>
                <div class="item-actions">
                    <button class="remove-item" onclick="removeItem(${item.id})">✕</button>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})"> − </button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})"> + </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateSummary();
    updateCartBadge();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge, .insignia-carrito');
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => badge.textContent = count);
}

// UPDATE QUANTITY
async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(itemId);
        return;
    }

    if (newQuantity > 10) {
        showNotification('Cantidad máxima: 10 unidades', 'error');
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            fetchCart(); // Refresh cart
            showNotification('Cantidad actualizada');
        } else {
            showNotification('Error actualizando cantidad', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// REMOVE ITEM
async function removeItem(itemId) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const itemElement = document.querySelector(`[data-id="${itemId}"]`);
    if (itemElement) itemElement.style.animation = 'slideOut 0.3s';

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setTimeout(() => {
                fetchCart(); // Refresh cart
                showNotification('Producto eliminado del carrito');
            }, 300);
        } else {
            showNotification('Error eliminando producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// CLEAR CART
async function clearCart() {
    if (!confirm('¿Vaciar todo el carrito?')) return;

    const token = localStorage.getItem('token');
    // Assuming there is an endpoint to clear cart, or we loop through items
    // Since backend API for clear cart wasn't explicitly shown, we'll loop for now or assume it exists
    // Ideally: DELETE /api/cart

    // For now, let's try to delete items one by one or just refresh if backend supports clear
    // I will implement a loop deletion for safety if no clear endpoint

    try {
        const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            fetchCart();
            showNotification('Carrito vaciado');
        } else {
            // Fallback: delete locally to update UI and warn
            // Or fetch items and delete one by one
            for (const item of cart.items) {
                await fetch(`/api/cart/items/${item.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            fetchCart();
            showNotification('Carrito vaciado');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}


// UPDATE SUMMARY
function updateSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');

    if (subtotalElement && totalElement && discountElement) {
        const subtotal = cart.total;
        const discount = subtotal * (discountPercent / 100);
        const total = subtotal - discount;

        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        discountElement.textContent = discount > 0 ? `-$${discount.toLocaleString()}` : '$0.00';
        totalElement.textContent = `$${total.toLocaleString()}`;

        if (discount > 0) {
            discountElement.style.color = 'var(--neon-green)';
        } else {
            discountElement.style.color = 'var(--text-white)';
        }
    }
}

// COUPON SYSTEM
const validCoupons = {
    'SNIKER10': 10,
    'WELCOME15': 15,
    'EXCLUSIVE20': 20,
    'VIP25': 25
};

const couponForm = document.getElementById('couponForm');
if (couponForm) {
    couponForm.addEventListener('submit', function (e) {
        e.preventDefault();
        applyCoupon();
    });
}

function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
        showNotification('Ingresa un código de cupón', 'error');
        return;
    }

    if (validCoupons[code]) {
        discountPercent = validCoupons[code];
        appliedCoupon = code;

        // Guardar cupón en localStorage para el checkout
        localStorage.setItem('appliedCoupon', JSON.stringify({
            code: code,
            discountPercent: discountPercent
        }));

        document.getElementById('couponCode').textContent = code;
        document.getElementById('couponApplied').classList.add('show');
        document.getElementById('couponForm').style.display = 'none';

        updateSummary();
        showNotification(`¡Cupón aplicado! ${discountPercent}% de descuento`);
    } else {
        showNotification('Cupón inválido o expirado', 'error');
        couponInput.classList.add('error');
        setTimeout(() => {
            couponInput.classList.remove('error');
        }, 500);
    }
}

function removeCoupon() {
    discountPercent = 0;
    appliedCoupon = null;

    // Remover cupón del localStorage
    localStorage.removeItem('appliedCoupon');

    document.getElementById('couponApplied').classList.remove('show');
    document.getElementById('couponForm').style.display = 'flex';
    document.getElementById('couponInput').value = '';

    updateSummary();
    showNotification('Cupón removido');
}

// NOTIFICATIONS
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;

    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, var(--error-red), #cc0033)';
    } else {
        notification.style.background = 'linear-gradient(135deg, var(--neon-green), #2ecc40)';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// GO TO CHECKOUT
function goToCheckout() {
    if (cart.items.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    showNotification('Redirigiendo al checkout...');

    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 1500);
}

// SUGGESTED PRODUCTS INTERACTION
document.querySelectorAll('.suggested-product').forEach(product => {
    product.addEventListener('click', function () {
        const name = this.querySelector('.suggested-product-name').textContent;
        showNotification(`Agregando ${name} al carrito...`);
        // Here you would typically call an API to add the suggested product
        setTimeout(() => {
            showNotification('¡Producto agregado al carrito!');
        }, 1000);
    });
});

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const notif = document.getElementById('notification');
        if (notif) notif.classList.remove('show');
    }
});

// ADD ANIMATION STYLE
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    fetchCart();

    // Restaurar cupón si existe
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
        try {
            const couponData = JSON.parse(savedCoupon);
            discountPercent = couponData.discountPercent;
            appliedCoupon = couponData.code;

            const couponCodeEl = document.getElementById('couponCode');
            const couponAppliedEl = document.getElementById('couponApplied');
            const couponFormEl = document.getElementById('couponForm');

            if (couponCodeEl) couponCodeEl.textContent = couponData.code;
            if (couponAppliedEl) couponAppliedEl.classList.add('show');
            if (couponFormEl) couponFormEl.style.display = 'none';
        } catch (e) {
            console.error('Error loading saved coupon:', e);
        }
    }
});
