
// GLOBAL CART BADGE MANAGER
const CartBadgeManager = {
    async updateBadge() {
        const token = localStorage.getItem('token');
        const badges = document.querySelectorAll('.cart-badge, .insignia-carrito');

        if (!token) {
            badges.forEach(b => b.textContent = '0');
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const cart = await response.json();
                const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

                badges.forEach(b => {
                    b.textContent = count;
                    // Add bounce animation
                    b.classList.remove('bounce');
                    void b.offsetWidth; // Trigger reflow
                    b.classList.add('bounce');
                });
            }
        } catch (error) {
            console.error('Error updating cart badge:', error);
        }
    },

    init() {
        // Update on load
        this.updateBadge();

        // Listen for custom events if needed
        window.addEventListener('cartUpdated', () => this.updateBadge());
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => CartBadgeManager.init());
