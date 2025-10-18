<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Inicia sesión o regístrate en SNIKER para acceder a drops exclusivos y tu perfil.">
    <title>SNIKER - Login & Register</title>
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
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow-x: hidden;
        }

        /* Background animation */
        body::before {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(57, 255, 20, 0.1), transparent 70%);
            transform: translate(-50%, -50%);
            animation: pulse 4s ease-in-out infinite;
            pointer-events: none;
        }

        body::after {
            content: '';
            position: fixed;
            top: 20%;
            right: 10%;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(176, 38, 255, 0.1), transparent 70%);
            animation: pulse 3s ease-in-out infinite reverse;
            pointer-events: none;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }

        /* HEADER */
        header {
            background-color: rgba(10, 10, 15, 0.95);
            padding: 20px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(57, 255, 20, 0.1);
            position: relative;
            z-index: 100;
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
            display: inline-block;
        }

        .back-btn:hover {
            background-color: var(--neon-green);
            color: var(--dark-bg);
            transform: translateX(-5px);
        }

        /* MAIN CONTAINER */
        .auth-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            position: relative;
            z-index: 1;
        }

        .auth-box {
            background-color: var(--dark-card);
            border: 2px solid rgba(57, 255, 20, 0.3);
            border-radius: 25px;
            padding: 50px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        .auth-box::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(135deg, var(--neon-green), var(--neon-purple));
            border-radius: 25px;
            opacity: 0;
            z-index: -1;
            transition: opacity 0.3s;
        }

        .auth-box:hover::before {
            opacity: 0.2;
        }

        /* TABS */
        .auth-tabs {
            display: flex;
            gap: 20px;
            margin-bottom: 40px;
            border-bottom: 2px solid rgba(57, 255, 20, 0.2);
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-gray);
            font-size: 24px;
            font-weight: 700;
            padding: 15px 30px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
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
            background: linear-gradient(90deg, var(--neon-green), var(--neon-purple));
            transition: width 0.3s;
        }

        .tab-btn.active::after {
            width: 100%;
        }

        /* FORM CONTENT */
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

        .form-group {
            margin-bottom: 25px;
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
        input[type="password"] {
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

        input:focus {
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

        .error-message {
            color: var(--error-red);
            font-size: 12px;
            margin-top: 8px;
            display: none;
        }

        .error-message.show {
            display: block;
            animation: shake 0.3s;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        .success-message {
            background-color: rgba(0, 255, 136, 0.1);
            border: 2px solid var(--success-green);
            color: var(--success-green);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }

        .success-message.show {
            display: block;
            animation: fadeIn 0.5s;
        }

        /* CHECKBOX */
        .checkbox-group {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin: 25px 0;
        }

        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: var(--neon-green);
        }

        .checkbox-group label {
            margin: 0;
            font-size: 13px;
            color: var(--text-gray);
            text-transform: none;
            letter-spacing: normal;
            line-height: 1.5;
        }

        .checkbox-group a {
            color: var(--neon-green);
            text-decoration: none;
            transition: color 0.3s;
        }

        .checkbox-group a:hover {
            color: var(--neon-purple);
            text-decoration: underline;
        }

        /* BUTTONS */
        .submit-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--neon-green), #2ecc40);
            color: var(--dark-bg);
            border: none;
            padding: 18px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 10px;
            position: relative;
            overflow: hidden;
        }

        .submit-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .submit-btn:hover::before {
            width: 300px;
            height: 300px;
        }

        .submit-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(57, 255, 20, 0.4);
        }

        .submit-btn:active {
            transform: translateY(0);
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* FORGOT PASSWORD */
        .forgot-password {
            text-align: right;
            margin-top: -15px;
            margin-bottom: 20px;
        }

        .forgot-password a {
            color: var(--neon-purple);
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
        }

        .forgot-password a:hover {
            color: var(--neon-green);
            text-decoration: underline;
        }

        /* DIVIDER */
        .divider {
            display: flex;
            align-items: center;
            margin: 30px 0;
            color: var(--text-gray);
            font-size: 14px;
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(57, 255, 20, 0.2);
        }

        .divider span {
            padding: 0 15px;
        }

        /* SOCIAL LOGIN */
        .social-login {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .social-btn {
            width: 100%;
            padding: 15px;
            border: 2px solid rgba(57, 255, 20, 0.3);
            background-color: transparent;
            color: var(--text-white);
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .social-btn:hover {
            border-color: var(--neon-green);
            background-color: rgba(57, 255, 20, 0.1);
            transform: translateY(-2px);
        }

        /* PASSWORD STRENGTH */
        .password-strength {
            margin-top: 10px;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            display: none;
        }

        .password-strength.show {
            display: block;
        }

        .password-strength-bar {
            height: 100%;
            width: 0;
            transition: all 0.3s;
            border-radius: 2px;
        }

        .strength-weak { width: 33%; background-color: var(--error-red); }
        .strength-medium { width: 66%; background-color: #ffaa00; }
        .strength-strong { width: 100%; background-color: var(--success-green); }

        .password-hint {
            font-size: 11px;
            color: var(--text-gray);
            margin-top: 8px;
        }

        /* FOOTER */
        footer {
            background-color: rgba(0, 0, 0, 0.8);
            padding: 20px 5%;
            text-align: center;
            color: var(--text-gray);
            font-size: 13px;
            border-top: 1px solid rgba(57, 255, 20, 0.1);
            position: relative;
            z-index: 100;
        }

        footer a {
            color: var(--neon-green);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .auth-box {
                padding: 30px 25px;
                margin: 20px;
            }

            .tab-btn {
                font-size: 18px;
                padding: 12px 20px;
            }

            header {
                flex-direction: column;
                gap: 15px;
            }

            .logo {
                font-size: 24px;
            }
        }

        /* Loading spinner */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--text-white);
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- HEADER -->
    <header>
        <a href="index.php" class="logo">
            <div class="logo-icon"></div>
            <span>SNIKER</span>
        </a>
        <a href="index.php" class="back-btn">← Volver al inicio</a>
    </header>

    <!-- MAIN CONTAINER -->
    <div class="auth-container">
        <div class="auth-box">
            <!-- TABS -->
            <div class="auth-tabs">
                <button class="tab-btn active" data-tab="login">Login</button>
                <button class="tab-btn" data-tab="register">Register</button>
            </div>

            <!-- SUCCESS MESSAGE -->
            <div class="success-message" id="successMessage"></div>

            <!-- LOGIN TAB -->
            <div class="tab-content active" id="login-tab">
                <form id="loginForm">
                    <div class="form-group">
                        <label for="login-email">Email <span class="required">*</span></label>
                        <input type="email" id="login-email" name="email" placeholder="tu@email.com" required>
                        <div class="error-message" id="login-email-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="login-password">Contraseña <span class="required">*</span></label>
                        <input type="password" id="login-password" name="password" placeholder="••••••••" required>
                        <div class="error-message" id="login-password-error"></div>
                    </div>

                    <div class="forgot-password">
                        <a href="#" id="forgotPasswordLink">¿Olvidaste tu contraseña?</a>
                    </div>

                    <div class="checkbox-group">
                        <input type="checkbox" id="remember" name="remember">
                        <label for="remember">Recordar mi sesión</label>
                    </div>

                    <button type="submit" class="submit-btn">Iniciar Sesión</button>
                </form>

                <div class="divider">
                    <span>O continúa con</span>
                </div>

                <div class="social-login">
                    <button class="social-btn" id="googleLogin">
                        <span>🔍</span> Continuar con Google
                    </button>
                    <button class="social-btn" id="facebookLogin">
                        <span>f</span> Continuar con Facebook
                    </button>
                </div>
            </div>

            <!-- REGISTER TAB -->
            <div class="tab-content" id="register-tab">
                <form id="registerForm">
                    <div class="form-group">
                        <label for="register-name">Nombre completo <span class="required">*</span></label>
                        <input type="text" id="register-name" name="name" placeholder="Tu nombre" required>
                        <div class="error-message" id="register-name-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="register-email">Email <span class="required">*</span></label>
                        <input type="email" id="register-email" name="email" placeholder="tu@email.com" required>
                        <div class="error-message" id="register-email-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="register-password">Contraseña <span class="required">*</span></label>
                        <input type="password" id="register-password" name="password" placeholder="Mínimo 8 caracteres" required>
                        <div class="password-strength" id="passwordStrength">
                            <div class="password-strength-bar"></div>
                        </div>
                        <div class="password-hint">Usa al menos 8 caracteres con letras, números y símbolos</div>
                        <div class="error-message" id="register-password-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="register-confirm-password">Confirmar contraseña <span class="required">*</span></label>
                        <input type="password" id="register-confirm-password" name="confirm-password" placeholder="Repite tu contraseña" required>
                        <div class="error-message" id="register-confirm-password-error"></div>
                    </div>

                    <div class="checkbox-group">
                        <input type="checkbox" id="accept-terms" name="terms" required>
                        <label for="accept-terms">
                            Acepto los <a href="#">Términos y Condiciones</a> y la <a href="#">Política de Privacidad</a>
                        </label>
                    </div>

                    <div class="checkbox-group">
                        <input type="checkbox" id="newsletter" name="newsletter">
                        <label for="newsletter">
                            Quiero recibir drops exclusivos y ofertas especiales
                        </label>
                    </div>

                    <button type="submit" class="submit-btn">Crear Cuenta</button>
                </form>

                <div class="divider">
                    <span>O regístrate con</span>
                </div>

                <div class="social-login">
                    <button class="social-btn" id="googleRegister">
                        <span>🔍</span> Continuar con Google
                    </button>
                    <button class="social-btn" id="facebookRegister">
                        <span>f</span> Continuar con Facebook
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer>
        <p>© 2025 SNIKER. All rights reserved. | <a href="#">Ayuda</a> | <a href="#">Privacidad</a> | <a href="#">Términos</a></p>
    </footer>

    <script>
        // TAB SWITCHING
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });

        // FORM VALIDATION
        function showError(inputId, message) {
            const input = document.getElementById(inputId);
            const errorDiv = document.getElementById(`${inputId}-error`);
            
            input.classList.add('error');
            input.classList.remove('success');
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }

        function showSuccess(inputId) {
            const input = document.getElementById(inputId);
            const errorDiv = document.getElementById(`${inputId}-error`);
            
            input.classList.remove('error');
            input.classList.add('success');
            errorDiv.classList.remove('show');
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validatePassword(password) {
            return password.length >= 8;
        }

        // PASSWORD STRENGTH
        const registerPassword = document.getElementById('register-password');
        const strengthBar = document.querySelector('.password-strength-bar');
        const strengthContainer = document.getElementById('passwordStrength');

        registerPassword.addEventListener('input', (e) => {
            const password = e.target.value;
            
            if (password.length === 0) {
                strengthContainer.classList.remove('show');
                return;
            }
            
            strengthContainer.classList.add('show');
            strengthBar.className = 'password-strength-bar';
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^a-zA-Z0-9]/.test(password)) strength++;
            
            if (strength <= 2) {
                strengthBar.classList.add('strength-weak');
            } else if (strength === 3) {
                strengthBar.classList.add('strength-medium');
            } else {
                strengthBar.classList.add('strength-strong');
            }
        });

        // LOGIN FORM SUBMIT
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            let isValid = true;
            
            if (!validateEmail(email)) {
                showError('login-email', 'Por favor ingresa un email válido');
                isValid = false;
            } else {
                showSuccess('login-email');
            }
            
            if (!validatePassword(password)) {
                showError('login-password', 'La contraseña debe tener al menos 8 caracteres');
                isValid = false;
            } else {
                showSuccess('login-password');
            }
            
            if (isValid) {
                const submitBtn = loginForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading"></span>';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Iniciar Sesión';
                    
                    const successMsg = document.getElementById('successMessage');
                    successMsg.textContent = `¡Bienvenido de vuelta! Redirigiendo...`;
                    successMsg.classList.add('show');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1500);
            }
        });

        // REGISTER FORM SUBMIT
        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const termsAccepted = document.getElementById('accept-terms').checked;
            let isValid = true;
            
            if (name.trim().length < 2) {
                showError('register-name', 'Por favor ingresa tu nombre completo');
                isValid = false;
            } else {
                showSuccess('register-name');
            }
            
            if (!validateEmail(email)) {
                showError('register-email', 'Por favor ingresa un email válido');
                isValid = false;
            } else {
                showSuccess('register-email');
            }
            
            if (!validatePassword(password)) {
                showError('register-password', 'La contraseña debe tener al menos 8 caracteres');
                isValid = false;
            } else {
                showSuccess('register-password');
            }
            
            if (password !== confirmPassword) {
                showError('register-confirm-password', 'Las contraseñas no coinciden');
                isValid = false;
            } else {
                showSuccess('register-confirm-password');
            }
            
            if (!termsAccepted) {
                alert('Debes aceptar los Términos y Condiciones para continuar');
                isValid = false;
            }
            
            if (isValid) {
                const submitBtn = registerForm.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading"></span>';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Crear Cuenta';
                    
                    const successMsg = document.getElementById('successMessage');
                    successMsg.textContent = `¡Cuenta creada exitosamente, ${name}! Redirigiendo...`;
                    successMsg.classList.add('show');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1500);
            }
        });

        // FORGOT PASSWORD
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt('Ingresa tu email para recuperar tu contraseña:');
            
            if (email && validateEmail(email)) {
                alert(`Se ha enviado un enlace de recuperación a ${email}`);
            } else if (email) {
                alert('Por favor ingresa un email válido');
            }
        });

        // SOCIAL LOGIN
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.textContent.includes('Google') ? 'Google' : 'Facebook';
                alert(`Funcionalidad de login con ${platform} en desarrollo`);
            });
        });

        // CLEAR ERRORS ON INPUT
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const errorDiv = document.getElementById(`${input.id}-error`);
                    if (errorDiv) errorDiv.classList.remove('show');
                }
            });
        });
    </script>
</body>
</html>