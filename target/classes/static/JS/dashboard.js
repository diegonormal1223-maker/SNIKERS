// ALTERNAR BARRA LATERAL
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');

    // Guardar estado
    const isCollapsed = sidebar.classList.contains('collapsed');
    console.log(`Sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`);
}

// BARRA LATERAL MÓVIL
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('collapsed');
    }
});

// NAVEGACION
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        // No prevenir default si es un enlace real
        // if (this.getAttribute('href') === '#') {
        //     e.preventDefault();
        // }
        // Eliminar activo de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Agregar activo al enlace presionado
        this.classList.add('active');
    });
});

// BOTONES DE FILTRO
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const parent = this.parentElement;
        parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        console.log(`Filter changed to: ${this.textContent}`);
    });
});

// ACCIONES DE TABLA
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const action = this.getAttribute('title');
        const row = this.closest('tr');
        const orderId = row.querySelector('.order-id').textContent;

        console.log(`${action} - ${orderId}`);
        alert(`${action}: ${orderId}`);
    });
});

// AÑADIR MODAL DE PRODUCTO
function showAddProductModal() {
    alert('Modal de agregar producto (en desarrollo)');
}

// FUNCIONALIDAD DE BÚSQUEDA
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log(`Buscando: ${searchTerm}`);

        // Filtrar filas de la tabla
        const rows = document.querySelectorAll('.data-table tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// ANIMACIÓN DE ESTADÍSTICAS
function animateValue(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);

        if (element.textContent.includes('$') || element.id === 'totalSales') {
            element.textContent = '$' + value.toLocaleString('es-CO');
        } else if (element.textContent.includes('.')) {
            element.textContent = (progress * (end - start) + start).toFixed(1);
        } else {
            element.textContent = value.toLocaleString('es-CO');
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


// ANIMACIÓN DE ESTADÍSTICAS AL CARGAR
window.addEventListener('load', () => {
    // Initial fetch
    fetchStats();

    // Las funciones de los gráficos de reportes.php han sido eliminadas.
});

// CLIC DE NOTIFICACIÓN (Tu función original)
document.querySelectorAll('.header-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const icon = this.textContent.trim();
        let message = '';

        switch (icon) {
            case '🔔':
                message = 'Tienes 5 notificaciones nuevas';
                break;
            case '💬':
                message = 'Mensajes recientes';
                break;
            case '⚙️':
                message = 'Configuración';
                break;
        }

        console.log(message);
        alert(message);
    });
});

// PERFIL DE USUARIO CLIC (Tu función original)
document.querySelector('.user-profile')?.addEventListener('click', function () {
    alert('Perfil de usuario\n\nOpciones:\n- Mi cuenta\n- Configuración\n- Cerrar sesión');
});

// CLIC EN LA TARJETA DEL PRODUCTO (Tu función original)
document.querySelectorAll('.product-mini-card').forEach(card => {
    card.addEventListener('click', function () {
        const name = this.querySelector('.product-mini-name').textContent;
        const price = this.querySelector('.product-mini-price').textContent;
        const stock = this.querySelector('.product-mini-stock').textContent;

        alert(`Producto: ${name}\nPrecio: ${price}\n${stock}`);
    });
});

// CLIC EN LA TARJETA DE ESTADÍSTICAS (Tu función original)
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', function () {
        const label = this.querySelector('.stat-label').textContent;
        const value = this.querySelector('.stat-value').textContent;

        console.log(`Stat clicked: ${label} - ${value}`);
    });
});

// BOTÓN EXPORTAR (Tu función original)
document.querySelectorAll('.action-btn').forEach(btn => {
    if (btn.textContent.includes('Exportar')) {
        btn.addEventListener('click', function () {
            console.log('Exportando datos...');
            alert('Exportando datos a CSV...\n(Función en desarrollo)');
        });
    }

    if (btn.textContent.includes('Filtrar')) {
        btn.addEventListener('click', function () {
            console.log('Abriendo filtros...');
            alert('Opciones de filtro:\n- Por fecha\n- Por estado\n- Por cliente\n- Por monto');
        });
    }
});

// ATAJOS DE TECLADO (Tu función original)
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K para buscar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }

    // Ctrl/Cmd + B para alternar la barra lateral
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
    }

    // ESC para borrar la búsqueda
    if (e.key === 'Escape' && searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
});

// INSIGNIA DE ESTADO AL PASAR EL CICLO (Tu función original)
document.querySelectorAll('.status-badge').forEach(badge => {
    badge.addEventListener('click', function (e) {
        e.stopPropagation();
        const status = this.textContent;
        alert(`Cambiar estado de pedido desde: ${status}`);
    });
});

// SIMULACIÓN DE ACTUALIZACIONES EN TIEMPO REAL (Tu función original)
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simular actualización de insignia de notificación
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            const currentCount = parseInt(notificationBadge.textContent) || 0;
            // Oportunidad aleatoria de actualizar
            if (Math.random() > 0.9) {
                notificationBadge.textContent = currentCount + 1;
                console.log('Nueva notificación recibida');
            }
        }
    }, 10000); // Cada 10 segundos
}

// Iniciar actualizaciones en tiempo real
// simulateRealTimeUpdates(); // Descomentado para que funcione

// ACTUALIZACIÓN AUTOMÁTICA DE ESTADÍSTICAS (Tu función original)
function refreshStats() {
    console.log('Actualizando estadísticas...');
    fetchStats();
}

// Actualizar estadísticas cada 30 segundos
setInterval(refreshStats, 30000);

// --- DYNAMIC DATA FETCHING ---

async function fetchStats() {
    const token = localStorage.getItem('token');
    if (!token) {
        // window.location.href = 'loginyregistro.html';
        // return;
    }

    try {
        // Mocking response if no backend
        const response = await fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const stats = await response.json();

            // Update Stats
            const totalSalesEl = document.getElementById('totalSales');
            const totalOrdersEl = document.getElementById('totalOrders');
            const totalUsersEl = document.getElementById('totalUsers');

            if (totalSalesEl) animateValue(totalSalesEl, 0, stats.totalSales, 2000);
            if (totalOrdersEl) animateValue(totalOrdersEl, 0, stats.totalOrders, 2000);
            if (totalUsersEl) animateValue(totalUsersEl, 0, stats.totalUsers, 2000);

            // Render Charts
            renderSalesChart(stats.salesByMonth);
            renderTopCategories(stats.topCategories);
            renderRecentOrders(stats.recentOrders);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderSalesChart(salesData) {
    if (!salesData) return;

    const container = document.querySelector('.chart-container-bar');
    if (!container) return;
    container.innerHTML = '';

    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const maxVal = Math.max(...Object.values(salesData), 100);

    months.forEach((month, index) => {
        const value = salesData[month] || 0;
        const height = (value / maxVal) * 100;

        const bar = document.createElement('div');
        bar.className = 'bar-item';
        bar.style.height = `${height}%`;
        bar.setAttribute('data-tooltip', `${shortMonths[index]}: $${value.toLocaleString()}`);

        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = shortMonths[index];

        bar.appendChild(label);
        container.appendChild(bar);
    });
}

function renderTopCategories(categories) {
    if (!categories) return;

    const container = document.querySelector('.chart-container-donut');
    if (!container) return;
    const donutChart = container.querySelector('.donut-chart');
    const legend = container.querySelector('.chart-legend');

    // Clear existing
    if (donutChart) donutChart.innerHTML = '';
    if (legend) legend.innerHTML = '';

    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    const colors = ['var(--neon-green)', 'var(--neon-purple)', 'var(--warning-orange)', 'var(--success-green)', '#3498db'];

    let i = 0;
    for (const [category, count] of Object.entries(categories)) {
        const percentage = (count / total) * 100;

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        const colorSpan = document.createElement('span');
        colorSpan.className = 'legend-color';
        colorSpan.style.backgroundColor = colors[i % colors.length];

        legendItem.appendChild(colorSpan);
        legendItem.appendChild(document.createTextNode(`${category} (${Math.round(percentage)}%)`));
        if (legend) legend.appendChild(legendItem);
        i++;
    }

    // Simple visual representation using conic-gradient
    let gradientStr = '';
    let start = 0;
    i = 0;
    for (const [category, count] of Object.entries(categories)) {
        const deg = (count / total) * 360;
        gradientStr += `${colors[i % colors.length]} ${start}deg ${start + deg}deg, `;
        start += deg;
        i++;
    }
    gradientStr = gradientStr.slice(0, -2); // remove last comma

    if (gradientStr && donutChart) {
        donutChart.style.background = `conic-gradient(${gradientStr})`;
    }
}

function renderRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No hay pedidos recientes</td></tr>';
        return;
    }

    orders.forEach(order => {
        const tr = document.createElement('tr');

        // Determine status class
        let statusClass = 'pending';
        if (order.status === 'DELIVERED' || order.status === 'COMPLETED') statusClass = 'completed';
        else if (order.status === 'CANCELLED') statusClass = 'cancelled';
        else if (order.status === 'PROCESSING') statusClass = 'processing';

        // Format date
        const date = new Date(order.orderDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

        // Get user name/avatar
        const userEmail = order.user ? order.user.email : 'Unknown';
        const userName = userEmail.split('@')[0];
        const avatarLetter = userName.charAt(0).toUpperCase();

        // Get product name (first item)
        const productName = order.items && order.items.length > 0 ? order.items[0].product.name : 'N/A';
        const productExtra = order.items && order.items.length > 1 ? ` +${order.items.length - 1}` : '';

        tr.innerHTML = `
            <td><span class="order-id">#${order.id}</span></td>
            <td>
                <div class="customer-info">
                    <div class="customer-avatar">${avatarLetter}</div>
                    <span>${userName}</span>
                </div>
            </td>
            <td>${productName}${productExtra}</td>
            <td>$${order.totalAmount.toLocaleString()}</td>
            <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            <td>${date}</td>
            <td>
                <div class="table-actions-cell">
                    <button class="icon-btn" title="Ver detalles">👁</button>
                    <button class="icon-btn" title="Editar">✏️</button>
                    <button class="icon-btn" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
