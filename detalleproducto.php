<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Air Retro Classic - Sneaker exclusivo SNIKER">
    <title>Air Retro Classic - SNIKER</title>
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

        .header-actions {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .back-link {
            color: var(--text-gray);
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s;
        }

        .back-link:hover {
            color: var(--neon-green);
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

        /* BREADCRUMB */
        .breadcrumb {
            max-width: 1400px;
            margin: 30px auto 0;
            padding: 0 5%;
            display: flex;
            gap: 10px;
            font-size: 14px;
            color: var(--text-gray);
        }

        .breadcrumb a {
            color: var(--text-gray);
            text-decoration: none;
            transition: color 0.3s;
        }

        .breadcrumb a:hover {
            color: var(--neon-green);
        }

        /* PRODUCT CONTAINER */
        .product-container {
            max-width: 1400px;
            margin: 40px auto 100px;
            padding: 0 5%;
        }

        .product-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-bottom: 80px;
        }

        /* IMAGE GALLERY */
        .gallery-section {
            position: sticky;
            top: 120px;
            height: fit-content;
        }

        .main-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 20px;
            padding: 60px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 500px;
            position: relative;
            overflow: hidden;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .main-image img {
            width: 100%;
            max-width: 450px;
            transition: transform 0.3s;
            cursor: zoom-in;
        }

        .main-image img:hover {
            transform: scale(1.05);
        }

        .zoom-badge {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            color: white;
        }

        .thumbnail-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .thumbnail {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s;
        }

        .thumbnail:hover,
        .thumbnail.active {
            border-color: var(--neon-green);
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
        }

        .thumbnail img {
            width: 100%;
        }

        /* PRODUCT INFO */
        .product-info {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .product-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .product-badges {
            display: flex;
            gap: 10px;
        }

        .badge {
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .badge.new {
            background: var(--neon-green);
            color: var(--dark-bg);
        }

        .badge.limited {
            background: var(--neon-purple);
            color: white;
        }

        .favorite-btn-large {
            background: rgba(176, 38, 255, 0.2);
            border: 2px solid var(--neon-purple);
            color: var(--neon-purple);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s;
        }

        .favorite-btn-large:hover,
        .favorite-btn-large.active {
            background: var(--neon-purple);
            color: white;
            transform: scale(1.1);
        }

        .product-category {
            font-size: 14px;
            color: var(--text-gray);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        .product-title {
            font-size: 48px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 15px;
            background: linear-gradient(135deg, var(--neon-green), var(--text-white));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
        }

        .product-subtitle {
            font-size: 18px;
            color: var(--text-gray);
            margin-bottom: 20px;
        }

        .rating-section {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 2px solid rgba(57, 255, 20, 0.1);
        }

        .stars {
            color: #ffaa00;
            font-size: 20px;
            letter-spacing: 3px;
        }

        .rating-text {
            color: var(--text-gray);
            font-size: 14px;
        }

        .product-price {
            font-size: 56px;
            font-weight: 900;
            color: var(--neon-green);
            line-height: 1;
        }

        .price-info {
            font-size: 14px;
            color: var(--text-gray);
            margin-top: 10px;
        }

        /* COLOR SELECTOR */
        .selector-section {
            background-color: var(--dark-card);
            border-radius: 15px;
            padding: 25px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .selector-label {
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 15px;
            color: var(--neon-green);
            letter-spacing: 1px;
        }

        .color-selector {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .color-option {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid transparent;
            transition: all 0.3s;
            position: relative;
        }

        .color-option:hover {
            transform: scale(1.15);
        }

        .color-option.active {
            border-color: var(--neon-green);
            box-shadow: 0 0 20px var(--neon-green);
        }

        .color-option.active::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: 700;
            font-size: 20px;
        }

        /* SIZE SELECTOR */
        .size-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
        }

        .size-option {
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            padding: 15px;
            text-align: center;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 700;
            font-size: 16px;
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

        .size-option.unavailable {
            opacity: 0.3;
            cursor: not-allowed;
            position: relative;
        }

        .size-option.unavailable::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 2px;
            background: var(--text-gray);
            transform: translateY(-50%) rotate(-45deg);
        }

        .size-guide-link {
            color: var(--neon-purple);
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            margin-top: 15px;
            display: inline-block;
        }

        .size-guide-link:hover {
            text-decoration: underline;
        }

        /* QUANTITY SELECTOR */
        .quantity-selector {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .quantity-control {
            display: flex;
            align-items: center;
            gap: 20px;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 12px 20px;
            border-radius: 12px;
            border: 2px solid rgba(57, 255, 20, 0.3);
        }

        .qty-btn {
            background: transparent;
            border: none;
            color: var(--neon-green);
            font-size: 24px;
            font-weight: 700;
            cursor: pointer;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }

        .qty-btn:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
        }

        .qty-value {
            font-weight: 700;
            font-size: 20px;
            min-width: 40px;
            text-align: center;
        }

        /* ACTION BUTTONS */
        .action-buttons {
            display: flex;
            gap: 15px;
        }

        .btn-add-cart {
            flex: 2;
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            border: none;
            padding: 20px;
            font-size: 18px;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-add-cart:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(57, 255, 20, 0.6);
        }

        .btn-buy-now {
            flex: 1;
            background: linear-gradient(135deg, var(--neon-purple), #8b1fb1);
            color: white;
            border: none;
            padding: 20px;
            font-size: 18px;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-buy-now:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(176, 38, 255, 0.6);
        }

        /* FEATURES */
        .features-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 15px;
            background-color: rgba(255, 255, 255, 0.03);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(57, 255, 20, 0.1);
        }

        .feature-icon {
            font-size: 24px;
        }

        .feature-text {
            font-size: 14px;
            color: var(--text-gray);
        }

        /* TABS SECTION */
        .tabs-section {
            margin-top: 60px;
        }

        .tabs-nav {
            display: flex;
            gap: 30px;
            border-bottom: 2px solid rgba(57, 255, 20, 0.2);
            margin-bottom: 40px;
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-gray);
            font-size: 18px;
            font-weight: 700;
            padding: 15px 0;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
            text-transform: uppercase;
        }

        .tab-btn.active {
            color: var(--neon-green);
        }

        .tab-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 3px;
            background: var(--neon-green);
            transition: width 0.3s;
        }

        .tab-btn.active::after {
            width: 100%;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
            animation: fadeIn 0.5s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .description-content {
            background-color: var(--dark-card);
            padding: 40px;
            border-radius: 20px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .description-content h3 {
            color: var(--neon-green);
            font-size: 24px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .description-content p {
            color: var(--text-gray);
            line-height: 1.8;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .spec-item {
            background-color: var(--dark-card);
            padding: 25px;
            border-radius: 15px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .spec-label {
            color: var(--text-gray);
            font-size: 13px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .spec-value {
            color: var(--neon-green);
            font-size: 18px;
            font-weight: 700;
        }

        /* REVIEWS */
        .reviews-summary {
            background-color: var(--dark-card);
            padding: 30px;
            border-radius: 20px;
            border: 2px solid rgba(57, 255, 20, 0.2);
            margin-bottom: 30px;
            text-align: center;
        }

        .average-rating {
            font-size: 72px;
            font-weight: 900;
            color: var(--neon-green);
            line-height: 1;
            margin-bottom: 10px;
        }

        .rating-stars-large {
            color: #ffaa00;
            font-size: 32px;
            letter-spacing: 5px;
            margin-bottom: 15px;
        }

        .review-card {
            background-color: var(--dark-card);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid rgba(57, 255, 20, 0.1);
            margin-bottom: 20px;
        }

        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .reviewer-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .reviewer-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
        }

        .reviewer-name {
            font-weight: 700;
        }

        .review-date {
            color: var(--text-gray);
            font-size: 13px;
        }

        .review-text {
            color: var(--text-gray);
            line-height: 1.8;
        }

        /* RELATED PRODUCTS */
        .related-section {
            margin-top: 80px;
        }

        .section-title {
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 40px;
            color: var(--neon-green);
        }

        .related-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
        }

        .related-product {
            background-color: var(--dark-card);
            border-radius: 15px;
            overflow: hidden;
            border: 2px solid transparent;
            transition: all 0.3s;
            cursor: pointer;
        }

        .related-product:hover {
            border-color: var(--neon-green);
            transform: translateY(-5px);
        }

        .related-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            padding: 30px;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .related-image img {
            width: 100%;
        }

        .related-info {
            padding: 20px;
        }

        .related-name {
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .related-price {
            color: var(--neon-green);
            font-size: 20px;
            font-weight: 900;
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

        /* STICKY ADD TO CART */
        .sticky-cart {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(10, 10, 15, 0.98);
            backdrop-filter: blur(10px);
            padding: 20px 5%;
            border-top: 2px solid var(--neon-green);
            z-index: 999;
            display: none;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
        }

        .sticky-cart.show {
            display: flex;
        }

        .sticky-product-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .sticky-image {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 10px;
            padding: 10px;
        }

        .sticky-image img {
            width: 100%;
        }

        .sticky-details h4 {
            font-size: 16px;
            margin-bottom: 5px;
        }

        .sticky-price {
            color: var(--neon-green);
            font-size: 20px;
            font-weight: 900;
        }

        /* NOTIFICATION */
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            padding: 20px 30px;
            border-radius: 12px;
            font-weight: 700;
            box-shadow: 0 10px 30px rgba(57, 255, 20, 0.5);
            z-index: 2000;
            display: none;
            animation: slideIn 0.5s;
        }

        .notification.show {
            display: block;
        }

        @keyframes slideIn {
            from { transform: translateX(400px); }
            to { transform: translateX(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
            .product-layout {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .gallery-section {
                position: relative;
                top: 0;
            }

            .related-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .specs-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .product-title {
                font-size: 32px;
            }

            .product-price {
                font-size: 40px;
            }

            .size-grid {
                grid-template-columns: repeat(4, 1fr);
            }

            .action-buttons {
                flex-direction: column;
            }

            .thumbnail-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .features-section {
                grid-template-columns: 1fr;
            }

            .related-grid {
                grid-template-columns: 1fr;
            }

            .sticky-cart {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <!-- TOPBAR -->
    <div class="topbar">
        ⚡ ENVÍO GRATIS EN TODOS LOS PEDIDOS - AUTENTICIDAD GARANTIZADA
    </div>

    <!-- HEADER -->
    <header>
        <a href="index.html" class="logo">
            <div class="logo-icon"></div>
            <span>SNIKER</span>
        </a>
        
        <div class="header-actions">
            <a href="catalog.html" class="back-link">← Volver al catálogo</a>
            <button class="icon-btn">👤</button>
            <button class="icon-btn">❤️</button>
            <button class="icon-btn">🛒</button>
        </div>
    </header>

    <!-- BREADCRUMB -->
    <div class="breadcrumb">
        <a href="index.html">Inicio</a>
        <span>/</span>
        <a href="catalog.html">Catálogo</a>
        <span>/</span>
        <a href="#">Running</a>
        <span>/</span>
        <span>Air Retro Classic</span>
    </div>

    <!-- NOTIFICATION -->
    <div class="notification" id="notification"></div>

    <!-- PRODUCT CONTAINER -->
    <div class="product-container">
        <div class="product-layout">
            <!-- GALLERY SECTION -->
            <div class="gallery-section">
                <div class="main-image" id="mainImage">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Air Retro Classic" id="mainImg">
                    <div class="zoom-badge">🔍 Click para ampliar</div>
                </div>

                <div class="thumbnail-grid">
                    <div class="thumbnail active" onclick="changeImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', this)">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" alt="Vista 1">
                    </div>
                    <div class="thumbnail" onclick="changeImage('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800', this)">
                        <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200" alt="Vista 2">
                    </div>
                    <div class="thumbnail" onclick="changeImage('https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800', this)">
                        <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200" alt="Vista 3">
                    </div>
                    <div class="thumbnail" onclick="changeImage('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', this)">
                        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200" alt="Vista 4">
                    </div>
                </div>
            </div>

            <!-- PRODUCT INFO -->
            <div class="product-info">
                <div class="product-header">
                    <div class="product-badges">
                        <span class="badge new">NEW</span>
                        <span class="badge limited">LIMITED EDITION</span>
                    </div>
                    <button class="favorite-btn-large" onclick="toggleFavoriteLarge(this)">♡</button>
                </div>

                <div class="product-category">Running / Premium Collection</div>
                
                <h1 class="product-title">Air Retro Classic</h1>
                
                <p class="product-subtitle">Estilo urbano con tecnología de última generación. Diseño icónico que combina el pasado con el futuro.</p>

                <div class="rating-section">
                    <div class="stars">★★★★★</div>
                    <span class="rating-text">4.9 (245 reseñas)</span>
                </div>

                <div>
                    <div class="product-price">$129.99</div>
                    <div class="price-info">Precio incluye envío gratis • IVA incluido</div>
                </div>

                <!-- COLOR SELECTOR -->
                <div class="selector-section">
                    <div class="selector-label">Color: Negro/Verde</div>
                    <div class="color-selector">
                        <div class="color-option active" style="background: linear-gradient(135deg, #000, #39ff14);" onclick="selectColor(this, 'Negro/Verde')"></div>
                        <div class="color-option" style="background: linear-gradient(135deg, #fff, #b026ff); border: 2px solid #333;" onclick="selectColor(this, 'Blanco/Morado')"></div>
                        <div class="color-option" style="background: linear-gradient(135deg, #ff0000, #000);" onclick="selectColor(this, 'Rojo/Negro')"></div>
                        <div class="color-option" style="background: linear-gradient(135deg, #0000ff, #fff);" onclick="selectColor(this, 'Azul/Blanco')"></div>
                    </div>
                </div>

                <!-- SIZE SELECTOR -->
                <div class="selector-section">
                    <div class="selector-label">Talla (US)</div>
                    <div class="size-grid">
                        <div class="size-option" onclick="selectSize(this, '38')">38</div>
                        <div class="size-option" onclick="selectSize(this, '39')">39</div>
                        <div class="size-option" onclick="selectSize(this, '40')">40</div>
                        <div class="size-option" onclick="selectSize(this, '41')">41</div>
                        <div class="size-option" onclick="selectSize(this, '42')">42</div>
                        <div class="size-option unavailable" onclick="selectSize(this, '43')">43</div>
                        <div class="size-option" onclick="selectSize(this, '44')">44</div>
                        <div class="size-option" onclick="selectSize(this, '45')">45</div>
                        <div class="size-option unavailable" onclick="selectSize(this, '46')">46</div>
                        <div class="size-option" onclick="selectSize(this, '47')">47</div>
                    </div>
                    <a href="#" class="size-guide-link">📏 Guía de tallas</a>
                </div>

                <!-- QUANTITY -->
                <div class="selector-section">
                    <div class="selector-label">Cantidad</div>
                    <div class="quantity-selector">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateQuantity(-1)">−</button>
                            <span class="qty-value" id="quantity">1</span>
                            <button class="qty-btn" onclick="updateQuantity(1)">+</button>
                        </div>
                        <span style="color: var(--success-green); font-size: 14px;">✓ En stock (24 unidades)</span>
                    </div>
                </div>

                <!-- ACTION BUTTONS -->
                <div class="action-buttons">
                    <button class="btn-add-cart" onclick="addToCart()">🛒 Agregar al Carrito</button>
                    <button class="btn-buy-now" onclick="buyNow()">Comprar Ahora</button>
                </div>

                <!-- FEATURES -->
                <div class="features-section">
                    <div class="feature-item">
                        <span class="feature-icon">🚚</span>
                        <div>
                            <strong>Envío Gratis</strong>
                            <div class="feature-text">Entrega en 1-2 días hábiles</div>
                        </div>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🛡️</span>
                        <div>
                            <strong>100% Auténtico</strong>
                            <div class="feature-text">Certificado de autenticidad</div>
                        </div>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🔄</span>
                        <div>
                            <strong>Cambios Fáciles</strong>
                            <div class="feature-text">30 días para devoluciones</div>
                        </div>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🔒</span>
                        <div>
                            <strong>Pago Seguro</strong>
                            <div class="feature-text">Protección de compra</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TABS SECTION -->
        <div class="tabs-section">
            <div class="tabs-nav">
                <button class="tab-btn active" onclick="switchTab('description')">Descripción</button>
                <button class="tab-btn" onclick="switchTab('specs')">Especificaciones</button>
                <button class="tab-btn" onclick="switchTab('reviews')">Reseñas (245)</button>
                <button class="tab-btn" onclick="switchTab('care')">Cuidado</button>
            </div>

            <!-- DESCRIPTION TAB -->
            <div class="tab-content active" id="description-tab">
                <div class="description-content">
                    <h3>Sobre este producto</h3>
                    <p>
                        El <strong>Air Retro Classic</strong> combina la estética nostálgica de los 90s con la tecnología más avanzada del calzado deportivo moderno. 
                        Diseñado para quienes buscan destacar con estilo urbano sin comprometer el rendimiento.
                    </p>
                    <p>
                        Cuenta con una parte superior de malla transpirable combinada con refuerzos sintéticos de alta calidad que proporcionan soporte 
                        y durabilidad. La unidad Air-Sole encapsulada en el talón ofrece amortiguación ligera y responsiva con cada paso.
                    </p>
                    <h3 style="margin-top: 30px;">Características Destacadas</h3>
                    <p>
                        • Parte superior de malla premium con overlays sintéticos<br>
                        • Unidad Air-Sole visible en el talón para máxima amortiguación<br>
                        • Suela de goma con patrón de tracción multidireccional<br>
                        • Detalles reflectantes para mayor visibilidad<br>
                        • Diseño inspirado en el heritage del running de los 90s<br>
                        • Sistema de ajuste con cordones tradicionales<br>
                        • Lengüeta y collar acolchados para mayor comodidad
                    </p>
                </div>
            </div>

            <!-- SPECS TAB -->
            <div class="tab-content" id="specs-tab">
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-label">Código de producto</div>
                        <div class="spec-value">SNKR-ARC-2025-001</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Categoría</div>
                        <div class="spec-value">Running / Lifestyle</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Material superior</div>
                        <div class="spec-value">Malla + Sintético</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Material suela</div>
                        <div class="spec-value">Goma de alta tracción</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Tecnología</div>
                        <div class="spec-value">Air-Sole Cushioning</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Peso</div>
                        <div class="spec-value">320g (talla 42)</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">País de origen</div>
                        <div class="spec-value">Vietnam</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Colección</div>
                        <div class="spec-value">Premium 2025</div>
                    </div>
                </div>
            </div>

            <!-- REVIEWS TAB -->
            <div class="tab-content" id="reviews-tab">
                <div class="reviews-summary">
                    <div class="average-rating">4.9</div>
                    <div class="rating-stars-large">★★★★★</div>
                    <p style="color: var(--text-gray);">Basado en 245 reseñas verificadas</p>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">C</div>
                            <div>
                                <div class="reviewer-name">Carlos Méndez</div>
                                <div class="review-date">Hace 2 días</div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                    </div>
                    <p class="review-text">
                        ¡Increíbles! La calidad es excepcional y el diseño es exactamente lo que buscaba. 
                        Son muy cómodos y lucen geniales con cualquier outfit. La entrega fue rápida y el empaque impecable. 
                        Definitivamente volveré a comprar aquí.
                    </p>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">M</div>
                            <div>
                                <div class="reviewer-name">María García</div>
                                <div class="review-date">Hace 1 semana</div>
                            </div>
                        </div>
                        <div class="stars">★★★★★</div>
                    </div>
                    <p class="review-text">
                        Perfectos para el día a día. La amortiguación es excelente y no me canso ni después de caminar todo el día. 
                        El color verde neón es espectacular en persona. Muy contenta con la compra.
                    </p>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">J</div>
                            <div>
                                <div class="reviewer-name">Jorge Ramírez</div>
                                <div class="review-date">Hace 2 semanas</div>
                            </div>
                        </div>
                        <div class="stars">★★★★☆</div>
                    </div>
                    <p class="review-text">
                        Excelente calidad y diseño. Le doy 4 estrellas porque me hubiera gustado que vinieran con plantillas extra. 
                        Por lo demás, son perfectos y muy cómodos.
                    </p>
                </div>
            </div>

            <!-- CARE TAB -->
            <div class="tab-content" id="care-tab">
                <div class="description-content">
                    <h3>Cuidado y Mantenimiento</h3>
                    <p>
                        Para mantener tus sneakers en las mejores condiciones, sigue estas recomendaciones:
                    </p>
                    <p>
                        <strong>Limpieza Regular:</strong><br>
                        • Limpia con un paño húmedo suave después de cada uso<br>
                        • Usa un cepillo de cerdas suaves para manchas difíciles<br>
                        • Evita sumergir completamente en agua<br>
                        • No uses lejía ni productos químicos agresivos
                    </p>
                    <p>
                        <strong>Secado:</strong><br>
                        • Seca al aire libre en un lugar ventilado<br>
                        • Evita la luz solar directa prolongada<br>
                        • No uses secadora ni fuentes de calor directo<br>
                        • Rellena con papel para mantener la forma
                    </p>
                    <p>
                        <strong>Almacenamiento:</strong><br>
                        • Guarda en un lugar fresco y seco<br>
                        • Mantén alejado de fuentes de calor<br>
                        • Usa bolsas de tela para evitar polvo<br>
                        • Guarda las cajas originales para protección extra
                    </p>
                </div>
            </div>
        </div>

        <!-- RELATED PRODUCTS -->
        <div class="related-section">
            <h2 class="section-title">También te puede interesar</h2>
            <div class="related-grid">
                <div class="related-product">
                    <div class="related-image">
                        <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400" alt="Urban Street Pro">
                    </div>
                    <div class="related-info">
                        <h3 class="related-name">Urban Street Pro</h3>
                        <div class="related-price">$89.99</div>
                    </div>
                </div>

                <div class="related-product">
                    <div class="related-image">
                        <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400" alt="Neon Boost">
                    </div>
                    <div class="related-info">
                        <h3 class="related-name">Neon Boost Limited</h3>
                        <div class="related-price">$149.99</div>
                    </div>
                </div>

                <div class="related-product">
                    <div class="related-image">
                        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" alt="Classic Runner">
                    </div>
                    <div class="related-info">
                        <h3 class="related-name">Classic Runner</h3>
                        <div class="related-price">$99.99</div>
                    </div>
                </div>

                <div class="related-product">
                    <div class="related-image">
                        <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400" alt="Street Edition">
                    </div>
                    <div class="related-info">
                        <h3 class="related-name">Street Edition</h3>
                        <div class="related-price">$119.99</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- STICKY ADD TO CART -->
    <div class="sticky-cart" id="stickyCart">
        <div class="sticky-product-info">
            <div class="sticky-image">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" alt="Air Retro Classic">
            </div>
            <div class="sticky-details">
                <h4>Air Retro Classic</h4>
                <div class="sticky-price">$129.99</div>
            </div>
        </div>
        <button class="btn-add-cart" onclick="addToCart()" style="flex: none; padding: 15px 40px;">
            Agregar al Carrito
        </button>
    </div>

    <!-- FOOTER -->
    <footer>
        <p>© 2025 SNIKER. All rights reserved. | 🛡️ Authentic Sneakers | 100% Verified Products</p>
    </footer>

    <script>
        let selectedColor = 'Negro/Verde';
        let selectedSize = null;
        let quantity = 1;

        // CHANGE IMAGE
        function changeImage(url, element) {
            document.getElementById('mainImg').src = url;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            element.classList.add('active');
        }

        // SELECT COLOR
        function selectColor(element, colorName) {
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
            element.classList.add('active');
            selectedColor = colorName;
            document.querySelector('.selector-label').textContent = `Color: ${colorName}`;
        }

        // SELECT SIZE
        function selectSize(element, size) {
            if (element.classList.contains('unavailable')) {
                showNotification('⚠️ Esta talla no está disponible', 'warning');
                return;
            }
            document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
            element.classList.add('active');
            selectedSize = size;
        }

        // UPDATE QUANTITY
        function updateQuantity(change) {
            const newQty = quantity + change;
            if (newQty < 1 || newQty > 10) return;
            quantity = newQty;
            document.getElementById('quantity').textContent = quantity;
        }

        // TOGGLE FAVORITE
        function toggleFavoriteLarge(button) {
            button.classList.toggle('active');
            button.textContent = button.classList.contains('active') ? '♥' : '♡';
            const message = button.classList.contains('active') ? 
                '❤️ Agregado a favoritos' : '💔 Removido de favoritos';
            showNotification(message);
        }

        // ADD TO CART
        function addToCart() {
            if (!selectedSize) {
                showNotification('⚠️ Por favor selecciona una talla', 'warning');
                return;
            }

            const product = {
                name: 'Air Retro Classic',
                color: selectedColor,
                size: selectedSize,
                quantity: quantity,
                price: 129.99
            };

            console.log('Agregado al carrito:', product);
            showNotification(`✓ Agregado al carrito: ${quantity}x Air Retro Classic (Talla ${selectedSize})`);
        }

        // BUY NOW
        function buyNow() {
            if (!selectedSize) {
                showNotification('⚠️ Por favor selecciona una talla', 'warning');
                return;
            }

            showNotification('🚀 Redirigiendo al checkout...');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1500);
        }

        // SWITCH TAB
        function switchTab(tabName) {
            // Remove active from all tabs
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active to selected tab
            event.target.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        }

        // SHOW NOTIFICATION
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            
            if (type === 'warning') {
                notification.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';
            } else {
                notification.style.background = 'linear-gradient(135deg, var(--neon-green), #2ecc40)';
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // STICKY CART ON SCROLL
        window.addEventListener('scroll', () => {
            const stickyCart = document.getElementById('stickyCart');
            const productInfo = document.querySelector('.product-info');
            
            if (productInfo) {
                const rect = productInfo.getBoundingClientRect();
                if (rect.bottom < 0) {
                    stickyCart.classList.add('show');
                } else {
                    stickyCart.classList.remove('show');
                }
            }
        });

        // IMAGE ZOOM
        document.getElementById('mainImage').addEventListener('click', function() {
            const img = document.getElementById('mainImg');
            if (img.style.transform === 'scale(2)') {
                img.style.transform = 'scale(1)';
                img.style.cursor = 'zoom-in';
            } else {
                img.style.transform = 'scale(2)';
                img.style.cursor = 'zoom-out';
            }
        });

        // KEYBOARD SHORTCUTS
        document.addEventListener('keydown', function(e) {
            // ESC to close zoom
            if (e.key === 'Escape') {
                document.getElementById('mainImg').style.transform = 'scale(1)';
            }
            
            // A to add to cart
            if (e.key === 'a' || e.key === 'A') {
                addToCart();
            }
        });

        console.log(`
        ⌨️ ATAJOS DE TECLADO:
        - A: Agregar al carrito
        - ESC: Cerrar zoom de imagen
        `);
    </script>
</body>
</html>