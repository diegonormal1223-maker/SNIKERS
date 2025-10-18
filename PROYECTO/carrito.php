<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Carrito de compras SNIKER - Revisa tus productos y procede al checkout.">
    <title>SNIKER - Carrito de Compras</title>
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
            --error-red: #ff3860;
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

        .back-btn {
            background: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
            padding: 10px 25px;
            border-radius: 25px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 1px;
            text-decoration: none;
        }

        .back-btn:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
            transform: translateX(-5px);
        }

        /* MAIN CONTAINER */
        .cart-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 60px 5% 100px;
        }

        .cart-title {
            font-size: 48px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 15px;
            background: linear-gradient(135deg, var(--neon-green), var(--text-white));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .cart-subtitle {
            color: var(--text-gray);
            margin-bottom: 40px;
            font-size: 16px;
        }

        /* PROGRESS BAR */
        .progress-steps {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 60px;
            padding: 30px;
            background-color: var(--dark-card);
            border-radius: 15px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .step {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px 25px;
            border-radius: 10px;
            transition: all 0.3s;
        }

        .step.active {
            background: linear-gradient(135deg, rgba(57, 255, 20, 0.2), rgba(57, 255, 20, 0.05));
            border: 2px solid var(--neon-green);
        }

        .step-number {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
        }

        .step.active .step-number {
            background: var(--neon-green);
            color: var(--dark-bg);
        }

        .step-label {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        /* LAYOUT */
        .cart-layout {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 40px;
        }

        /* CART ITEMS */
        .cart-items {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(57, 255, 20, 0.2);
        }

        .cart-items-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(57, 255, 20, 0.2);
        }

        .cart-items-header h2 {
            font-size: 24px;
            text-transform: uppercase;
            color: var(--neon-green);
        }

        .clear-cart {
            background: transparent;
            border: 2px solid var(--error-red);
            color: var(--error-red);
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 13px;
            text-transform: uppercase;
        }

        .clear-cart:hover {
            background-color: var(--error-red);
            color: white;
        }

        .cart-item {
            display: grid;
            grid-template-columns: 120px 1fr auto;
            gap: 25px;
            padding: 25px;
            margin-bottom: 20px;
            background-color: rgba(255, 255, 255, 0.02);
            border-radius: 15px;
            border: 2px solid transparent;
            transition: all 0.3s;
            position: relative;
        }

        .cart-item:hover {
            border-color: var(--neon-green);
            transform: translateX(5px);
        }

        .item-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 12px;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .item-image img {
            width: 100%;
            max-width: 90px;
        }

        .item-details {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .item-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .item-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }

        .item-meta-item {
            display: flex;
            gap: 5px;
            font-size: 14px;
            color: var(--text-gray);
        }

        .item-meta-label {
            font-weight: 600;
        }

        .item-price {
            font-size: 22px;
            font-weight: 900;
            color: var(--neon-green);
        }

        .item-actions {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
        }

        .remove-item {
            background: transparent;
            border: none;
            color: var(--error-red);
            cursor: pointer;
            font-size: 24px;
            transition: all 0.3s;
            padding: 5px;
        }

        .remove-item:hover {
            transform: scale(1.2);
        }

        .quantity-control {
            display: flex;
            align-items: center;
            gap: 15px;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 8px 15px;
            border-radius: 25px;
            border: 2px solid rgba(57, 255, 20, 0.3);
        }

        .qty-btn {
            background: transparent;
            border: none;
            color: var(--neon-green);
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            width: 30px;
            height: 30px;
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

        .qty-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .qty-value {
            font-weight: 700;
            font-size: 16px;
            min-width: 30px;
            text-align: center;
        }

        /* EMPTY CART */
        .empty-cart {
            text-align: center;
            padding: 80px 40px;
        }

        .empty-cart-icon {
            font-size: 80px;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .empty-cart h3 {
            font-size: 28px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .empty-cart p {
            color: var(--text-gray);
            margin-bottom: 30px;
            font-size: 16px;
        }

        .shop-btn {
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            border: none;
            padding: 15px 40px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-decoration: none;
            display: inline-block;
        }

        .shop-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(57, 255, 20, 0.6);
        }

        /* SUMMARY */
        .cart-summary {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(176, 38, 255, 0.3);
            height: fit-content;
            position: sticky;
            top: 100px;
        }

        .summary-title {
            font-size: 24px;
            text-transform: uppercase;
            margin-bottom: 25px;
            color: var(--neon-purple);
            font-weight: 900;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 15px;
        }

        .summary-label {
            color: var(--text-gray);
        }

        .summary-value {
            font-weight: 700;
        }

        .summary-divider {
            height: 2px;
            background: linear-gradient(90deg, var(--neon-green), var(--neon-purple));
            margin: 25px 0;
        }

        .summary-total {
            display: flex;
            justify-content: space-between;
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 30px;
        }

        .summary-total .summary-value {
            color: var(--neon-green);
        }

        /* COUPON */
        .coupon-section {
            margin-bottom: 30px;
        }

        .coupon-form {
            display: flex;
            gap: 10px;
        }

        .coupon-input {
            flex: 1;
            padding: 12px 15px;
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 10px;
            color: var(--text-white);
            outline: none;
            transition: all 0.3s;
        }

        .coupon-input:focus {
            border-color: var(--neon-green);
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
        }

        .coupon-btn {
            background: transparent;
            border: 2px solid var(--neon-purple);
            color: var(--neon-purple);
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 13px;
        }

        .coupon-btn:hover {
            background-color: var(--neon-purple);
            color: white;
        }

        .coupon-applied {
            display: none;
            align-items: center;
            justify-content: space-between;
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid var(--success-green);
            padding: 12px 15px;
            border-radius: 10px;
            margin-top: 15px;
        }

        .coupon-applied.show {
            display: flex;
        }

        .coupon-code {
            font-weight: 700;
            color: var(--success-green);
        }

        .remove-coupon {
            background: transparent;
            border: none;
            color: var(--error-red);
            cursor: pointer;
            font-size: 18px;
        }

        /* CHECKOUT BUTTON */
        .checkout-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--neon-purple), #8b1fb1);
            color: white;
            border: none;
            padding: 18px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        .checkout-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(176, 38, 255, 0.6);
        }

        .checkout-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* TRUST BADGES */
        .trust-badges {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 25px;
        }

        .trust-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: var(--text-gray);
        }

        .trust-badge-icon {
            font-size: 20px;
        }

        /* SUGGESTED PRODUCTS */
        .suggested-section {
            margin-top: 80px;
            padding: 60px 0;
            border-top: 2px solid rgba(57, 255, 20, 0.2);
        }

        .suggested-title {
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 40px;
            text-align: center;
        }

        .suggested-products {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }

        .suggested-product {
            background-color: var(--dark-card);
            border-radius: 15px;
            padding: 20px;
            border: 2px solid transparent;
            transition: all 0.3s;
            cursor: pointer;
        }

        .suggested-product:hover {
            border-color: var(--neon-green);
            transform: translateY(-5px);
        }

        .suggested-product-image {
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
        }

        .suggested-product-image img {
            width: 100%;
        }

        .suggested-product-name {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .suggested-product-price {
            font-size: 20px;
            font-weight: 900;
            color: var(--neon-green);
        }

        /* FOOTER */
        footer {
            background-color: #000;
            padding: 30px 5%;
            text-align: center;
            color: var(--text-gray);
            font-size: 13px;
            border-top: 2px solid var(--neon-green);
            margin-top: 60px;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
            .cart-layout {
                grid-template-columns: 1fr;
            }

            .cart-summary {
                position: relative;
                top: 0;
            }

            .progress-steps {
                overflow-x: auto;
                justify-content: flex-start;
            }
        }

        @media (max-width: 768px) {
            .cart-title {
                font-size: 32px;
            }

            .cart-item {
                grid-template-columns: 80px 1fr;
                gap: 15px;
            }

            .item-actions {
                grid-column: 1 / -1;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 15px;
            }

            .step-label {
                display: none;
            }

            .suggested-products {
                grid-template-columns: 1fr;
            }
        }

        /* ANIMATIONS */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .cart-item {
            animation: slideIn 0.5s ease-out;
        }

        /* NOTIFICATIONS */
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 700;
            box-shadow: 0 10px 30px rgba(57, 255, 20, 0.5);
            z-index: 2000;
            display: none;
            animation: slideInRight 0.5s;
        }

        .notification.show {
            display: block;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(400px);
            }
            to {
                transform: translateX(0);
            }
        }
    </style>
</head>
<body>
    <!-- TOPBAR -->
    <div class="topbar">
        ⚡ ENVÍO GRATIS EN TODOS LOS PEDIDOS
    </div>

    <!-- HEADER -->
    <header>
        <a href="index.php" class="logo">
            <div class="logo-icon"></div>
            <span>SNIKER</span>
        </a>
        
        <div class="header-actions">
            <a href="index.php" class="back-btn">← Seguir Comprando</a>
        </div>
    </header>

    <!-- NOTIFICATION -->
    <div class="notification" id="notification"></div>

    <!-- MAIN CONTAINER -->
    <div class="cart-container">
        <h1 class="cart-title">Tu Carrito</h1>
        <p class="cart-subtitle">Revisa tus productos antes de proceder al checkout</p>

        <!-- PROGRESS STEPS -->
        <div class="progress-steps">
            <div class="step active">
                <div class="step-number">1</div>
                <div class="step-label">Carrito</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-label">Datos</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-label">Envío</div>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <div class="step-label">Pago</div>
            </div>
        </div>

        <!-- CART LAYOUT -->
        <div class="cart-layout">
            <!-- CART ITEMS -->
            <div class="cart-items">
                <div class="cart-items-header">
                    <h2>Productos (3)</h2>
                    <button class="clear-cart" onclick="clearCart()">Vaciar Carrito</button>
                </div>

                <div id="cartItemsContainer">
                    <!-- Cart Item 1 -->
                    <div class="cart-item" data-id="1">
                        <div class="item-image">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Sneaker">
                        </div>
                        <div class="item-details">
                            <div>
                                <h3 class="item-name">Air Retro Classic</h3>
                                <div class="item-meta">
                                    <div class="item-meta-item">
                                        <span class="item-meta-label">Talla:</span>
                                        <span>42</span>
                                    </div>
                                    <div class="item-meta-item">
                                        <span class="item-meta-label">Color:</span>
                                        <span>Negro/Verde</span>
                                    </div>
                                </div>
                            </div>
                            <div class="item-price">$129.99</div>
                        </div>
                        <div class="item-actions">
                            <button class="remove-item" onclick="removeItem(1)">✕</button>
                            <div class="quantity-control">
                                <button class="qty-btn" onclick="updateQuantity(1, -1)">−</button>
                                <span class="qty-value" id="qty-1">1</span>
                                <button class="qty-btn" onclick="updateQuantity(1, 1)">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Item 2 -->
                    <div class="cart-item" data-id="2">
                        <div class="item-image">
                            <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400" alt="Sneaker">
                        </div>
                        <div class="item-details">
                            <div>
                                <h3 class="item-name">Urban Street Pro</h3>
                                <div class="item-meta">
                                    <div class="item-meta-item">
                                        <span class="item-meta-label">Talla:</span>
                                        <span>40</span>
                                    </div>
                                    <div class="item-meta-item">
                                        <span class="item-meta-label">Color:</span>
                                        <span>Blanco/Morado</span>
                                    </div>
                                </div>
                            </div>
                            <div class="item-price">$89.99</div>
                        </div>
                        <div class="item-actions">
                            <button class="remove-item" onclick="removeItem(2)">✕</button>
                            <div class="quantity-control">
                                <button class="qty-btn" onclick="updateQuantity(2, -1)">−</button>
                                <span class="qty-value" id="qty-2">2</span>
                                <button class="qty-btn" onclick="updateQuantity(2, 1)">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Item 3 -->
                    <div class="cart-item" data-id="3">
                        <div class="item-image">
                            <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400" alt="Sneaker">
                        </div>
                        <div class="item-details">
                            <div>
                                <h3 class="item-name">Neon Boost Limited</h3>
                                <div class="item-meta">
                                    <div class="item-meta-item">
                                        <span class="item-meta-label">Talla:</span>
                                        <span>43</span>
                                    </div>
                                    <div class="item-meta-item">
                                        <span class="item-meta-label">Color:</span>
                                        <span>Negro/Neón</span>
                                    </div>
                                </div>
                            </div>
                            <div class="item-price">$149.99</div>
                        </div>
                        <div class="item-actions">
                            <button class="remove-item" onclick="removeItem(3)">✕</button>
                            <div class="quantity-control">
                                <button class="qty-btn" onclick="updateQuantity(3, -1)">−</button>
                                <span class="qty-value" id="qty-3">1</span>
                                <button class="qty-btn" onclick="updateQuantity(3, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- EMPTY CART STATE (Hidden by default) -->
                <div class="empty-cart" id="emptyCart" style="display: none;">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Descubre nuestras colecciones exclusivas y encuentra tu próximo par favorito</p>
                    <a href="index.html" class="shop-btn">Explorar Productos</a>
                </div>
            </div>

            <!-- CART SUMMARY -->
            <div class="cart-summary">
                <h2 class="summary-title">Resumen</h2>

                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value" id="subtotal">$459.96</span>
                </div>

                <div class="summary-row">
                    <span class="summary-label">Envío</span>
                    <span class="summary-value" style="color: var(--success-green);">GRATIS</span>
                </div>

                <div class="summary-row">
                    <span class="summary-label">Descuento</span>
                    <span class="summary-value" id="discount">$0.00</span>
                </div>

                <div class="summary-divider"></div>

                <div class="summary-total">
                    <span>Total</span>
                    <span class="summary-value" id="total">$459.96</span>
                </div>

                <!-- COUPON -->
                <div class="coupon-section">
                    <form class="coupon-form" id="couponForm">
                        <input type="text" class="coupon-input" placeholder="Código de descuento" id="couponInput">
                        <button type="submit" class="coupon-btn">Aplicar</button>
                    </form>
                    <div class="coupon-applied" id="couponApplied">
                        <span>Cupón: <span class="coupon-code" id="couponCode"></span></span>
                        <button class="remove-coupon" onclick="removeCoupon()">✕</button>
                    </div>
                </div>

                <button class="checkout-btn" id="checkoutBtn" onclick="goToCheckout()">
                    Proceder al Checkout →
                </button>

                <!-- TRUST BADGES -->
                <div class="trust-badges">
                    <div class="trust-badge">
                        <span class="trust-badge-icon">🛡️</span>
                        <span>Compra segura</span>
                    </div>
                    <div class="trust-badge">
                        <span class="trust-badge-icon">🚚</span>
                        <span>Envío gratis</span>
                    </div>
                    <div class="trust-badge">
                        <span class="trust-badge-icon">🔄</span>
                        <span>Cambios fáciles</span>
                    </div>
                    <div class="trust-badge">
                        <span class="trust-badge-icon">✓</span>
                        <span>100% Auténtico</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- SUGGESTED PRODUCTS -->
        <div class="suggested-section">
            <h2 class="suggested-title">Completa tu look</h2>
            <div class="suggested-products">
                <div class="suggested-product">
                    <div class="suggested-product-image">
                        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" alt="Sneaker">
                    </div>
                    <h3 class="suggested-product-name">Classic Runner</h3>
                    <div class="suggested-product-price">$99.99</div>
                </div>

                <div class="suggested-product">
                    <div class="suggested-product-image">
                        <img src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400" alt="Sneaker">
                    </div>
                    <h3 class="suggested-product-name">Street Edition</h3>
                    <div class="suggested-product-price">$119.99</div>
                </div>

                <div class="suggested-product">
                    <div class="suggested-product-image">
                        <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" alt="Sneaker">
                    </div>
                    <h3 class="suggested-product-name">Premium Pack</h3>
                    <div class="suggested-product-price">$139.99</div>
                </div>

                <div class="suggested-product">
                    <div class="suggested-product-image">
                        <img src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400" alt="Sneaker">
                    </div>
                    <h3 class="suggested-product-name">Urban Boost</h3>
                    <div class="suggested-product-price">$109.99</div>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer>
        <p>© 2025 SNIKER. All rights reserved. | 🛡️ Authentic Sneakers | 100% Verified Products</p>
    </footer>

    <script>
        // CART DATA
        let cartItems = {
            1: { name: 'Air Retro Classic', price: 129.99, quantity: 1, size: '42', color: 'Negro/Verde' },
            2: { name: 'Urban Street Pro', price: 89.99, quantity: 2, size: '40', color: 'Blanco/Morado' },
            3: { name: 'Neon Boost Limited', price: 149.99, quantity: 1, size: '43', color: 'Negro/Neón' }
        };

        let discountPercent = 0;
        let appliedCoupon = null;

        // UPDATE QUANTITY
        function updateQuantity(itemId, change) {
            const item = cartItems[itemId];
            if (!item) return;

            const newQuantity = item.quantity + change;
            
            if (newQuantity < 1) {
                removeItem(itemId);
                return;
            }

            if (newQuantity > 10) {
                showNotification('Cantidad máxima: 10 unidades');
                return;
            }

            item.quantity = newQuantity;
            document.getElementById(`qty-${itemId}`).textContent = newQuantity;
            
            updateSummary();
            showNotification('Cantidad actualizada');
        }

        // REMOVE ITEM
        function removeItem(itemId) {
            if (!confirm('¿Eliminar este producto del carrito?')) return;

            const itemElement = document.querySelector(`[data-id="${itemId}"]`);
            itemElement.style.animation = 'slideOut 0.3s';
            
            setTimeout(() => {
                delete cartItems[itemId];
                itemElement.remove();
                updateSummary();
                updateCartCount();
                showNotification('Producto eliminado del carrito');
                
                if (Object.keys(cartItems).length === 0) {
                    showEmptyCart();
                }
            }, 300);
        }

        // CLEAR CART
        function clearCart() {
            if (!confirm('¿Vaciar todo el carrito?')) return;

            cartItems = {};
            document.getElementById('cartItemsContainer').innerHTML = '';
            showEmptyCart();
            updateSummary();
            updateCartCount();
            showNotification('Carrito vaciado');
        }

        // SHOW EMPTY CART
        function showEmptyCart() {
            document.getElementById('emptyCart').style.display = 'block';
            document.querySelector('.cart-items-header').style.display = 'none';
            document.getElementById('checkoutBtn').disabled = true;
        }

        // UPDATE SUMMARY
        function updateSummary() {
            let subtotal = 0;
            let itemCount = 0;

            for (let id in cartItems) {
                const item = cartItems[id];
                subtotal += item.price * item.quantity;
                itemCount += item.quantity;
            }

            const discount = subtotal * (discountPercent / 100);
            const total = subtotal - discount;

            document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}`;
            document.getElementById('discount').textContent = discount > 0 ? `-${discount.toFixed(2)}` : '$0.00';
            document.getElementById('total').textContent = `${total.toFixed(2)}`;
            
            document.querySelector('.cart-items-header h2').textContent = `Productos (${itemCount})`;

            if (discount > 0) {
                document.getElementById('discount').style.color = 'var(--neon-green)';
            }
        }

        // UPDATE CART COUNT
        function updateCartCount() {
            let totalItems = 0;
            for (let id in cartItems) {
                totalItems += cartItems[id].quantity;
            }
            // This would update the header cart badge if it exists
            console.log(`Total items in cart: ${totalItems}`);
        }

        // COUPON SYSTEM
        const validCoupons = {
            'SNIKER10': 10,
            'WELCOME15': 15,
            'EXCLUSIVE20': 20,
            'VIP25': 25
        };

        document.getElementById('couponForm').addEventListener('submit', function(e) {
            e.preventDefault();
            applyCoupon();
        });

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
            
            document.getElementById('couponApplied').classList.remove('show');
            document.getElementById('couponForm').style.display = 'flex';
            document.getElementById('couponInput').value = '';
            
            updateSummary();
            showNotification('Cupón removido');
        }

        // GO TO CHECKOUT
        function goToCheckout() {
            if (Object.keys(cartItems).length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }

            showNotification('Redirigiendo al checkout...');
            
            setTimeout(() => {
                // Here would redirect to checkout page
                console.log('Proceeding to checkout with items:', cartItems);
                alert('Redirigiendo a la página de Checkout...\n\n(Esta funcionalidad se implementaría en la página de checkout)');
            }, 1500);
        }

        // NOTIFICATION SYSTEM
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
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

        // SUGGESTED PRODUCTS INTERACTION
        document.querySelectorAll('.suggested-product').forEach(product => {
            product.addEventListener('click', function() {
                const name = this.querySelector('.suggested-product-name').textContent;
                showNotification(`Agregando ${name} al carrito...`);
                
                setTimeout(() => {
                    showNotification('¡Producto agregado al carrito!');
                }, 1000);
            });
        });

        // KEYBOARD SHORTCUTS
        document.addEventListener('keydown', function(e) {
            // ESC to close notifications
            if (e.key === 'Escape') {
                document.getElementById('notification').classList.remove('show');
            }
            
            // Ctrl/Cmd + Enter to checkout
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                goToCheckout();
            }
        });

        // SAVE CART TO LOCALSTORAGE (commented out as per restrictions, but showing logic)
        /*
        function saveCart() {
            localStorage.setItem('snikerCart', JSON.stringify(cartItems));
        }
        
        function loadCart() {
            const saved = localStorage.getItem('snikerCart');
            if (saved) {
                cartItems = JSON.parse(saved);
                updateSummary();
            }
        }
        
        // Load cart on page load
        window.addEventListener('load', loadCart);
        */

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
        updateSummary();
        updateCartCount();

        // AUTO-SAVE CART (simulation without localStorage)
        setInterval(() => {
            console.log('Auto-saving cart...', cartItems);
        }, 30000);

        // SHOW TIPS
        console.log(`
        🛒 CUPONES VÁLIDOS:
        - SNIKER10 (10% descuento)
        - WELCOME15 (15% descuento)
        - EXCLUSIVE20 (20% descuento)
        - VIP25 (25% descuento)
        
        ⌨️ ATAJOS DE TECLADO:
        - ESC: Cerrar notificaciones
        - Ctrl/Cmd + Enter: Ir al checkout
        `);
    </script>
    <script>
  function goToCheckout() {
    window.location.href = "checkout.php"; // Cambia esto por la URL de tu página destino
  }
</script>
</body>
</html>