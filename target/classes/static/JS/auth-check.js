// ===== AUTH-CHECK.JS - Route Protection Script =====
// Include this script in the <head> of all protected pages

// Configuration: Define protected pages and required roles
const PROTECTED_ROUTES = {
    'ventas.html': ['ADMIN'],
    'inventario.html': ['ADMIN'],
    'dashboard.html': ['ADMIN'],
    'gestionusuarios.html': ['ADMIN'],
    'gestionpedidos.html': ['ADMIN'],
    'gestionproductos.html': ['ADMIN'],
    'gestionproductos_import.html': ['ADMIN'],
    'reportes.html': ['ADMIN'],
    'domicilios.html': ['ADMIN'],
    'perfilusuario.html': ['USER', 'ADMIN'],
    'carrito.html': ['USER', 'ADMIN']
};

// Get current page filename
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Verify JWT token validity
function isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        // Decode JWT payload (basic validation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < exp;
    } catch (e) {
        console.error('Invalid token format:', e);
        return false;
    }
}

// Get user role from localStorage
function getUserRole() {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
        const userData = JSON.parse(user);
        return userData.role;
    } catch (e) {
        console.error('Invalid user data:', e);
        return null;
    }
}

// Check if user has permission to access current page
function checkPageAccess() {
    const currentPage = getCurrentPage();
    const requiredRoles = PROTECTED_ROUTES[currentPage];

    // If page is not in protected routes, allow access
    if (!requiredRoles) return true;

    // Check token validity
    if (!isTokenValid()) {
        console.warn('🔒 Token inválido o expirado');
        redirectToLogin();
        return false;
    }

    // Check role permission
    const userRole = getUserRole();
    if (!userRole || !requiredRoles.includes(userRole)) {
        console.warn(`🔒 Acceso denegado. Rol requerido: ${requiredRoles.join(' o ')}`);
        redirectToUnauthorized();
        return false;
    }

    return true;
}

// Redirect to login page
function redirectToLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('loginyregistro.html');
}

// Redirect to unauthorized page or home
function redirectToUnauthorized() {
    window.location.replace('index.html');
}

// ===== IMMEDIATE EXECUTION - Block unauthorized access ASAP =====
(function immediateAuthCheck() {
    const currentPage = getCurrentPage();
    const requiredRoles = PROTECTED_ROUTES[currentPage];

    // Only check if current page is protected
    if (requiredRoles) {
        if (!isTokenValid()) {
            redirectToLogin();
            throw new Error('Auth check failed - redirecting to login');
        }

        const userRole = getUserRole();
        if (!userRole || !requiredRoles.includes(userRole)) {
            redirectToUnauthorized();
            throw new Error('Auth check failed - insufficient permissions');
        }
    }
})();

// ===== PAGE SHOW EVENT - Handle back button navigation =====
window.addEventListener('pageshow', function (event) {
    // event.persisted indicates the page was loaded from cache
    if (event.persisted || performance.navigation.type === 2) {
        console.log('⚠️ Página cargada desde caché o botón atrás detectado');

        // Re-check authentication
        if (!checkPageAccess()) {
            // If auth check fails, reload page to force server validation
            window.location.reload();
        }
    }
});

// ===== DOM CONTENT LOADED - Update UI based on auth state =====
document.addEventListener('DOMContentLoaded', () => {
    // Final auth check after DOM loaded
    checkPageAccess();

    // Update profile button dynamically
    const profileBtn = document.querySelector('a[href="loginyregistro.html"][aria-label="Cuenta"]');

    if (profileBtn) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            // User is logged in
            const userData = JSON.parse(user);
            if (userData && userData.role === 'ADMIN') {
                profileBtn.href = 'dashboard.html';
                profileBtn.title = 'Panel de Administración';
            } else {
                profileBtn.href = 'perfilusuario.html';
                profileBtn.title = 'Mi Perfil';
            }

            // Add Logout Button
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'icon-btn';
            logoutBtn.innerHTML = '🚪';
            logoutBtn.title = 'Cerrar Sesión';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                secureLogout();
            };
            profileBtn.parentNode.insertBefore(logoutBtn, profileBtn.nextSibling);

        } else {
            // User is not logged in
            profileBtn.href = 'loginyregistro.html';
            profileBtn.title = 'Iniciar Sesión';
        }
    }
});

// ===== SECURE LOGOUT =====
function secureLogout() {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');

    // Use replace instead of href to prevent back button access
    window.location.replace('loginyregistro.html');
}

// Export for use in other scripts
window.secureLogout = secureLogout;

console.log('🔒 Auth Check Script Loaded - Route Protection Active');
