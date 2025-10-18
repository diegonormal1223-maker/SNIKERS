<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Panel de administración SNIKER">
    <title>SNIKER - Dashboard Admin</title>
    <link rel="icon" type="image/png" href="favicon.png">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --neon-green: #39ff14;
            --neon-purple: #b026ff;
            --dark-bg: #0a0a0f;
            --dark-card: #16161f;
            --text-white: #ffffff;
            --text-gray: #a0a0a0;
            --success-green: #00ff88;
            --warning-orange: #ffaa00;
            --error-red: #ff3860;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background-color: var(--dark-bg);
            color: var(--text-white);
            line-height: 1.6;
            display: flex;
            min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
            width: 280px;
            background-color: var(--dark-card);
            border-right: 2px solid rgba(57, 255, 20, 0.2);
            padding: 30px 0;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            transition: all 0.3s;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 0 30px;
            margin-bottom: 40px;
        }

        .logo-icon {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            flex-shrink: 0;
        }

        .logo-text {
            font-size: 28px;
            font-weight: 900;
            color: var(--neon-green);
            text-shadow: 0 0 20px var(--neon-green);
            transition: opacity 0.3s;
        }

        .sidebar.collapsed .logo-text {
            opacity: 0;
            display: none;
        }

        .nav-menu {
            list-style: none;
        }

        .nav-item {
            margin-bottom: 5px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 30px;
            color: var(--text-gray);
            text-decoration: none;
            transition: all 0.3s;
            border-left: 3px solid transparent;
        }

        .nav-link:hover {
            background-color: rgba(57, 255, 20, 0.05);
            color: var(--neon-green);
            border-left-color: var(--neon-green);
        }

        .nav-link.active {
            background-color: rgba(57, 255, 20, 0.1);
            color: var(--neon-green);
            border-left-color: var(--neon-green);
        }

        .nav-icon {
            font-size: 24px;
            width: 24px;
            text-align: center;
        }

        .nav-text {
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: opacity 0.3s;
        }

        .sidebar.collapsed .nav-text {
            opacity: 0;
            display: none;
        }

        .nav-badge {
            background: var(--neon-purple);
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 700;
            margin-left: auto;
        }

        /* MAIN CONTENT */
        .main-content {
            flex: 1;
            margin-left: 280px;
            transition: margin-left 0.3s;
        }

        .sidebar.collapsed ~ .main-content {
            margin-left: 80px;
        }

        /* HEADER */
        .dashboard-header {
            background-color: var(--dark-card);
            padding: 20px 40px;
            border-bottom: 2px solid rgba(57, 255, 20, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .menu-toggle {
            background: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
            width: 45px;
            height: 45px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s;
        }

        .menu-toggle:hover {
            background: var(--neon-green);
            color: var(--dark-bg);
        }

        .search-bar {
            position: relative;
        }

        .search-bar input {
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            padding: 12px 20px 12px 45px;
            border-radius: 12px;
            color: var(--text-white);
            width: 350px;
            outline: none;
            transition: all 0.3s;
        }

        .search-bar input:focus {
            border-color: var(--neon-green);
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
        }

        .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: var(--text-gray);
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .header-btn {
            background: transparent;
            border: 2px solid rgba(57, 255, 20, 0.3);
            color: var(--text-gray);
            width: 45px;
            height: 45px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s;
            position: relative;
        }

        .header-btn:hover {
            border-color: var(--neon-green);
            color: var(--neon-green);
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--error-red);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 15px;
            background-color: rgba(57, 255, 20, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .user-profile:hover {
            border-color: var(--neon-green);
            background-color: rgba(57, 255, 20, 0.1);
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
        }

        .user-info {
            display: flex;
            flex-direction: column;
        }

        .user-name {
            font-weight: 700;
            font-size: 14px;
        }

        .user-role {
            font-size: 12px;
            color: var(--text-gray);
        }

        /* CONTENT AREA */
        .content-area {
            padding: 40px;
        }

        .page-title {
            font-size: 42px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 10px;
            background: linear-gradient(135deg, var(--neon-green), var(--text-white));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .page-subtitle {
            color: var(--text-gray);
            margin-bottom: 40px;
            font-size: 16px;
        }

        /* STATS CARDS */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            margin-bottom: 40px;
        }

        .stat-card {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(57, 255, 20, 0.2);
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(57, 255, 20, 0.1), transparent);
            border-radius: 50%;
        }

        .stat-card:hover {
            border-color: var(--neon-green);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(57, 255, 20, 0.2);
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .stat-icon {
            font-size: 32px;
        }

        .stat-change {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            font-weight: 700;
            padding: 5px 10px;
            border-radius: 10px;
        }

        .stat-change.positive {
            background: rgba(0, 255, 136, 0.1);
            color: var(--success-green);
        }

        .stat-change.negative {
            background: rgba(255, 56, 96, 0.1);
            color: var(--error-red);
        }

        .stat-label {
            color: var(--text-gray);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }

        .stat-value {
            font-size: 36px;
            font-weight: 900;
            color: var(--neon-green);
            line-height: 1;
        }

        /* CHARTS SECTION */
        .charts-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 25px;
            margin-bottom: 40px;
        }

        .chart-card {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .chart-title {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--neon-green);
        }

        .chart-filter {
            display: flex;
            gap: 10px;
        }

        .filter-btn {
            background: transparent;
            border: 2px solid rgba(57, 255, 20, 0.3);
            color: var(--text-gray);
            padding: 8px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .filter-btn:hover,
        .filter-btn.active {
            background: var(--neon-green);
            color: var(--dark-bg);
            border-color: var(--neon-green);
        }

        .chart-placeholder {
            height: 300px;
            background: linear-gradient(135deg, rgba(57, 255, 20, 0.05), rgba(176, 38, 255, 0.05));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-gray);
            font-size: 14px;
            border: 2px dashed rgba(57, 255, 20, 0.2);
        }

        /* ORDERS TABLE */
        .table-section {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(57, 255, 20, 0.2);
            margin-bottom: 40px;
        }

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .table-title {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--neon-green);
        }

        .table-actions {
            display: flex;
            gap: 10px;
        }

        .action-btn {
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 700;
            font-size: 13px;
            transition: all 0.3s;
            text-transform: uppercase;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(57, 255, 20, 0.4);
        }

        .action-btn.secondary {
            background: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table thead {
            border-bottom: 2px solid rgba(57, 255, 20, 0.2);
        }

        .data-table th {
            text-align: left;
            padding: 15px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-gray);
            font-weight: 700;
        }

        .data-table td {
            padding: 20px 15px;
            border-bottom: 1px solid rgba(57, 255, 20, 0.1);
        }

        .data-table tr:hover {
            background-color: rgba(57, 255, 20, 0.03);
        }

        .order-id {
            font-weight: 700;
            color: var(--neon-green);
        }

        .customer-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .customer-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-badge.pending {
            background: rgba(255, 170, 0, 0.2);
            color: var(--warning-orange);
        }

        .status-badge.completed {
            background: rgba(0, 255, 136, 0.2);
            color: var(--success-green);
        }

        .status-badge.cancelled {
            background: rgba(255, 56, 96, 0.2);
            color: var(--error-red);
        }

        .status-badge.processing {
            background: rgba(176, 38, 255, 0.2);
            color: var(--neon-purple);
        }

        .table-actions-cell {
            display: flex;
            gap: 8px;
        }

        .icon-btn {
            background: transparent;
            border: 2px solid rgba(57, 255, 20, 0.3);
            color: var(--text-gray);
            width: 35px;
            height: 35px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.3s;
        }

        .icon-btn:hover {
            border-color: var(--neon-green);
            color: var(--neon-green);
            transform: scale(1.1);
        }

        /* PRODUCTS GRID */
        .products-mini-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .product-mini-card {
            background-color: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            padding: 20px;
            border: 2px solid rgba(57, 255, 20, 0.1);
            transition: all 0.3s;
            cursor: pointer;
        }

        .product-mini-card:hover {
            border-color: var(--neon-green);
            transform: translateY(-5px);
        }

        .product-mini-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .product-mini-image img {
            width: 100%;
            max-width: 100px;
        }

        .product-mini-info {
            text-align: center;
        }

        .product-mini-name {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .product-mini-price {
            color: var(--neon-green);
            font-weight: 900;
            font-size: 18px;
            margin-bottom: 8px;
        }

        .product-mini-stock {
            font-size: 12px;
            color: var(--text-gray);
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .charts-grid {
                grid-template-columns: 1fr;
            }

            .products-mini-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                z-index: 1000;
            }

            .sidebar.show {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .header-right .user-info {
                display: none;
            }

            .search-bar input {
                width: 200px;
            }

            .table-section {
                overflow-x: auto;
            }

            .products-mini-grid {
                grid-template-columns: 1fr;
            }
        }

        /* ANIMATIONS */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .stat-card,
        .chart-card,
        .table-section {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>
<body>
    <!-- SIDEBAR -->
    <aside class="sidebar" id="sidebar">
        <div class="logo-section">
            <div class="logo-icon"></div>
            <span class="logo-text">SNIKER</span>
        </div>

        <nav>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="#" class="nav-link active">
                        <span class="nav-icon">📊</span>
                        <span class="nav-text">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="showSection('orders')">
                        <span class="nav-icon">📦</span>
                        <span class="nav-text">Pedidos</span>
                        <span class="nav-badge">12</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="showSection('products')">
                        <span class="nav-icon">👟</span>
                        <span class="nav-text">Productos</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <span class="nav-icon">👥</span>
                        <span class="nav-text">Clientes</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <span class="nav-icon">📈</span>
                        <span class="nav-text">Analytics</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <span class="nav-icon">💰</span>
                        <span class="nav-text">Finanzas</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <span class="nav-icon">🎨</span>
                        <span class="nav-text">Marketing</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <span class="nav-icon">⚙️</span>
                        <span class="nav-text">Configuración</span>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
        <!-- HEADER -->
        <header class="dashboard-header">
            <div class="header-left">
                <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
                <div class="search-bar">
                    <span class="search-icon">🔍</span>
                    <input type="search" placeholder="Buscar pedidos, productos, clientes...">
                </div>
            </div>

            <div class="header-right">
                <button class="header-btn">
                    🔔
                    <span class="notification-badge">5</span>
                </button>
                <button class="header-btn">💬</button>
                <button class="header-btn">⚙️</button>
                
                <div class="user-profile">
                    <div class="user-avatar">A</div>
                    <div class="user-info">
                        <div class="user-name">Admin</div>
                        <div class="user-role">Administrador</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- CONTENT AREA -->
        <div class="content-area">
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Bienvenido de nuevo, aquí está tu resumen de hoy</p>

            <!-- STATS CARDS -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">💰</span>
                        <span class="stat-change positive">↑ 12.5%</span>
                    </div>
                    <div class="stat-label">Ventas Totales</div>
                    <div class="stat-value">$24,580</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">📦</span>
                        <span class="stat-change positive">↑ 8.3%</span>
                    </div>
                    <div class="stat-label">Pedidos</div>
                    <div class="stat-value">158</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">👥</span>
                        <span class="stat-change positive">↑ 5.2%</span>
                    </div>
                    <div class="stat-label">Clientes</div>
                    <div class="stat-value">1,245</div>
                </div>

                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-change negative">↓ 2.1%</span>
                    </div>
                    <div class="stat-label">Rating Promedio</div>
                    <div class="stat-value">4.8</div>
                </div>
            </div>

            <!-- CHARTS -->
            <div class="charts-grid">
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">Ventas Mensuales</h3>
                        <div class="chart-filter">
                            <button class="filter-btn active">Mes</button>
                            <button class="filter-btn">Semana</button>
                            <button class="filter-btn">Día</button>
                        </div>
                    </div>
                    <div class="chart-placeholder">
                        📊 Gráfico de ventas mensuales
                    </div>
                </div>

                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">Top Categorías</h3>
                    </div>
                    <div class="chart-placeholder">
                        🥧 Gráfico de categorías
                    </div>
                </div>
            </div>

            <!-- RECENT ORDERS TABLE -->
            <div class="table-section">
                <div class="table-header">
                    <h3 class="table-title">Pedidos Recientes</h3>
                    <div class="table-actions">
                        <button class="action-btn secondary">Filtrar</button>
                        <button class="action-btn">Exportar</button>
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Producto</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="order-id">#SNKR-1234</span></td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">C</div>
                                    <span>Carlos Méndez</span>
                                </div>
                            </td>
                            <td>Air Retro Classic</td>
                            <td>$129.99</td>
                            <td><span class="status-badge completed">Completado</span></td>
                            <td>16 Oct 2025</td>
                            <td>
                                <div class="table-actions-cell">
                                    <button class="icon-btn" title="Ver detalles">👁</button>
                                    <button class="icon-btn" title="Editar">✏️</button>
                                    <button class="icon-btn" title="Eliminar">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><span class="order-id">#SNKR-1235</span></td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">M</div>
                                    <span>María García</span>
                                </div>
                            </td>
                            <td>Urban Street Pro</td>
                            <td>$89.99</td>
                            <td><span class="status-badge processing">Procesando</span></td>
                            <td>16 Oct 2025</td>
                            <td>
                                <div class="table-actions-cell">
                                    <button class="icon-btn" title="Ver detalles">👁</button>
                                    <button class="icon-btn" title="Editar">✏️</button>
                                    <button class="icon-btn" title="Eliminar">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><span class="order-id">#SNKR-1236</span></td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">J</div>
                                    <span>Jorge Ramírez</span>
                                </div>
                            </td>
                            <td>Neon Boost Limited</td>
                            <td>$149.99</td>
                            <td><span class="status-badge pending">Pendiente</span></td>
                            <td>15 Oct 2025</td>
                            <td>
                                <div class="table-actions-cell">
                                    <button class="icon-btn" title="Ver detalles">👁</button>
                                    <button class="icon-btn" title="Editar">✏️</button>
                                    <button class="icon-btn" title="Eliminar">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><span class="order-id">#SNKR-1237</span></td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">A</div>
                                    <span>Ana López</span>
                                </div>
                            </td>
                            <td>Classic Runner</td>
                            <td>$99.99</td>
                            <td><span class="status-badge completed">Completado</span></td>
                            <td>15 Oct 2025</td>
                            <td>
                                <div class="table-actions-cell">
                                    <button class="icon-btn" title="Ver detalles">👁</button>
                                    <button class="icon-btn" title="Editar">✏️</button>
                                    <button class="icon-btn" title="Eliminar">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><span class="order-id">#SNKR-1238</span></td>
                            <td>
                                <div class="customer-info">
                                    <div class="customer-avatar">P</div>
                                    <span>Pedro Santos</span>
                                </div>
                            </td>
                            <td>Street Edition</td>
                            <td>$119.99</td>
                            <td><span class="status-badge cancelled">Cancelado</span></td>
                            <td>14 Oct 2025</td>
                            <td>
                                <div class="table-actions-cell">
                                    <button class="icon-btn" title="Ver detalles">👁</button>
                                    <button class="icon-btn" title="Editar">✏️</button>
                                    <button class="icon-btn" title="Eliminar">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- TOP PRODUCTS -->
            <div class="table-section">
                <div class="table-header">
                    <h3 class="table-title">Productos Más Vendidos</h3>
                    <div class="table-actions">
                        <button class="action-btn" onclick="showAddProductModal()">+ Nuevo Producto</button>
                    </div>
                </div>

                <div class="products-mini-grid">
                    <div class="product-mini-card">
                        <div class="product-mini-image">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" alt="Air Retro Classic">
                        </div>
                        <div class="product-mini-info">
                            <div class="product-mini-name">Air Retro Classic</div>
                            <div class="product-mini-price">$129.99</div>
                            <div class="product-mini-stock">Stock: 45 unidades</div>
                        </div>
                    </div>

                    <div class="product-mini-card">
                        <div class="product-mini-image">
                            <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200" alt="Urban Street Pro">
                        </div>
                        <div class="product-mini-info">
                            <div class="product-mini-name">Urban Street Pro</div>
                            <div class="product-mini-price">$89.99</div>
                            <div class="product-mini-stock">Stock: 32 unidades</div>
                        </div>
                    </div>

                    <div class="product-mini-card">
                        <div class="product-mini-image">
                            <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200" alt="Neon Boost">
                        </div>
                        <div class="product-mini-info">
                            <div class="product-mini-name">Neon Boost Limited</div>
                            <div class="product-mini-price">$149.99</div>
                            <div class="product-mini-stock">Stock: 12 unidades</div>
                        </div>
                    </div>

                    <div class="product-mini-card">
                        <div class="product-mini-image">
                            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200" alt="Classic Runner">
                        </div>
                        <div class="product-mini-info">
                            <div class="product-mini-name">Classic Runner</div>
                            <div class="product-mini-price">$99.99</div>
                            <div class="product-mini-stock">Stock: 28 unidades</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // TOGGLE SIDEBAR
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('collapsed');
            
            // Save state
            const isCollapsed = sidebar.classList.contains('collapsed');
            console.log(`Sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`);
        }

        // MOBILE SIDEBAR
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('collapsed');
            }
        });

        // NAVIGATION
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                // Remove active from all links
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                // Add active to clicked link
                this.classList.add('active');
            });
        });

        // FILTER BUTTONS
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const parent = this.parentElement;
                parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                console.log(`Filter changed to: ${this.textContent}`);
            });
        });

        // TABLE ACTIONS
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('title');
                const row = this.closest('tr');
                const orderId = row.querySelector('.order-id').textContent;
                
                console.log(`${action} - ${orderId}`);
                alert(`${action}: ${orderId}`);
            });
        });

        // SHOW SECTION
        function showSection(section) {
            console.log(`Navegando a sección: ${section}`);
            alert(`Función "${section}" en desarrollo`);
        }

        // ADD PRODUCT MODAL
        function showAddProductModal() {
            alert('Modal de agregar producto (en desarrollo)');
        }

        // SEARCH FUNCTIONALITY
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log(`Buscando: ${searchTerm}`);
            
            // Filter table rows
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

        // STATS ANIMATION
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                
                if (element.textContent.includes('$')) {
                    element.textContent = '$' + value.toLocaleString();
                } else if (element.textContent.includes('.')) {
                    element.textContent = (progress * end).toFixed(1);
                } else {
                    element.textContent = value.toLocaleString();
                }
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // ANIMATE STATS ON LOAD
        window.addEventListener('load', () => {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const text = stat.textContent;
                let endValue;
                
                if (text.includes('$')) {
                    endValue = parseInt(text.replace(/[$,]/g, ''));
                    animateValue(stat, 0, endValue, 1500);
                } else if (text.includes('.')) {
                    endValue = parseFloat(text);
                    animateValue(stat, 0, endValue, 1500);
                } else {
                    endValue = parseInt(text.replace(/,/g, ''));
                    animateValue(stat, 0, endValue, 1500);
                }
            });
        });

        // NOTIFICATION CLICK
        document.querySelectorAll('.header-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.textContent.trim();
                let message = '';
                
                switch(icon) {
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

        // USER PROFILE CLICK
        document.querySelector('.user-profile').addEventListener('click', function() {
            alert('Perfil de usuario\n\nOpciones:\n- Mi cuenta\n- Configuración\n- Cerrar sesión');
        });

        // PRODUCT CARD CLICK
        document.querySelectorAll('.product-mini-card').forEach(card => {
            card.addEventListener('click', function() {
                const name = this.querySelector('.product-mini-name').textContent;
                const price = this.querySelector('.product-mini-price').textContent;
                const stock = this.querySelector('.product-mini-stock').textContent;
                
                alert(`Producto: ${name}\nPrecio: ${price}\n${stock}`);
            });
        });

        // STAT CARD CLICK
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', function() {
                const label = this.querySelector('.stat-label').textContent;
                const value = this.querySelector('.stat-value').textContent;
                
                console.log(`Stat clicked: ${label} - ${value}`);
            });
        });

        // EXPORT BUTTON
        document.querySelectorAll('.action-btn').forEach(btn => {
            if (btn.textContent.includes('Exportar')) {
                btn.addEventListener('click', function() {
                    console.log('Exportando datos...');
                    alert('Exportando datos a CSV...\n(Función en desarrollo)');
                });
            }
            
            if (btn.textContent.includes('Filtrar')) {
                btn.addEventListener('click', function() {
                    console.log('Abriendo filtros...');
                    alert('Opciones de filtro:\n- Por fecha\n- Por estado\n- Por cliente\n- Por monto');
                });
            }
        });

        // KEYBOARD SHORTCUTS
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Ctrl/Cmd + B for sidebar toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
            
            // ESC to clear search
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        });

        // STATUS BADGE HOVER
        document.querySelectorAll('.status-badge').forEach(badge => {
            badge.addEventListener('click', function(e) {
                e.stopPropagation();
                const status = this.textContent;
                alert(`Cambiar estado de pedido desde: ${status}`);
            });
        });

        // REAL-TIME UPDATES SIMULATION
        function simulateRealTimeUpdates() {
            setInterval(() => {
                // Simulate notification badge update
                const notificationBadge = document.querySelector('.notification-badge');
                if (notificationBadge) {
                    const currentCount = parseInt(notificationBadge.textContent);
                    // Random chance to update
                    if (Math.random() > 0.9) {
                        notificationBadge.textContent = currentCount + 1;
                        console.log('Nueva notificación recibida');
                    }
                }
            }, 10000); // Every 10 seconds
        }

        // Start real-time updates
        simulateRealTimeUpdates();

        // AUTO-REFRESH STATS
        function refreshStats() {
            console.log('Actualizando estadísticas...');
            // In production, this would fetch new data from API
        }

        // Refresh stats every 30 seconds
        setInterval(refreshStats, 30000);

        // LOG KEYBOARD SHORTCUTS
        console.log(`
        ⌨️ ATAJOS DE TECLADO:
        - Ctrl/Cmd + K: Enfocar búsqueda
        - Ctrl/Cmd + B: Toggle sidebar
        - ESC: Limpiar búsqueda
        
        🎯 FUNCIONES:
        - Click en stats para ver detalles
        - Click en productos para editar
        - Click en badges de estado para cambiar
        - Búsqueda en tiempo real en tabla
        `);
    </script>
</body>
</html>