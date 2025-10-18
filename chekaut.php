<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Finaliza tu compra en SNIKER - Checkout seguro y rápido">
    <title>SNIKER - Checkout</title>
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

        .secure-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--success-green);
            font-weight: 600;
            font-size: 14px;
        }

        /* PROGRESS BAR */
        .progress-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 5%;
        }

        .progress-steps {
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-bottom: 60px;
        }

        .progress-steps::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.1);
            z-index: 0;
        }

        .progress-line {
            position: absolute;
            top: 20px;
            left: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--neon-green), var(--neon-purple));
            z-index: 1;
            transition: width 0.5s ease;
        }

        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            position: relative;
            z-index: 2;
            flex: 1;
        }

        .step-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--dark-card);
            border: 3px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
            transition: all 0.3s;
        }

        .step.completed .step-circle {
            background: var(--neon-green);
            border-color: var(--neon-green);
            color: var(--dark-bg);
        }

        .step.active .step-circle {
            background: var(--neon-purple);
            border-color: var(--neon-purple);
            color: white;
            box-shadow: 0 0 20px var(--neon-purple);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .step-label {
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-gray);
        }

        .step.active .step-label,
        .step.completed .step-label {
            color: var(--neon-green);
        }

        /* MAIN CONTAINER */
        .checkout-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 5% 100px;
        }

        .checkout-layout {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 40px;
        }

        /* FORMS */
        .checkout-section {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 40px;
            border: 2px solid rgba(57, 255, 20, 0.2);
            display: none;
        }

        .checkout-section.active {
            display: block;
            animation: fadeIn 0.5s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .section-title {
            font-size: 28px;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 30px;
            color: var(--neon-green);
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .section-icon {
            font-size: 32px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            margin-bottom: 10px;
            color: var(--text-white);
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .required {
            color: var(--neon-purple);
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 15px 20px;
            background-color: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 12px;
            color: var(--text-white);
            font-size: 15px;
            outline: none;
            transition: all 0.3s;
        }

        input:focus,
        select:focus,
        textarea:focus {
            border-color: var(--neon-green);
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
            background-color: rgba(255, 255, 255, 0.08);
        }

        input.error {
            border-color: var(--error-red);
        }

        input.success {
            border-color: var(--success-green);
        }

        select {
            cursor: pointer;
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .error-message {
            color: var(--error-red);
            font-size: 12px;
            margin-top: 8px;
            display: none;
        }

        .error-message.show {
            display: block;
        }

        /* SAVED ADDRESSES */
        .saved-addresses {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .address-card {
            background-color: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }

        .address-card:hover {
            border-color: var(--neon-green);
            transform: translateY(-5px);
        }

        .address-card.selected {
            border-color: var(--neon-purple);
            background-color: rgba(176, 38, 255, 0.1);
        }

        .address-card.selected::after {
            content: '✓';
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--neon-purple);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }

        .address-type {
            font-weight: 700;
            color: var(--neon-green);
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 13px;
        }

        .address-details {
            font-size: 14px;
            color: var(--text-gray);
            line-height: 1.8;
        }

        /* SHIPPING OPTIONS */
        .shipping-options {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .shipping-option {
            background-color: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 12px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .shipping-option:hover {
            border-color: var(--neon-green);
            transform: translateX(5px);
        }

        .shipping-option.selected {
            border-color: var(--neon-purple);
            background-color: rgba(176, 38, 255, 0.1);
        }

        .shipping-info h4 {
            font-size: 18px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .shipping-info p {
            color: var(--text-gray);
            font-size: 14px;
        }

        .shipping-price {
            font-size: 24px;
            font-weight: 900;
            color: var(--neon-green);
        }

        .shipping-price.free {
            color: var(--success-green);
        }

        /* PAYMENT METHODS */
        .payment-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .payment-method {
            background-color: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 12px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }

        .payment-method:hover {
            border-color: var(--neon-green);
            transform: translateY(-5px);
        }

        .payment-method.selected {
            border-color: var(--neon-purple);
            background-color: rgba(176, 38, 255, 0.1);
        }

        .payment-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .payment-name {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 14px;
        }

        /* CARD FORM */
        .card-form {
            display: none;
            margin-top: 30px;
        }

        .card-form.show {
            display: block;
            animation: fadeIn 0.5s;
        }

        .card-preview {
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .card-preview::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
        }

        .card-number {
            font-size: 24px;
            letter-spacing: 4px;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .card-info {
            display: flex;
            justify-content: space-between;
        }

        .card-holder,
        .card-expiry {
            font-size: 14px;
        }

        /* NAVIGATION BUTTONS */
        .form-navigation {
            display: flex;
            gap: 20px;
            margin-top: 40px;
        }

        .btn-back,
        .btn-next {
            flex: 1;
            padding: 18px;
            border-radius: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            font-size: 16px;
        }

        .btn-back {
            background: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
        }

        .btn-back:hover {
            background-color: rgba(57, 255, 20, 0.1);
        }

        .btn-next {
            background: linear-gradient(135deg, var(--neon-purple), #8b1fb1);
            color: white;
        }

        .btn-next:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(176, 38, 255, 0.6);
        }

        .btn-next:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* ORDER SUMMARY */
        .order-summary {
            background-color: var(--dark-card);
            border-radius: 20px;
            padding: 30px;
            border: 2px solid rgba(176, 38, 255, 0.3);
            height: fit-content;
            position: sticky;
            top: 20px;
        }

        .summary-title {
            font-size: 24px;
            text-transform: uppercase;
            margin-bottom: 25px;
            color: var(--neon-purple);
            font-weight: 900;
        }

        .summary-items {
            margin-bottom: 25px;
        }

        .summary-item {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(57, 255, 20, 0.1);
        }

        .summary-item:last-child {
            border-bottom: none;
        }

        .summary-item-image {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 8px;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .summary-item-image img {
            width: 100%;
        }

        .summary-item-details {
            flex: 1;
        }

        .summary-item-name {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .summary-item-meta {
            font-size: 12px;
            color: var(--text-gray);
        }

        .summary-item-price {
            font-weight: 700;
            color: var(--neon-green);
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
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 20px;
        }

        .summary-total .summary-value {
            color: var(--neon-green);
        }

        /* SUCCESS MESSAGE */
        .success-screen {
            display: none;
            text-align: center;
            padding: 80px 40px;
            background-color: var(--dark-card);
            border-radius: 20px;
            border: 2px solid var(--success-green);
        }

        .success-screen.show {
            display: block;
            animation: fadeIn 0.5s;
        }

        .success-icon {
            font-size: 100px;
            margin-bottom: 30px;
            animation: bounce 1s;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        .success-screen h2 {
            font-size: 42px;
            margin-bottom: 20px;
            text-transform: uppercase;
            color: var(--success-green);
        }

        .success-screen p {
            font-size: 18px;
            color: var(--text-gray);
            margin-bottom: 15px;
        }

        .order-number {
            font-size: 24px;
            font-weight: 700;
            color: var(--neon-purple);
            margin: 30px 0;
        }

        .success-actions {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 40px;
        }

        .success-btn {
            padding: 18px 40px;
            border-radius: 30px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            font-size: 16px;
            text-decoration: none;
            display: inline-block;
        }

        .success-btn.primary {
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
        }

        .success-btn.secondary {
            background: transparent;
            border: 2px solid var(--neon-green);
            color: var(--neon-green);
        }

        .success-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(57, 255, 20, 0.4);
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
            .checkout-layout {
                grid-template-columns: 1fr;
            }

            .order-summary {
                position: relative;
                top: 0;
                order: -1;
            }

            .form-row {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .progress-steps {
                padding: 0 20px;
            }

            .step-label {
                font-size: 11px;
            }

            .checkout-section {
                padding: 25px;
            }

            .section-title {
                font-size: 22px;
            }

            .payment-methods {
                grid-template-columns: 1fr;
            }

            .form-navigation {
                flex-direction: column;
            }

            .success-actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <!-- TOPBAR -->
    <div class="topbar">
        🔒 CHECKOUT SEGURO - TUS DATOS ESTÁN PROTEGIDOS
    </div>

    <!-- HEADER -->
    <header>
        <a href="index.html" class="logo">
            <div class="logo-icon"></div>
            <span>SNIKER</span>
        </a>
        
        <div class="secure-badge">
            <span>🛡️</span>
            <span>Compra 100% Segura</span>
        </div>
    </header>

    <!-- PROGRESS BAR -->
    <div class="progress-container">
        <div class="progress-steps">
            <div class="progress-line" id="progressLine" style="width: 0%"></div>
            
            <div class="step completed" data-step="1">
                <div class="step-circle">✓</div>
                <div class="step-label">Carrito</div>
            </div>
            
            <div class="step active" data-step="2">
                <div class="step-circle">2</div>
                <div class="step-label">Datos</div>
            </div>
            
            <div class="step" data-step="3">
                <div class="step-circle">3</div>
                <div class="step-label">Envío</div>
            </div>
            
            <div class="step" data-step="4">
                <div class="step-circle">4</div>
                <div class="step-label">Pago</div>
            </div>
        </div>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="checkout-container">
        <div class="checkout-layout">
            <!-- LEFT COLUMN - FORMS -->
            <div>
                <!-- STEP 1: PERSONAL INFO -->
                <div class="checkout-section active" id="step-personal">
                    <h2 class="section-title">
                        <span class="section-icon">👤</span>
                        Información Personal
                    </h2>

                    <form id="personalForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">Nombre <span class="required">*</span></label>
                                <input type="text" id="firstName" required>
                                <div class="error-message" id="firstName-error"></div>
                            </div>

                            <div class="form-group">
                                <label for="lastName">Apellido <span class="required">*</span></label>
                                <input type="text" id="lastName" required>
                                <div class="error-message" id="lastName-error"></div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email <span class="required">*</span></label>
                                <input type="email" id="email" required>
                                <div class="error-message" id="email-error"></div>
                            </div>

                            <div class="form-group">
                                <label for="phone">Teléfono <span class="required">*</span></label>
                                <input type="tel" id="phone" required>
                                <div class="error-message" id="phone-error"></div>
                            </div>
                        </div>

                        <div class="form-navigation">
                            <button type="button" class="btn-next" onclick="nextStep(2)">Continuar →</button>
                        </div>
                    </form>
                </div>

                <!-- STEP 2: SHIPPING ADDRESS -->
                <div class="checkout-section" id="step-shipping">
                    <h2 class="section-title">
                        <span class="section-icon">📍</span>
                        Dirección de Envío
                    </h2>

                    <div class="saved-addresses">
                        <div class="address-card" onclick="selectAddress(1)">
                            <div class="address-type">🏠 Casa</div>
                            <div class="address-details">
                                Calle Principal 123<br>
                                Soacha, Cundinamarca<br>
                                Colombia - 25001
                            </div>
                        </div>

                        <div class="address-card" onclick="selectAddress(2)">
                            <div class="address-type">🏢 Oficina</div>
                            <div class="address-details">
                                Av. Empresarial 456<br>
                                Bogotá, Cundinamarca<br>
                                Colombia - 11001
                            </div>
                        </div>
                    </div>

                    <h3 style="margin-bottom: 20px; color: var(--neon-green);">O ingresa una nueva dirección</h3>

                    <form id="shippingForm">
                        <div class="form-group full-width">
                            <label for="address">Dirección <span class="required">*</span></label>
                            <input type="text" id="address" placeholder="Calle, número">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">Ciudad <span class="required">*</span></label>
                                <input type="text" id="city">
                            </div>

                            <div class="form-group">
                                <label for="state">Departamento <span class="required">*</span></label>
                                <input type="text" id="state">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="zipCode">Código Postal <span class="required">*</span></label>
                                <input type="text" id="zipCode">
                            </div>

                            <div class="form-group">
                                <label for="country">País <span class="required">*</span></label>
                                <select id="country">
                                    <option value="CO">Colombia</option>
                                    <option value="MX">México</option>
                                    <option value="AR">Argentina</option>
                                    <option value="CL">Chile</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group full-width">
                            <label for="notes">Notas de entrega (opcional)</label>
                            <textarea id="notes" placeholder="Apartamento, piso, referencias..."></textarea>
                        </div>

                        <div class="form-navigation">
                            <button type="button" class="btn-back" onclick="prevStep(1)">← Atrás</button>
                            <button type="button" class="btn-next" onclick="nextStep(3)">Continuar →</button>
                        </div>
                    </form>
                </div>

                <!-- STEP 3: SHIPPING METHOD -->
                <div class="checkout-section" id="step-method">
                    <h2 class="section-title">
                        <span class="section-icon">🚚</span>
                        Método de Envío
                    </h2>

                    <div class="shipping-options">
                        <div class="shipping-option selected" onclick="selectShipping(1)">
                            <div class="shipping-info">
                                <h4>⚡ Envío Express</h4>
                                <p>Recíbelo en 1-2 días hábiles</p>
                            </div>
                            <div class="shipping-price free">GRATIS</div>
                        </div>

                        <div class="shipping-option" onclick="selectShipping(2)">
                            <div class="shipping-info">
                                <h4>📦 Envío Estándar</h4>
                                <p>Recíbelo en 3-5 días hábiles</p>
                            </div>
                            <div class="shipping-price free">GRATIS</div>
                        </div>

                        <div class="shipping-option" onclick="selectShipping(3)">
                            <div class="shipping-info">
                                <h4>🏪 Recoger en Tienda</h4>
                                <p>Disponible en 24 horas</p>
                            </div>
                            <div class="shipping-price free">GRATIS</div>
                        </div>
                    </div>

                    <div class="form-navigation">
                        <button type="button" class="btn-back" onclick="prevStep(2)">← Atrás</button>
                        <button type="button" class="btn-next" onclick="nextStep(4)">Continuar →</button>
                    </div>
                </div>

                <!-- STEP 4: PAYMENT -->
                <div class="checkout-section" id="step-payment">
                    <h2 class="section-title">
                        <span class="section-icon">💳</span>
                        Método de Pago
                    </h2>

                    <div class="payment-methods">
                        <div class="payment-method selected" onclick="selectPayment('card')">
                            <div class="payment-icon">💳</div>
                            <div class="payment-name">Tarjeta de Crédito</div>
                        </div>

                        <div class="payment-method" onclick="selectPayment('debit')">
                            <div class="payment-icon">💰</div>
                            <div class="payment-name">Tarjeta de Débito</div>
                        </div>

                        <div class="payment-method" onclick="selectPayment('paypal')">
                            <div class="payment-icon">🅿️</div>
                            <div class="payment-name">PayPal</div>
                        </div>

                        <div class="payment-method" onclick="selectPayment('cash')">
                            <div class="payment-icon">💵</div>
                            <div class="payment-name">Efectivo</div>
                        </div>
                    </div>

                    <div class="card-form show" id="cardForm">
                        <div class="card-preview">
                            <div class="card-number" id="cardDisplay">**** **** **** ****</div>
                            <div class="card-info">
                                <div class="card-holder">
                                    <div style="font-size: 11px; opacity: 0.7;">TITULAR</div>
                                    <div id="holderDisplay">TU NOMBRE</div>
                                </div>
                                <div class="card-expiry">
                                    <div style="font-size: 11px; opacity: 0.7;">VENCE</div>
                                    <div id="expiryDisplay">MM/AA</div>
                                </div>
                            </div>
                        </div>

                        <form id="paymentForm">
                            <div class="form-group">
                                <label for="cardNumber">Número de Tarjeta <span class="required">*</span></label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                                <div class="error-message" id="cardNumber-error"></div>
                            </div>

                            <div class="form-group">
                                <label for="cardHolder">Titular de la Tarjeta <span class="required">*</span></label>
                                <input type="text" id="cardHolder" placeholder="NOMBRE APELLIDO">
                                <div class="error-message" id="cardHolder-error"></div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cardExpiry">Fecha de Vencimiento <span class="required">*</span></label>
                                    <input type="text" id="cardExpiry" placeholder="MM/AA" maxlength="5">
                                    <div class="error-message" id="cardExpiry-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="cardCVV">CVV <span class="required">*</span></label>
                                    <input type="text" id="cardCVV" placeholder="123" maxlength="4">
                                    <div class="error-message" id="cardCVV-error"></div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="form-navigation">
                        <button type="button" class="btn-back" onclick="prevStep(3)">← Atrás</button>
                        <button type="button" class="btn-next" onclick="completeOrder()">Completar Pedido 🎉</button>
                    </div>
                </div>

                <!-- SUCCESS SCREEN -->
                <div class="success-screen" id="successScreen">
                    <div class="success-icon">✓</div>
                    <h2>¡Pedido Completado!</h2>
                    <p>Tu compra ha sido procesada exitosamente</p>
                    <p>Recibirás un email de confirmación en breve</p>
                    
                    <div class="order-number">
                        Pedido #<span id="orderNumber">SNKR-2025-1234</span>
                    </div>

                    <p style="color: var(--text-gray); margin-top: 20px;">
                        Tiempo estimado de entrega: 1-2 días hábiles
                    </p>

                    <div class="success-actions">
                        <a href="index.html" class="success-btn primary">Volver al Inicio</a>
                        <a href="#" class="success-btn secondary">Ver mi Pedido</a>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN - ORDER SUMMARY -->
            <div class="order-summary">
                <h2 class="summary-title">Resumen del Pedido</h2>

                <div class="summary-items">
                    <div class="summary-item">
                        <div class="summary-item-image">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Sneaker">
                        </div>
                        <div class="summary-item-details">
                            <div class="summary-item-name">Air Retro Classic</div>
                            <div class="summary-item-meta">Talla: 42 | Qty: 1</div>
                        </div>
                        <div class="summary-item-price">$129.99</div>
                    </div>

                    <div class="summary-item">
                        <div class="summary-item-image">
                            <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400" alt="Sneaker">
                        </div>
                        <div class="summary-item-details">
                            <div class="summary-item-name">Urban Street Pro</div>
                            <div class="summary-item-meta">Talla: 40 | Qty: 2</div>
                        </div>
                        <div class="summary-item-price">$179.98</div>
                    </div>

                    <div class="summary-item">
                        <div class="summary-item-image">
                            <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400" alt="Sneaker">
                        </div>
                        <div class="summary-item-details">
                            <div class="summary-item-name">Neon Boost Limited</div>
                            <div class="summary-item-meta">Talla: 43 | Qty: 1</div>
                        </div>
                        <div class="summary-item-price">$149.99</div>
                    </div>
                </div>

                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value">$459.96</span>
                </div>

                <div class="summary-row">
                    <span class="summary-label">Envío</span>
                    <span class="summary-value" style="color: var(--success-green);">GRATIS</span>
                </div>

                <div class="summary-row">
                    <span class="summary-label">Descuento</span>
                    <span class="summary-value">-$0.00</span>
                </div>

                <div class="summary-row">
                    <span class="summary-label">Impuestos</span>
                    <span class="summary-value">$0.00</span>
                </div>

                <div class="summary-divider"></div>

                <div class="summary-total">
                    <span>Total</span>
                    <span class="summary-value">$459.96</span>
                </div>

                <div style="background: rgba(0, 255, 136, 0.1); border: 2px solid var(--success-green); padding: 15px; border-radius: 10px; text-align: center; margin-top: 20px;">
                    <div style="color: var(--success-green); font-weight: 700; margin-bottom: 5px;">¡Ahorras en envío!</div>
                    <div style="font-size: 14px; color: var(--text-gray);">Envío gratis en todos los pedidos</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStep = 1;
        let selectedAddress = null;
        let selectedShipping = 1;
        let selectedPayment = 'card';

        // STEP NAVIGATION
        function nextStep(step) {
            // Validate current step
            if (!validateStep(currentStep)) {
                return;
            }

            // Hide current step
            document.getElementById(`step-${getStepName(currentStep)}`).classList.remove('active');
            
            // Update current step
            currentStep = step;
            
            // Show next step
            document.getElementById(`step-${getStepName(step)}`).classList.add('active');
            
            // Update progress
            updateProgress();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function prevStep(step) {
            document.getElementById(`step-${getStepName(currentStep)}`).classList.remove('active');
            currentStep = step;
            document.getElementById(`step-${getStepName(step)}`).classList.add('active');
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function getStepName(step) {
            const steps = ['', 'personal', 'shipping', 'method', 'payment'];
            return steps[step];
        }

        function updateProgress() {
            // Update step circles
            document.querySelectorAll('.step').forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.remove('active', 'completed');
                
                if (stepNum < currentStep) {
                    step.classList.add('completed');
                    step.querySelector('.step-circle').textContent = '✓';
                } else if (stepNum === currentStep) {
                    step.classList.add('active');
                    step.querySelector('.step-circle').textContent = stepNum;
                } else {
                    step.querySelector('.step-circle').textContent = stepNum;
                }
            });

            // Update progress line
            const progress = ((currentStep - 1) / 3) * 100;
            document.getElementById('progressLine').style.width = progress + '%';
        }

        function validateStep(step) {
            switch(step) {
                case 1:
                    return validatePersonalInfo();
                case 2:
                    return validateShipping();
                case 3:
                    return true; // Shipping method always valid
                case 4:
                    return validatePayment();
                default:
                    return true;
            }
        }

        function validatePersonalInfo() {
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            let isValid = true;

            if (firstName.length < 2) {
                showError('firstName', 'Ingresa tu nombre');
                isValid = false;
            }

            if (lastName.length < 2) {
                showError('lastName', 'Ingresa tu apellido');
                isValid = false;
            }

            if (!validateEmail(email)) {
                showError('email', 'Ingresa un email válido');
                isValid = false;
            }

            if (phone.length < 7) {
                showError('phone', 'Ingresa un teléfono válido');
                isValid = false;
            }

            return isValid;
        }

        function validateShipping() {
            if (selectedAddress) {
                return true;
            }

            const address = document.getElementById('address').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value.trim();
            const zipCode = document.getElementById('zipCode').value.trim();

            if (!address || !city || !state || !zipCode) {
                alert('Por favor completa todos los campos de dirección o selecciona una dirección guardada');
                return false;
            }

            return true;
        }

        function validatePayment() {
            if (selectedPayment !== 'card' && selectedPayment !== 'debit') {
                return true;
            }

            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const cardHolder = document.getElementById('cardHolder').value.trim();
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCVV = document.getElementById('cardCVV').value;

            let isValid = true;

            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                showError('cardNumber', 'Número de tarjeta inválido');
                isValid = false;
            }

            if (cardHolder.length < 3) {
                showError('cardHolder', 'Ingresa el titular de la tarjeta');
                isValid = false;
            }

            if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                showError('cardExpiry', 'Formato: MM/AA');
                isValid = false;
            }

            if (cardCVV.length < 3 || !/^\d+$/.test(cardCVV)) {
                showError('cardCVV', 'CVV inválido');
                isValid = false;
            }

            return isValid;
        }

        function showError(inputId, message) {
            const input = document.getElementById(inputId);
            const errorDiv = document.getElementById(`${inputId}-error`);
            
            input.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // ADDRESS SELECTION
        function selectAddress(id) {
            document.querySelectorAll('.address-card').forEach(card => {
                card.classList.remove('selected');
            });
            event.target.closest('.address-card').classList.add('selected');
            selectedAddress = id;
        }

        // SHIPPING SELECTION
        function selectShipping(id) {
            document.querySelectorAll('.shipping-option').forEach(option => {
                option.classList.remove('selected');
            });
            event.target.closest('.shipping-option').classList.add('selected');
            selectedShipping = id;
        }

        // PAYMENT SELECTION
        function selectPayment(type) {
            document.querySelectorAll('.payment-method').forEach(method => {
                method.classList.remove('selected');
            });
            event.target.closest('.payment-method').classList.add('selected');
            selectedPayment = type;

            // Show/hide card form
            const cardForm = document.getElementById('cardForm');
            if (type === 'card' || type === 'debit') {
                cardForm.classList.add('show');
            } else {
                cardForm.classList.remove('show');
            }
        }

        // CARD PREVIEW
        document.getElementById('cardNumber')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = formattedValue;
            
            document.getElementById('cardDisplay').textContent = 
                formattedValue || '**** **** **** ****';
        });

        document.getElementById('cardHolder')?.addEventListener('input', function(e) {
            document.getElementById('holderDisplay').textContent = 
                e.target.value.toUpperCase() || 'TU NOMBRE';
        });

        document.getElementById('cardExpiry')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            
            document.getElementById('expiryDisplay').textContent = 
                value || 'MM/AA';
        });

        document.getElementById('cardCVV')?.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // COMPLETE ORDER
        function completeOrder() {
            if (!validatePayment()) {
                return;
            }

            // Show loading
            const btn = event.target;
            btn.disabled = true;
            btn.innerHTML = '⏳ Procesando...';

            setTimeout(() => {
                // Hide payment form
                document.getElementById('step-payment').classList.remove('active');
                
                // Show success screen
                document.getElementById('successScreen').classList.add('show');
                
                // Generate order number
                const orderNum = 'SNKR-' + new Date().getFullYear() + '-' + 
                                Math.floor(Math.random() * 10000);
                document.getElementById('orderNumber').textContent = orderNum;
                
                // Update progress to completed
                document.querySelectorAll('.step').forEach(step => {
                    step.classList.remove('active');
                    step.classList.add('completed');
                    step.querySelector('.step-circle').textContent = '✓';
                });
                document.getElementById('progressLine').style.width = '100%';
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Confetti effect (console message)
                console.log('🎉 ¡Pedido completado exitosamente! 🎉');
            }, 2000);
        }

        // CLEAR ERRORS ON INPUT
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorDiv = document.getElementById(`${input.id}-error`);
                if (errorDiv) errorDiv.classList.remove('show');
            });
        });

        // INITIALIZE
        updateProgress();

        // KEYBOARD SHORTCUTS
        document.addEventListener('keydown', function(e) {
            // Enter to continue
            if (e.key === 'Enter' && !e.target.matches('textarea')) {
                e.preventDefault();
                const nextBtn = document.querySelector('.checkout-section.active .btn-next');
                if (nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                }
            }
        });

        // AUTO-FILL FOR TESTING (remove in production)
        console.log(`
        🔧 TESTING MODE:
        
        Card numbers válidos para testing:
        - 4111 1111 1111 1111 (Visa)
        - 5555 5555 5555 4444 (Mastercard)
        
        Presiona Enter para continuar en cada paso
        `);
    </script>
</body>
</html>