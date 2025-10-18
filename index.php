<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="SNIKER - Tenis urbanos exclusivos. Ediciones limitadas, drops únicos y autenticidad garantizada. La nueva generación de sneaker culture.">
    <meta name="keywords" content="tenis, sneakers, urbano, exclusivo, edición limitada, drops, streetwear">
    
    <!-- Open Graph -->
    <meta property="og:title" content="SNIKER - Street Premium Sneakers">
    <meta property="og:description" content="Unleash the future. Old school soul. Tenis exclusivos y ediciones limitadas.">
    <meta property="og:image" content="og-image.jpg">
    <meta property="og:type" content="website">
    
    <title>SNIKER - Street Premium Sneakers</title>
    
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
            overflow-x: hidden;
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
            font-size: 32px;
            font-weight: 900;
            color: var(--neon-green);
            text-shadow: 0 0 20px var(--neon-green);
        }

        .logo-icon {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 35px;
        }

        nav a {
            color: var(--text-white);
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
            transition: all 0.3s;
            position: relative;
        }

        nav a:hover {
            color: var(--neon-green);
        }

        nav a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--neon-green);
            transition: width 0.3s;
        }

        nav a:hover::after {
            width: 100%;
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
            font-weight: bold;
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

        /* HERO SECTION */
        .hero {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            padding: 80px 5%;
            align-items: center;
            min-height: 600px;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(57, 255, 20, 0.1), transparent);
            transform: translate(-50%, -50%);
            pointer-events: none;
        }

        .hero-content {
            z-index: 1;
        }

        .hero h1 {
            font-size: 68px;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 15px;
            text-transform: uppercase;
            background: linear-gradient(135deg, var(--neon-green), var(--text-white));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-subtitle {
            font-size: 20px;
            color: var(--text-gray);
            margin-bottom: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .cta-btn {
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            border: none;
            padding: 18px 40px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 30px;
            cursor: pointer;
            margin-top: 30px;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 30px rgba(57, 255, 20, 0.4);
        }

        .cta-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(57, 255, 20, 0.6);
        }

        .hero-image {
            position: relative;
            z-index: 1;
        }

        .hero-image img {
            width: 100%;
            filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .social-icons {
            display: flex;
            gap: 15px;
            margin-top: 40px;
        }

        .social-icons a {
            width: 45px;
            height: 45px;
            border: 2px solid var(--neon-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--neon-green);
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
        }

        .social-icons a:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
            transform: scale(1.1);
        }

        /* QUICK LINKS */
        .quick-links {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            padding: 0 5%;
            margin-bottom: 80px;
        }

        .quick-card {
            background-color: var(--dark-card);
            border: 2px solid var(--neon-green);
            padding: 40px 30px;
            border-radius: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .quick-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(57, 255, 20, 0.3);
            border-color: var(--neon-purple);
        }

        .quick-card-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .quick-card h3 {
            font-size: 20px;
            margin-bottom: 10px;
            text-transform: uppercase;
            color: var(--neon-green);
        }

        .quick-card p {
            color: var(--text-gray);
            font-size: 14px;
        }

        /* FEATURED COLLECTION */
        .featured-section {
            padding: 80px 5%;
            background: linear-gradient(180deg, var(--dark-bg), var(--dark-card));
        }

        .section-title {
            font-size: 42px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 50px;
            color: var(--text-white);
            position: relative;
            padding-bottom: 20px;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, var(--neon-green), var(--neon-purple));
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }

        .product-card {
            background-color: var(--dark-card);
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.3s;
            border: 2px solid transparent;
            position: relative;
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

        .product-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 280px;
        }

        .product-image img {
            width: 100%;
            max-width: 220px;
            transition: transform 0.3s;
        }

        .product-card:hover .product-image img {
            transform: scale(1.1) rotate(-5deg);
        }

        .product-info {
            padding: 25px;
        }

        .product-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .product-price {
            font-size: 24px;
            font-weight: 900;
            color: var(--neon-green);
            margin-bottom: 15px;
        }

        .product-btn {
            width: 100%;
            background-color: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
            padding: 12px;
            border-radius: 25px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 1px;
        }

        .product-btn:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
        }

        /* TRUST SECTION */
        .trust-section {
            padding: 80px 5%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            text-align: center;
        }

        .trust-item {
            padding: 30px;
        }

        .trust-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        }

        .trust-item h3 {
            font-size: 18px;
            margin-bottom: 10px;
            text-transform: uppercase;
            color: var(--neon-green);
        }

        .trust-item p {
            color: var(--text-gray);
            font-size: 14px;
        }

        /* COMMUNITY SECTION */
        .community-section {
            padding: 80px 5%;
            background-color: var(--dark-card);
        }

        .community-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }

        .community-card {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            border: 3px solid var(--neon-purple);
            aspect-ratio: 1;
            transform: rotate(-2deg);
            transition: all 0.3s;
        }

        .community-card:nth-child(2) {
            transform: rotate(2deg);
        }

        .community-card:hover {
            transform: rotate(0deg) scale(1.05);
            box-shadow: 0 20px 40px rgba(176, 38, 255, 0.4);
        }

        .community-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .community-tag {
            position: absolute;
            bottom: 15px;
            left: 15px;
            background-color: rgba(57, 255, 20, 0.9);
            color: var(--dark-bg);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
        }

        /* NEWSLETTER */
        .newsletter-section {
            padding: 80px 5%;
            text-align: center;
        }

        .newsletter-content {
            max-width: 600px;
            margin: 0 auto;
        }

        .newsletter-content h2 {
            font-size: 36px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .newsletter-content p {
            color: var(--text-gray);
            margin-bottom: 30px;
            font-size: 16px;
        }

        .newsletter-form {
            display: flex;
            gap: 15px;
            max-width: 500px;
            margin: 0 auto;
        }

        .newsletter-form input {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid var(--neon-green);
            background-color: rgba(255, 255, 255, 0.05);
            color: var(--text-white);
            border-radius: 30px;
            outline: none;
            font-size: 15px;
        }

        .newsletter-form button {
            background: linear-gradient(135deg, var(--neon-purple), #8b1fb1);
            color: white;
            border: none;
            padding: 15px 35px;
            border-radius: 30px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .newsletter-form button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(176, 38, 255, 0.5);
        }

        /* FOOTER */
        footer {
            background-color: #000;
            padding: 60px 5% 30px;
            border-top: 2px solid var(--neon-green);
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }

        .footer-section h3 {
            color: var(--neon-green);
            margin-bottom: 20px;
            text-transform: uppercase;
            font-size: 18px;
        }

        .footer-section ul {
            list-style: none;
        }

        .footer-section ul li {
            margin-bottom: 12px;
        }

        .footer-section a {
            color: var(--text-gray);
            text-decoration: none;
            transition: color 0.3s;
            font-size: 14px;
        }

        .footer-section a:hover {
            color: var(--neon-green);
        }

        .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid rgba(57, 255, 20, 0.2);
            color: var(--text-gray);
            font-size: 13px;
        }

        .payment-methods {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .payment-icon {
            width: 50px;
            height: 35px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: var(--text-gray);
            border: 1px solid rgba(57, 255, 20, 0.2);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .hero {
                grid-template-columns: 1fr;
                padding: 40px 5%;
                text-align: center;
            }

            .hero h1 {
                font-size: 42px;
            }

            nav ul {
                display: none;
            }

            .search-box input {
                width: 180px;
            }

            .quick-links {
                grid-template-columns: 1fr;
            }

            .products-grid {
                grid-template-columns: 1fr;
            }

            .newsletter-form {
                flex-direction: column;
            }

            .footer-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- TOPBAR -->
    <div class="topbar">
        ⚡ FREE SHIPPING ON ALL ORDERS
    </div>

    <!-- HEADER -->
    <header>
        <div class="logo">
            <div class="logo-icon"></div>
            <span>SNIKER</span>
        </div>
        
        <nav>
            <ul>
                <li><a href="index.php">HOME</a></li>
                <li><a href="catalogo.php">CATALOGO</a></li>
                <li><a href="#new">NEW DROPS</a></li>
                <li><a href="#collections">COLLECTIONS</a></li>
            </ul>
        </nav>

        <div class="header-actions">
            <div class="search-box">
                <input type="search" placeholder="Search sneakers...">
            </div>
           <a href="loginyregistro.php" class="icon-btn" aria-label="Account">👤</a>
           <a href="loginyregistro.php" class="icon-btn" aria-label="Favorites">❤️</a>
           <a href="carrito.php" class="icon-btn" aria-label="Cart">
                🛒
                <span class="cart-badge">3</span>
    </a>
        </div>
    </header>

    <!-- HERO -->
    <section class="hero">
        <div class="hero-content">
            <div class="hero-subtitle">Limited Edition Drop</div>
            <h1>UNLEASH THE FUTURE. OLD SCHOOL SOUL.</h1>
            <button class="cta-btn">SHOP NEW DROPS</button>
            
            <div class="social-icons">
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
            </div>
        </div>

        <div class="hero-image">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Premium Sneaker">
        </div>
    </section>

    <!-- QUICK LINKS -->
    <section class="quick-links">
        <div class="quick-card">
            <div class="quick-card-icon">📦</div>
            <h3>New Arrivals</h3>
            <p>Latest drops just landed</p>
        </div>
        <div class="quick-card">
            <div class="quick-card-icon">⭐</div>
            <h3>Limited Edition</h3>
            <p>Exclusive releases</p>
        </div>
        <div class="quick-card">
            <div class="quick-card-icon">🔥</div>
            <h3>Retro Collections</h3>
            <p>Classic vibes reimagined</p>
        </div>
    </section>

    <!-- FEATURED COLLECTION -->
    <section class="featured-section">
        <h2 class="section-title">Featured Collection</h2>
        
        <div class="products-grid">
            <div class="product-card">
                <span class="product-badge">NEW</span>
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Sneaker">
                </div>
                <div class="product-info">
                    <h3 class="product-name">New Arrivals</h3>
                    <div class="product-price">$29.99</div>
                    <button class="product-btn">COMPRAR</button>
                </div>
            </div>

            <div class="product-card">
                <span class="product-badge">DROP</span>
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400" alt="Sneaker">
                </div>
                <div class="product-info">
                    <h3 class="product-name">Retro Vibes</h3>
                    <div class="product-price">$9.99</div>
                    <button class="product-btn">COMPRAR</button>
                </div>
            </div>

            <div class="product-card">
                <span class="product-badge limited">LIMITED</span>
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400" alt="Sneaker">
                </div>
                <div class="product-info">
                    <h3 class="product-name">Retro Vibes</h3>
                    <div class="product-price">$7.99</div>
                    <button class="product-btn">COMPRAR</button>
                </div>
            </div>

            <div class="product-card">
                <span class="product-badge">DROP</span>
                <div class="product-image">
                    <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" alt="Sneaker">
                </div>
                <div class="product-info">
                    <h3 class="product-name">Monochrome Pack</h3>
                    <div class="product-price">$19.99</div>
                    <button class="product-btn">COMPRAR</button>
                </div>
            </div>
        </div>
    </section>

    <!-- TRUST SECTION -->
    <section class="trust-section">
        <div class="trust-item">
            <div class="trust-icon">🛡️</div>
            <h3>Authenticity Guaranteed</h3>
            <p>100% productos originales verificados</p>
        </div>
        <div class="trust-item">
            <div class="trust-icon">🚚</div>
            <h3>Fast, Free Shipments</h3>
            <p>Envíos gratis en todos los pedidos</p>
        </div>
        <div class="trust-item">
            <div class="trust-icon">🔄</div>
            <h3>Easy Returns</h3>
            <p>Cambios y devoluciones sin complicaciones</p>
        </div>
        <div class="trust-item">
            <div class="trust-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>Compra segura y protegida</p>
        </div>
    </section>

    <!-- COMMUNITY SPOTLIGHT -->
    <section class="community-section">
        <h2 class="section-title">EXCMUNITY SPOTLIGHT</h2>
        <p style="color: var(--text-gray); font-size: 18px; margin-bottom: 30px;">
            Stay connected with drops & updates
        </p>

        <div class="community-grid">
            <div class="community-card">
                <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500" alt="Community">
                <div class="community-tag">@pedazosstreetwear</div>
            </div>
            <div class="community-card">
                <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500" alt="Community">
                <div class="community-tag">@sneakerlove</div>
            </div>
            <div class="community-card">
                <img src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500" alt="Community">
                <div class="community-tag">@kicksonfeet</div>
            </div>
        </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter-section">
        <div class="newsletter-content">
            <h2>STAY ON THE DROP</h2>
            <p>Suscríbete para recibir drops exclusivos, lanzamientos anticipados y ofertas especiales.</p>
            
            <form class="newsletter-form">
                <input type="email" placeholder="Tu email" required>
                <button type="submit">SUBSCRIBE</button>
            </form>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>SNIKER</h3>
                <p style="color: var(--text-gray); font-size: 14px; line-height: 1.8;">
                    La nueva generación de sneaker culture. Autenticidad, exclusividad y street premium en cada drop.
                </p>
                <div class="social-icons" style="margin-top: 20px;">
                    <a href="#" aria-label="Facebook">f</a>
                    <a href="#" aria-label="Instagram">📷</a>
                    <a href="#" aria-label="Twitter">🐦</a>
                </div>
            </div>

            <div class="footer-section">
                <h3>AYUDA</h3>
                <ul>
                    <li><a href="#">Envíos y entregas</a></li>
                    <li><a href="#">Cambios y devoluciones</a></li>
                    <li><a href="#">Guía de tallas</a></li>
                    <li><a href="#">Formas de pago</a></li>
                    <li><a href="#">Preguntas frecuentes</a></li>
                    <li><a href="#">Contacto</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>SNIKER</h3>
                <ul>
                    <li><a href="#">Acerca de nosotros</a></li>
                    <li><a href="#">Manifiesto</a></li>
                    <li><a href="#">Autenticidad</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Comunidad</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>LEGAL</h3>
                <ul>
                    <li><a href="#">Términos y condiciones</a></li>
                    <li><a href="#">Política de privacidad</a></li>
                    <li><a href="#">Política de cookies</a></li>
                    <li><a href="#">Aviso legal</a></li>
                </ul>

                <h3 style="margin-top: 30px;">MÉTODOS DE PAGO</h3>
                <div class="payment-methods">
                    <div class="payment-icon">VISA</div>
                    <div class="payment-icon">MC</div>
                    <div class="payment-icon">AMEX</div>
                    <div class="payment-icon">PYPL</div>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>© 2025 SNIKER. All rights reserved. | Designed for sneaker lovers.</p>
            <p style="margin-top: 10px; font-size: 11px;">🛡️ Authentic Sneakers | 100% Verified Products</p>
        </div>
    </footer>

    <script>
        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        searchInput.addEventListener('focus', function() {
            this.style.width = '300px';
        });
        searchInput.addEventListener('blur', function() {
            if (!this.value) {
                this.style.width = '250px';
            }
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            alert(`¡Gracias por suscribirte! Te enviaremos los mejores drops a ${email}`);
            this.reset();
        });

        // Product cards animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.product-card, .trust-item, .community-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

        // Cart badge animation
        const cartBtn = document.querySelector('.icon-btn[aria-label="Cart"]');
        cartBtn.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });

        // Header scroll effect
        let lastScroll = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.padding = '15px 5%';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.padding = '20px 5%';
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });

        // Product button interactions
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                const productPrice = this.closest('.product-card').querySelector('.product-price').textContent;
                
                this.textContent = '✓ AGREGADO';
                this.style.backgroundColor = 'var(--neon-green)';
                this.style.color = 'var(--dark-bg)';
                
                // Update cart badge
                const cartBadge = document.querySelector('.cart-badge');
                cartBadge.textContent = parseInt(cartBadge.textContent) + 1;
                
                setTimeout(() => {
                    this.textContent = 'COMPRAR';
                    this.style.backgroundColor = 'transparent';
                    this.style.color = 'var(--neon-green)';
                }, 2000);
            });
        });

        // Quick card navigation
        document.querySelectorAll('.quick-card').forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                console.log(`Navegando a: ${title}`);
                // Aquí irían las redirecciones reales
            });
        });
    </script>
</body>
</html>