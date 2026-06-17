
// GLOBAL FAVORITES BADGE MANAGER
const FavoritesBadgeManager = {
    async updateBadge() {
        const token = localStorage.getItem('token');
        const badges = document.querySelectorAll('.favorites-badge');

        if (!token) {
            badges.forEach(b => b.textContent = '0');
            return;
        }

        try {
            const response = await fetch('/api/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const favorites = await response.json();
                const count = favorites.length;

                badges.forEach(b => {
                    b.textContent = count;
                    // Add bounce animation
                    b.classList.remove('bounce');
                    void b.offsetWidth; // Trigger reflow
                    b.classList.add('bounce');
                });
            }
        } catch (error) {
            console.error('Error updating favorites badge:', error);
        }
    },

    init() {
        // Update on load
        this.updateBadge();

        // Listen for custom events
        window.addEventListener('favoritesUpdated', () => this.updateBadge());
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => FavoritesBadgeManager.init());
