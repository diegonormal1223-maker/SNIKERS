<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Catálogo SNIKER - Descubre nuestra colección completa de sneakers exclusivos">
    <title>SNIKER - Catálogo</title>
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
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background-color: var(--dark-bg);
            color: var(--text-white);
            line-height: 1.6;
        }

        /* HEADER */
        .topbar {
            background-color: #000;
            text-align: center;
            padding: 8px;
            font-size: 13px;
            color: var(--neon-green);
            font-weight: 600;
            letter-spacing: 1px;
        }

        header {
            background-color: rgba(10, 10, 15, 0.95);
            padding: 20px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(57, 255, 20, 0.1);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 28px;
            font-weight: 900;
            color: var(--neon-green);
            text-shadow: 0 0 20px var(--neon-green);
            text-decoration: none;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 30px;
        }

        nav a {
            color: var(--text-white);
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s;
        }

        nav a:hover {
            color: var(--neon-green);
        }

        .header-actions {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .search-box {
            position: relative;
        }

        .search-box input {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(57, 255, 20, 0.3);
            padding: 10px 40px 10px 15px;
            border-radius: 25px;
            color: var(--text-white);
            width: 250px;
            outline: none;
            transition: all 0.3s;
        }

        .search-box input:focus {
            border-color: var(--neon-green);
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
        }

        .icon-btn {
            background: none;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .icon-btn:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
            transform: scale(1.1);
        }

        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: var(--neon-purple);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* CATALOG HEADER */
        .catalog-header {
            padding: 60px 5% 40px;
            text-align: center;
        }

        .catalog-title {
            font-size: 56px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 15px;
            background: linear-gradient(135deg, var(--neon-green), var(--text-white));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .catalog-subtitle {
            color: var(--text-gray);
            font-size: 18px;
        }

        /* MAIN CONTAINER */
        .catalog-container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 0 5% 100px;
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 40px;
        }

        /* FILTERS SIDEBAR */
        .filters-sidebar {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(57, 255, 20, 0.2);
            height: fit-content;
            position: sticky;
            top: 100px;
        }

        .filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .filters-title {
            font-size: 22px;
            font-weight: 900;
            text-transform: uppercase;
            color: var(--neon-green);
        }

        .clear-filters {
            background: transparent;
            border: none;
            color: var(--neon-purple);
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            text-decoration: underline;
            transition: all 0.3s;
        }

        .clear-filters:hover {
            color: var(--neon-green);
        }

        .filter-section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid rgba(57, 255, 20, 0.1);
        }

        .filter-section:last-child {
            border-bottom: none;
        }

        .filter-label {
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 15px;
            color: var(--text-white);
            letter-spacing: 0.5px;
        }

        .filter-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .filter-option {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.3s;
            padding: 8px;
            border-radius: 8px;
        }

        .filter-option:hover {
            background-color: rgba(57, 255, 20, 0.05);
        }

        .filter-option input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: var(--neon-green);
        }

        .filter-option label {
            cursor: pointer;
            font-size: 14px;
            color: var(--text-gray);
            flex: 1;
        }

        .filter-count {
            color: var(--text-gray);
            font-size: 12px;
        }

        /* SIZE FILTER */
        .size-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .size-option {
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            padding: 12px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 700;
        }

        .size-option:hover {
            border-color: var(--neon-green);
            background-color: rgba(57, 255, 20, 0.1);
        }

        .size-option.active {
            background: var(--neon-green);
            color: var(--dark-bg);
            border-color: var(--neon-green);
        }

        /* PRICE RANGE */
        .price-range {
            margin-top: 15px;
        }

        .price-range input[type="range"] {
            width: 100%;
            height: 6px;
            background: rgba(57, 255, 20, 0.2);
            outline: none;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        .price-range input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--neon-green);
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 0 10px var(--neon-green);
        }

        .price-values {
            display: flex;
            justify-content: space-between;
            color: var(--neon-green);
            font-weight: 700;
        }

        /* COLOR FILTER */
        .color-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .color-option {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid transparent;
            transition: all 0.3s;
            position: relative;
        }

        .color-option:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }

        .color-option.active {
            border-color: var(--neon-green);
            box-shadow: 0 0 15px var(--neon-green);
        }

        .color-option.active::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: 700;
            font-size: 16px;
        }

        /* ACTIVE FILTERS */
        .active-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 30px;
        }

        .filter-chip {
            background-color: rgba(57, 255, 20, 0.1);
            border: 2px solid var(--neon-green);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--neon-green);
            font-weight: 600;
        }

        .filter-chip button {
            background: none;
            border: none;
            color: var(--neon-green);
            cursor: pointer;
            font-size: 16px;
            font-weight: 700;
        }

        /* CATALOG MAIN */
        .catalog-main {
            min-height: 600px;
        }

        .catalog-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background-color: var(--dark-card);
            border-radius: 15px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .results-count {
            font-size: 16px;
            color: var(--text-gray);
        }

        .results-count strong {
            color: var(--neon-green);
            font-size: 20px;
        }

        .sort-options {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .sort-options label {
            font-size: 14px;
            color: var(--text-gray);
            font-weight: 600;
        }

        .sort-options select {
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            padding: 10px 15px;
            border-radius: 10px;
            color: var(--text-white);
            cursor: pointer;
            outline: none;
            font-weight: 600;
        }

        .view-toggle {
            display: flex;
            gap: 10px;
        }

        .view-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            width: 40px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            color: var(--text-gray);
        }

        .view-btn.active {
            background: var(--neon-green);
            color: var(--dark-bg);
            border-color: var(--neon-green);
        }

        /* PRODUCTS GRID */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 60px;
        }

        .products-grid.list-view {
            grid-template-columns: 1fr;
        }

        .product-card {
            background-color: var(--dark-card);
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.3s;
            border: 2px solid transparent;
            position: relative;
            cursor: pointer;
        }

        .product-card:hover {
            transform: translateY(-10px);
            border-color: var(--neon-green);
            box-shadow: 0 20px 40px rgba(57, 255, 20, 0.2);
        }

        .product-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background-color: var(--neon-green);
            color: var(--dark-bg);
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 1;
        }

        .product-badge.limited {
            background-color: var(--neon-purple);
            color: white;
        }

        .product-badge.sale {
            background-color: #ff3860;
            color: white;
        }

        .product-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 280px;
            position: relative;
            overflow: hidden;
        }

        .product-image img {
            width: 100%;
            max-width: 220px;
            transition: transform 0.3s;
        }

        .product-card:hover .product-image img {
            transform: scale(1.1) rotate(-5deg);
        }

        .favorite-btn {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(0, 0, 0, 0.7);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s;
            z-index: 1;
        }

        .favorite-btn:hover {
            background: var(--neon-purple);
            transform: scale(1.1);
        }

        .favorite-btn.active {
            background: var(--neon-purple);
        }

        .product-info {
            padding: 25px;
        }

        .product-category {
            font-size: 12px;
            color: var(--text-gray);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .product-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .product-colors {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
        }

        .color-dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .product-price {
            font-size: 24px;
            font-weight: 900;
            color: var(--neon-green);
            margin-bottom: 15px;
        }

        .product-price.sale .original-price {
            text-decoration: line-through;
            color: var(--text-gray);
            font-size: 18px;
            margin-right: 10px;
        }

        .product-actions {
            display: flex;
            gap: 10px;
        }

        .add-cart-btn {
            flex: 1;
            background-color: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
            padding: 12px;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 13px;
        }

        .add-cart-btn:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
        }

        .quick-view-btn {
            background-color: rgba(176, 38, 255, 0.2);
            border: 2px solid var(--neon-purple);
            color: var(--neon-purple);
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }

        .quick-view-btn:hover {
            background-color: var(--neon-purple);
            color: white;
        }

        /* LIST VIEW */
        .product-card.list-view {
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 30px;
        }

        .product-card.list-view .product-image {
            min-height: 200px;
            padding: 30px;
        }

        .product-card.list-view .product-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* EMPTY STATE */
        .empty-state {
            text-align: center;
            padding: 100px 40px;
            display: none;
        }

        .empty-state.show {
            display: block;
        }

        .empty-icon {
            font-size: 80px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-state h3 {
            font-size: 28px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .empty-state p {
            color: var(--text-gray);
            font-size: 16px;
        }

        /* PAGINATION */
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 60px;
        }

        .page-btn {
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            color: var(--text-white);
            width: 45px;
            height: 45px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 700;
            transition: all 0.3s;
        }

        .page-btn:hover {
            border-color: var(--neon-green);
            background-color: rgba(57, 255, 20, 0.1);
        }

        .page-btn.active {
            background: var(--neon-green);
            color: var(--dark-bg);
            border-color: var(--neon-green);
        }

        /* MOBILE FILTERS */
        .mobile-filter-btn {
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            color: white;
            border: none;
            padding: 18px 30px;
            border-radius: 30px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(57, 255, 20, 0.5);
            z-index: 999;
        }

        .filters-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1001;
            overflow-y: auto;
            padding: 20px;
        }

        .filters-overlay.show {
            display: block;
        }

        .filters-overlay .filters-sidebar {
            position: relative;
            top: 0;
            max-width: 500px;
            margin: 0 auto;
        }

        .close-filters {
            background: var(--neon-purple);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
        }

        /* LOADING */
        .loading {
            text-align: center;
            padding: 60px;
            display: none;
        }

        .loading.show {
            display: block;
        }

        .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(57, 255, 20, 0.2);
            border-top-color: var(--neon-green);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* FOOTER */
        footer {
            background-color: #000;
            padding: 30px 5%;
            text-align: center;
            color: var(--text-gray);
            font-size: 13px;
            border-top: 2px solid var(--neon-green);
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
            .catalog-container {
                grid-template-columns: 250px 1fr;
                gap: 30px;
            }
        }

        @media (max-width: 1024px) {
            .catalog-container {
                grid-template-columns: 1fr;
            }

            .filters-sidebar {
                display: none;
            }

            .mobile-filter-btn {
                display: block;
            }

            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }
        }

        @media (max-width: 768px) {
            .catalog-title {
                font-size: 36px;
            }

            nav {
                display: none;
            }

            .catalog-toolbar {
                flex-direction: column;
                gap: 15px;
            }

            .products-grid {
                grid-template-columns: 1fr;
            }

            .product-card.list-view {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- TOPBAR -->
    <div class="topbar">
        ⚡ NUEVOS DROPS CADA SEMANA - ENVÍO GRATIS
    </div>

    <!-- HEADER -->
    <header>
        <a href="index.php" class="logo">
            <div class="logo-icon"></div>
            <span>SNIKER</span>
        </a>
        
        <nav>
            <ul>
                <li><a href="index.php">HOME</a></li>
                <li><a href="catalogo.php">CATALOG</a></li>
                <li><a href="#new">NEW DROPS</a></li>
                <li><a href="#collections">COLLECTIONS</a></li>
            </ul>
        </nav>

        <div class="header-actions">
            <div class="search-box">
                <input type="search" id="globalSearch" placeholder="Buscar sneakers...">
            </div>
            <button class="icon-btn">👤</button>
            <button class="icon-btn">❤️</button>
            <button class="icon-btn">
                🛒
                <span class="cart-badge">3</span>
            </button>
        </div>
    </header>

    <!-- CATALOG HEADER -->
    <div class="catalog-header">
        <h1 class="catalog-title">Catálogo Completo</h1>
        <p class="catalog-subtitle">Descubre nuestra colección exclusiva de sneakers premium</p>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="catalog-container">
        <!-- FILTERS SIDEBAR -->
        <aside class="filters-sidebar">
            <div class="filters-header">
                <h2 class="filters-title">Filtros</h2>
                <button class="clear-filters" onclick="clearAllFilters()">Limpiar todo</button>
            </div>

            <!-- CATEGORY FILTER -->
            <div class="filter-section">
                <div class="filter-label">Categoría</div>
                <div class="filter-options">
                    <div class="filter-option">
                        <input type="checkbox" id="cat-running" value="running" onchange="applyFilters()">
                        <label for="cat-running">Running</label>
                        <span class="filter-count">(24)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="cat-lifestyle" value="lifestyle" onchange="applyFilters()">
                        <label for="cat-lifestyle">Lifestyle</label>
                        <span class="filter-count">(18)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="cat-basketball" value="basketball" onchange="applyFilters()">
                        <label for="cat-basketball">Basketball</label>
                        <span class="filter-count">(12)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="cat-skate" value="skate" onchange="applyFilters()">
                        <label for="cat-skate">Skate</label>
                        <span class="filter-count">(8)</span>
                    </div>
                </div>
            </div>

            <!-- BRAND FILTER -->
            <div class="filter-section">
                <div class="filter-label">Marca</div>
                <div class="filter-options">
                    <div class="filter-option">
                        <input type="checkbox" id="brand-nike" value="nike" onchange="applyFilters()">
                        <label for="brand-nike">Nike</label>
                        <span class="filter-count">(32)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="brand-adidas" value="adidas" onchange="applyFilters()">
                        <label for="brand-adidas">Adidas</label>
                        <span class="filter-count">(28)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="brand-jordan" value="jordan" onchange="applyFilters()">
                        <label for="brand-jordan">Jordan</label>
                        <span class="filter-count">(15)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="brand-puma" value="puma" onchange="applyFilters()">
                        <label for="brand-puma">Puma</label>
                        <span class="filter-count">(12)</span>
                    </div>
                </div>
            </div>

            <!-- SIZE FILTER -->
            <div class="filter-section">
                <div class="filter-label">Talla</div>
                <div class="size-grid">
                    <div class="size-option" onclick="toggleSize(this, '38')">38</div>
                    <div class="size-option" onclick="toggleSize(this, '39')">39</div>
                    <div class="size-option" onclick="toggleSize(this, '40')">40</div>
                    <div class="size-option" onclick="toggleSize(this, '41')">41</div>
                    <div class="size-option" onclick="toggleSize(this, '42')">42</div>
                    <div class="size-option" onclick="toggleSize(this, '43')">43</div>
                    <div class="size-option" onclick="toggleSize(this, '44')">44</div>
                    <div class="size-option" onclick="toggleSize(this, '45')">45</div>
                    <div class="size-option" onclick="toggleSize(this, '46')">46</div>
                </div>
            </div>

            <!-- PRICE FILTER -->
            <div class="filter-section">
                <div class="filter-label">Precio</div>
                <div class="price-range">
                    <input type="range" min="0" max="500" value="500" id="priceRange" oninput="updatePrice(this.value)">
                    <div class="price-values">
                        <span>$0</span>
                        <span id="maxPrice">$500</span>
                    </div>
                </div>
            </div>

            <!-- COLOR FILTER -->
            <div class="filter-section">
                <div class="filter-label">Color</div>
                <div class="color-grid">
                    <div class="color-option" style="background: #000;" onclick="toggleColor(this, 'black')"></div>
                    <div class="color-option" style="background: #fff; border: 2px solid #333;" onclick="toggleColor(this, 'white')"></div>
                    <div class="color-option" style="background: #ff0000;" onclick="toggleColor(this, 'red')"></div>
                    <div class="color-option" style="background: #0000ff;" onclick="toggleColor(this, 'blue')"></div>
                    <div class="color-option" style="background: #00ff00;" onclick="toggleColor(this, 'green')"></div>
                    <div class="color-option" style="background: #ffff00;" onclick="toggleColor(this, 'yellow')"></div>
                    <div class="color-option" style="background: #ff6600;" onclick="toggleColor(this, 'orange')"></div>
                    <div class="color-option" style="background: #ff00ff;" onclick="toggleColor(this, 'purple')"></div>
                </div>
            </div>

            <!-- AVAILABILITY FILTER -->
            <div class="filter-section">
                <div class="filter-label">Disponibilidad</div>
                <div class="filter-options">
                    <div class="filter-option">
                        <input type="checkbox" id="stock-available" value="available" onchange="applyFilters()">
                        <label for="stock-available">En Stock</label>
                        <span class="filter-count">(45)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="stock-limited" value="limited" onchange="applyFilters()">
                        <label for="stock-limited">Edición Limitada</label>
                        <span class="filter-count">(8)</span>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="stock-new" value="new" onchange="applyFilters()">
                        <label for="stock-new">Nuevos</label>
                        <span class="filter-count">(12)</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- CATALOG MAIN -->
        <main class="catalog-main">
            <!-- ACTIVE FILTERS -->
            <div class="active-filters" id="activeFilters"></div>

            <!-- TOOLBAR -->
            <div class="catalog-toolbar">
                <div class="results-count">
                    Mostrando <strong id="productCount">24</strong> productos
                </div>

                <div class="sort-options">
                    <label for="sortSelect">Ordenar por:</label>
                    <select id="sortSelect" onchange="sortProducts(this.value)">
                        <option value="relevance">Relevancia</option>
                        <option value="price-low">Precio: Menor a Mayor</option>
                        <option value="price-high">Precio: Mayor a Menor</option>
                        <option value="newest">Más Nuevos</option>
                        <option value="popular">Más Populares</option>
                    </select>
                </div>

                <div class="view-toggle">
                    <button class="view-btn active" onclick="setView('grid')">◫</button>
                    <button class="view-btn" onclick="setView('list')">☰</button>
                </div>
            </div>

            <!-- LOADING -->
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Cargando productos...</p>
            </div>

            <!-- EMPTY STATE -->
            <div class="empty-state" id="emptyState">
                <div class="empty-icon">🔍</div>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o busca algo diferente</p>
            </div>

            <!-- PRODUCTS GRID -->
            <div class="products-grid" id="productsGrid">
                <!-- Product 1 -->
                <div class="product-card" data-category="running" data-brand="nike" data-price="129.99" data-color="black">
                    <span class="product-badge">NEW</span>
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Air Retro Classic">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Running</div>
                        <h3 class="product-name">Air Retro Classic</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #000;"></div>
                            <div class="color-dot" style="background: #39ff14;"></div>
                            <div class="color-dot" style="background: #b026ff;"></div>
                        </div>
                        <div class="product-price">$129.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 2 -->
                <div class="product-card" data-category="lifestyle" data-brand="adidas" data-price="89.99" data-color="white">
                    <span class="product-badge limited">LIMITED</span>
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400" alt="Urban Street Pro">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Lifestyle</div>
                        <h3 class="product-name">Urban Street Pro</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #fff; border: 2px solid #333;"></div>
                            <div class="color-dot" style="background: #b026ff;"></div>
                        </div>
                        <div class="product-price">$89.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 3 -->
                <div class="product-card" data-category="basketball" data-brand="jordan" data-price="149.99" data-color="red">
                    <span class="product-badge sale">SALE</span>
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400" alt="Neon Boost Limited">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Basketball</div>
                        <h3 class="product-name">Neon Boost Limited</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #000;"></div>
                            <div class="color-dot" style="background: #39ff14;"></div>
                        </div>
                        <div class="product-price sale">
                            <span class="original-price">$199.99</span>
                            $149.99
                        </div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 4 -->
                <div class="product-card" data-category="running" data-brand="nike" data-price="99.99" data-color="blue">
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" alt="Classic Runner">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Running</div>
                        <h3 class="product-name">Classic Runner</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #0000ff;"></div>
                            <div class="color-dot" style="background: #fff; border: 2px solid #333;"></div>
                        </div>
                        <div class="product-price">$99.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 5 -->
                <div class="product-card" data-category="lifestyle" data-brand="puma" data-price="119.99" data-color="black">
                    <span class="product-badge">NEW</span>
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400" alt="Street Edition">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Lifestyle</div>
                        <h3 class="product-name">Street Edition</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #000;"></div>
                            <div class="color-dot" style="background: #ff6600;"></div>
                        </div>
                        <div class="product-price">$119.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 6 -->
                <div class="product-card" data-category="skate" data-brand="nike" data-price="139.99" data-color="green">
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" alt="Premium Pack">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Skate</div>
                        <h3 class="product-name">Premium Pack</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #00ff00;"></div>
                            <div class="color-dot" style="background: #000;"></div>
                        </div>
                        <div class="product-price">$139.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 7 -->
                <div class="product-card" data-category="running" data-brand="adidas" data-price="109.99" data-color="purple">
                    <span class="product-badge limited">LIMITED</span>
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400" alt="Urban Boost">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Running</div>
                        <h3 class="product-name">Urban Boost</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #b026ff;"></div>
                            <div class="color-dot" style="background: #000;"></div>
                        </div>
                        <div class="product-price">$109.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>

                <!-- Product 8 -->
                <div class="product-card" data-category="basketball" data-brand="jordan" data-price="179.99" data-color="red">
                    <button class="favorite-btn" onclick="toggleFavorite(this)">♡</button>
                    <div class="product-image">
                        <img src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400" alt="Jordan Retro">
                    </div>
                    <div class="product-info">
                        <div class="product-category">Basketball</div>
                        <h3 class="product-name">Jordan Retro</h3>
                        <div class="product-colors">
                            <div class="color-dot" style="background: #ff0000;"></div>
                            <div class="color-dot" style="background: #000;"></div>
                        </div>
                        <div class="product-price">$179.99</div>
                        <div class="product-actions">
                            <button class="add-cart-btn" onclick="addToCart(this)">Agregar</button>
                            <button class="quick-view-btn">👁</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PAGINATION -->
            <div class="pagination">
                <button class="page-btn">←</button>
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <button class="page-btn">4</button>
                <button class="page-btn">→</button>
            </div>
        </main>
    </div>

    <!-- MOBILE FILTER BUTTON -->
    <button class="mobile-filter-btn" onclick="toggleMobileFilters()">
        🔍 Filtros
    </button>

    <!-- MOBILE FILTERS OVERLAY -->
    <div class="filters-overlay" id="filtersOverlay">
        <div class="filters-sidebar">
            <!-- Same filters as sidebar -->
            <div class="filters-header">
                <h2 class="filters-title">Filtros</h2>
                <button class="clear-filters" onclick="clearAllFilters()">Limpiar todo</button>
            </div>
            
            <!-- Include all filter sections here (copy from sidebar) -->
            
            <button class="close-filters" onclick="toggleMobileFilters()">Aplicar Filtros</button>
        </div>
    </div>

    <!-- FOOTER -->
    <footer>
        <p>© 2025 SNIKER. All rights reserved. | 🛡️ Authentic Sneakers | 100% Verified Products</p>
    </footer>

    <script>
        let selectedSizes = [];
        let selectedColors = [];
        let maxPrice = 500;
        let currentView = 'grid';

        // TOGGLE SIZE
        function toggleSize(element, size) {
            element.classList.toggle('active');
            const index = selectedSizes.indexOf(size);
            if (index > -1) {
                selectedSizes.splice(index, 1);
            } else {
                selectedSizes.push(size);
            }
            applyFilters();
        }

        // TOGGLE COLOR
        function toggleColor(element, color) {
            element.classList.toggle('active');
            const index = selectedColors.indexOf(color);
            if (index > -1) {
                selectedColors.splice(index, 1);
            } else {
                selectedColors.push(color);
            }
            applyFilters();
        }

        // UPDATE PRICE
                function updatePrice(value) {
                    maxPrice = value;
                    document.getElementById('maxPrice').textContent = '$' + value;
                    applyFilters();
                }

        // APPLY FILTERS
        function applyFilters() {
            const products = document.querySelectorAll('.product-card');
            let visibleCount = 0;

            // Get selected categories
            const selectedCategories = Array.from(document.querySelectorAll('[id^="cat-"]:checked'))
                .map(cb => cb.value);
            
            // Get selected brands
            const selectedBrands = Array.from(document.querySelectorAll('[id^="brand-"]:checked'))
                .map(cb => cb.value);

            products.forEach(product => {
                let show = true;

                // Filter by category
                if (selectedCategories.length > 0) {
                    const category = product.dataset.category;
                    if (!selectedCategories.includes(category)) {
                        show = false;
                    }
                }

                // Filter by brand
                if (selectedBrands.length > 0) {
                    const brand = product.dataset.brand;
                    if (!selectedBrands.includes(brand)) {
                        show = false;
                    }
                }

                // Filter by color
                if (selectedColors.length > 0) {
                    const color = product.dataset.color;
                    if (!selectedColors.includes(color)) {
                        show = false;
                    }
                }

                // Filter by price
                const price = parseFloat(product.dataset.price);
                if (price > maxPrice) {
                    show = false;
                }

                // Show/hide product
                if (show) {
                    product.style.display = '';
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });

            // Update count
            document.getElementById('productCount').textContent = visibleCount;

            // Show/hide empty state
            if (visibleCount === 0) {
                document.getElementById('emptyState').classList.add('show');
            } else {
                document.getElementById('emptyState').classList.remove('show');
            }

            // Update active filters display
            updateActiveFilters();
        }

        // UPDATE ACTIVE FILTERS
        function updateActiveFilters() {
            const container = document.getElementById('activeFilters');
            container.innerHTML = '';

            // Add category filters
            document.querySelectorAll('[id^="cat-"]:checked').forEach(cb => {
                addFilterChip(cb.nextElementSibling.textContent, () => {
                    cb.checked = false;
                    applyFilters();
                });
            });

            // Add brand filters
            document.querySelectorAll('[id^="brand-"]:checked').forEach(cb => {
                addFilterChip(cb.nextElementSibling.textContent, () => {
                    cb.checked = false;
                    applyFilters();
                });
            });

            // Add size filters
            selectedSizes.forEach(size => {
                addFilterChip(`Talla ${size}`, () => {
                    const sizeElement = Array.from(document.querySelectorAll('.size-option'))
                        .find(el => el.textContent === size);
                    if (sizeElement) {
                        toggleSize(sizeElement, size);
                    }
                });
            });

            // Add color filters
            selectedColors.forEach(color => {
                addFilterChip(`Color: ${color}`, () => {
                    selectedColors = selectedColors.filter(c => c !== color);
                    document.querySelectorAll('.color-option').forEach(el => {
                        if (el.onclick.toString().includes(color)) {
                            el.classList.remove('active');
                        }
                    });
                    applyFilters();
                });
            });
        }

        function addFilterChip(text, removeCallback) {
            const container = document.getElementById('activeFilters');
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                ${text}
                <button onclick="event.stopPropagation()">×</button>
            `;
            chip.querySelector('button').onclick = removeCallback;
            container.appendChild(chip);
        }

        // CLEAR ALL FILTERS
        function clearAllFilters() {
            // Clear checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // Clear sizes
            selectedSizes = [];
            document.querySelectorAll('.size-option').forEach(el => {
                el.classList.remove('active');
            });

            // Clear colors
            selectedColors = [];
            document.querySelectorAll('.color-option').forEach(el => {
                el.classList.remove('active');
            });

            // Reset price
            document.getElementById('priceRange').value = 500;
            updatePrice(500);

            applyFilters();
        }

        // SORT PRODUCTS
        function sortProducts(sortBy) {
            const grid = document.getElementById('productsGrid');
            const products = Array.from(grid.children);

            products.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price);
                const priceB = parseFloat(b.dataset.price);

                switch(sortBy) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'newest':
                        return b.querySelector('.product-badge') ? -1 : 1;
                    case 'popular':
                        return Math.random() - 0.5;
                    default:
                        return 0;
                }
            });

            products.forEach(product => grid.appendChild(product));
        }

        // SET VIEW
        function setView(view) {
            currentView = view;
            const grid = document.getElementById('productsGrid');
            const viewBtns = document.querySelectorAll('.view-btn');

            viewBtns.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            if (view === 'list') {
                grid.classList.add('list-view');
                grid.querySelectorAll('.product-card').forEach(card => {
                    card.classList.add('list-view');
                });
            } else {
                grid.classList.remove('list-view');
                grid.querySelectorAll('.product-card').forEach(card => {
                    card.classList.remove('list-view');
                });
            }
        }

        // ADD TO CART
        function addToCart(button) {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            button.textContent = '✓ Agregado';
            button.style.background = 'var(--neon-green)';
            button.style.color = 'var(--dark-bg)';

            setTimeout(() => {
                button.textContent = 'Agregar';
                button.style.background = '';
                button.style.color = '';
            }, 2000);

            console.log(`Agregado al carrito: ${productName}`);
        }

        // TOGGLE FAVORITE
        function toggleFavorite(button) {
            button.classList.toggle('active');
            button.textContent = button.classList.contains('active') ? '♥' : '♡';
        }

        // TOGGLE MOBILE FILTERS
        function toggleMobileFilters() {
            document.getElementById('filtersOverlay').classList.toggle('show');
        }

        // GLOBAL SEARCH
        document.getElementById('globalSearch').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                const category = product.dataset.category.toLowerCase();
                
                if (name.includes(searchTerm) || category.includes(searchTerm)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });

        // SIMULATE LOADING
        window.addEventListener('load', () => {
            const loading = document.getElementById('loading');
            loading.classList.add('show');
            
            setTimeout(() => {
                loading.classList.remove('show');
            }, 1000);
        });

        // PAGINATION
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                if (!['←', '→'].includes(this.textContent)) {
                    this.classList.add('active');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>