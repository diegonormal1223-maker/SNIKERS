
document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // VERIFICAR SESIÓN AL CARGAR
    // ===============================
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.role === 'ADMIN') window.location.href = 'dashboard.html';
                else window.location.href = 'index.html';
            } catch (e) {
                console.error('Error parsing user data', e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    } catch (e) {
        console.error(e);
    }

    // ===============================
    // TABS (login / register)
    // ===============================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons && tabButtons.length) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const target = btn.getAttribute('data-tab');
                const targetEl = document.getElementById(`${target}-tab`);
                if (targetEl) targetEl.classList.add('active');
            });
        });
    }

    // ===============================
    // UTILIDADES ERROR / SUCCESS
    // ===============================
    function setError(id, message) {
        const err = document.getElementById(`${id}-error`);
        const input = document.getElementById(id);
        if (input) input.classList.add('error');
        if (input) input.classList.remove('success');
        if (err) {
            err.textContent = message || '';
            err.classList.add('show');
        }
    }

    function clearError(id) {
        const err = document.getElementById(`${id}-error`);
        const input = document.getElementById(id);
        if (input) input.classList.remove('error');
        if (input) input.classList.add('success');
        if (err) {
            err.textContent = '';
            err.classList.remove('show');
        }
    }

    // ===============================
    // VALIDACIONES
    // ===============================
    function validateName(name) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/;
        return regex.test(String(name).trim());
    }

    function validateCustomEmail(email) {
        // permite empezar con número o letra y formatos comunes
        const regex = /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(String(email).trim());
    }

    function validatePhone(phone) {
        if (!phone) return true; // opcional
        const cleaned = String(phone).trim();

        // Debe tener exactamente 10 dígitos
        if (!/^\d{10}$/.test(cleaned)) return false;

        // Números celulares: deben empezar con 3 (300-350)
        if (cleaned.startsWith('3')) {
            const prefix = cleaned.substring(0, 3);
            const prefixNum = parseInt(prefix);
            // Rango válido de operadores colombianos: 300-350
            return prefixNum >= 300 && prefixNum <= 350;
        }

        // Números fijos: códigos de área válidos
        // Bogotá: 601, Medellín: 604, Cali: 602, Barranquilla: 605, Cartagena: 605, etc.
        const areaCode = cleaned.substring(0, 2);
        const validAreaCodes = ['60', '61', '62', '64', '65', '67', '68'];

        return validAreaCodes.includes(areaCode);
    }

    function isInvalidSequence(num) {
        if (!num) return false;
        if (/^(\d)\1+$/.test(num)) return true;
        const asc = "01234567890123456789";
        if (asc.includes(num)) return true;
        const desc = "98765432109876543210";
        if (desc.includes(num)) return true;
        return false;
    }

    function validatePassword(password) {
        // mínimo 8, una mayúscula, una minúscula, un número y un símbolo
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(String(password));
    }

    // ===============================
    // TOGGLE PASSWORD (ojo)
    // ===============================
    window.togglePassword = function (id, icon) {
        const input = document.getElementById(id);
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.textContent = '🙈';
        } else {
            input.type = 'password';
            if (icon) icon.textContent = '👁';
        }
    };

    //===============================
    // VALIDACIÓN EN VIVO: NOMBRE
    // ===============================
    const nameInput = document.getElementById('register-name');
    if (nameInput) {
        nameInput.addEventListener('input', function () {
            let v = this.value;
            v = v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
            v = v.replace(/\s{2,}/g, ' ');
            this.value = v;
            if (v.trim().length === 0) {
                setError('register-name', 'Escribe tu nombre');
                return;
            }
            if (!validateName(v)) {
                setError('register-name', 'Mínimo dos nombres y sin números');
                return;
            }
            clearError('register-name');
        });
    }

    // ===============================
    // VALIDACIÓN EN VIVO: EMAIL
    // ===============================
    function emailLiveHandler(inputId) {
        const el = document.getElementById(inputId);
        if (!el) return;
        el.addEventListener('input', function () {
            let v = this.value;
            // solo eliminar caracteres inválidos (no borra números)
            v = v.replace(/[^A-Za-z0-9._%+\-@]/g, '');
            // evitar múltiples @
            const atCount = (v.match(/@/g) || []).length;
            if (atCount > 1) v = v.replace(/@+$/, '');
            this.value = v;
            if (v.length === 0) {
                setError(inputId, 'El email no puede estar vacío');
                return;
            }
            if (!v.includes('@')) {
                // aún no terminó de escribir la parte local
                clearError(inputId);
                return;
            }
            if (!validateCustomEmail(v)) {
                setError(inputId, 'Correo no válido');
                return;
            }
            clearError(inputId);
        });
    }

    emailLiveHandler('register-email');
    emailLiveHandler('login-email');

    // ===============================
    // VALIDACIÓN EN VIVO: TELÉFONO
    // ===============================
    const phoneInput = document.getElementById('register-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 10) v = v.slice(0, 10);
            this.value = v;
            if (v.length === 0) {
                // campo opcional -> quitar error
                clearError('register-phone');
                return;
            }
            if (v.length < 10) {
                setError('register-phone', 'Debe tener 10 dígitos');
                return;
            }
            if (isInvalidSequence(v)) {
                setError('register-phone', 'Número inválido');
                return;
            }
            if (!validatePhone(v)) {
                setError('register-phone', 'Número colombiano inválido');
                return;
            }
            clearError('register-phone');
        });
    }

    // ===============================
    // VALIDACIÓN EN VIVO: PASSWORD (login)
    // ===============================
    const loginPassword = document.getElementById('login-password');
    if (loginPassword) {
        loginPassword.addEventListener('input', function () {
            const v = this.value;
            if (v.length === 0) {
                setError('login-password', 'No puede estar vacía');
                return;
            }
            if (!validatePassword(v)) {
                setError('login-password', 'Debe tener mayúscula, minúscula, número y símbolo');
                return;
            }
            clearError('login-password');
        });
    }

    // ===============================
    // VALIDACIÓN EN VIVO: PASSWORD (register) + barra
    // ===============================
    const regPassword = document.getElementById('register-password');
    const regConfirm = document.getElementById('register-confirm-password');
    const passwordStrength = document.querySelector('#passwordStrength .password-strength-bar');

    if (regPassword) {
        regPassword.addEventListener('input', function () {
            const v = this.value;
            // strength bar
            if (passwordStrength) {
                let score = 0;
                if (v.length >= 8) score++;
                if (/[A-Z]/.test(v)) score++;
                if (/[a-z]/.test(v)) score++;
                if (/\d/.test(v)) score++;
                if (/[\W_]/.test(v)) score++;
                if (score <= 2) {
                    passwordStrength.style.width = '33%';
                    passwordStrength.className = 'password-strength-bar strength-weak';
                } else if (score <= 4) {
                    passwordStrength.style.width = '66%';
                    passwordStrength.className = 'password-strength-bar strength-medium';
                } else {
                    passwordStrength.style.width = '100%';
                    passwordStrength.className = 'password-strength-bar strength-strong';
                }
            }

            if (v.length === 0) {
                setError('register-password', 'No puede estar vacía');
                return;
            }
            if (!validatePassword(v)) {
                setError('register-password', 'Debe tener mayúscula, minúscula, número y símbolo');
                return;
            }
            clearError('register-password');

            // si confirm ya tiene texto, revalidar confirmación
            if (regConfirm && regConfirm.value.length > 0) {
                if (v !== regConfirm.value) setError('register-confirm-password', 'No coinciden');
                else clearError('register-confirm-password');
            }
        });
    }

    if (regConfirm) {
        regConfirm.addEventListener('input', function () {
            if (!regPassword) return;
            if (this.value !== regPassword.value) setError('register-confirm-password', 'No coinciden');
            else clearError('register-confirm-password');
        });
    }

    // ===============================
    // SUBMIT: REGISTRO
    // ===============================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = (document.getElementById('register-name') || {}).value || '';
            const email = (document.getElementById('register-email') || {}).value || '';
            const phone = (document.getElementById('register-phone') || {}).value || '';
            const password = (document.getElementById('register-password') || {}).value || '';
            const confirm = (document.getElementById('register-confirm-password') || {}).value || '';
            const terms = document.getElementById('accept-terms');

            let valid = true;

            if (!validateName(name)) {
                setError('register-name', 'Nombre inválido');
                valid = false;
            } else clearError('register-name');

            if (!validateCustomEmail(email)) {
                setError('register-email', 'Email inválido');
                valid = false;
            } else clearError('register-email');

            if (phone && (!validatePhone(phone) || isInvalidSequence(phone))) {
                setError('register-phone', 'Número colombiano inválido');
                valid = false;
            } else clearError('register-phone');

            if (!validatePassword(password)) {
                setError('register-password', 'Contraseña insegura');
                valid = false;
            } else clearError('register-password');

            if (password !== confirm) {
                setError('register-confirm-password', 'No coinciden');
                valid = false;
            } else clearError('register-confirm-password');

            if (terms && !terms.checked) {
                alert('Debes aceptar los términos');
                valid = false;
            }

            if (!valid) return;

            // UI: botón loading
            const btn = registerForm.querySelector('.submit-btn');
            if (btn) {
                btn.disabled = true;
                btn.dataset.orig = btn.textContent;
                btn.innerHTML = '<span class="loading"></span>';
            }

            try {

                const resp = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });

                if (resp.ok) {
                    const success = document.getElementById('successMessage');
                    if (success) {
                        success.textContent = `¡Cuenta creada exitosamente, ${name}!`;
                        success.classList.add('show');
                    }
                    setTimeout(() => {
                        const loginBtn = document.querySelector('[data-tab="login"]');
                        if (loginBtn) loginBtn.click();
                        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.orig || 'Crear Cuenta'; }
                        registerForm.reset();
                        // limpiar barras y errores
                        if (passwordStrength) { passwordStrength.style.width = '0'; passwordStrength.className = 'password-strength-bar'; }
                    }, 1400);
                } else {
                    setError('register-email', 'El email ya está registrado');
                    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.orig || 'Crear Cuenta'; }
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión');
                if (btn) { btn.disabled = false; btn.textContent = btn.dataset.orig || 'Crear Cuenta'; }
            }
        });
    }

    // ===============================
    // SUBMIT: LOGIN
    // ===============================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = (document.getElementById('login-email') || {}).value || '';
            const password = (document.getElementById('login-password') || {}).value || '';

            let valid = true;

            if (!validateCustomEmail(email)) {
                setError('login-email', 'Email inválido');
                valid = false;
            } else clearError('login-email');

            if (!validatePassword(password)) {
                // Limpiar campo por seguridad aunque falle la validación de formato
                const pwdField = document.getElementById('login-password');
                if (pwdField) {
                    pwdField.value = '';
                    pwdField.classList.remove('success');
                }
                setError('login-password', 'Contraseña inválida');
                valid = false;
            } else clearError('login-password');

            if (!valid) return;

            const btn = loginForm.querySelector('.submit-btn');
            if (btn) {
                btn.disabled = true;
                btn.dataset.orig = btn.textContent;
                btn.innerHTML = '<span class="loading"></span>';
            }

            try {
                const resp = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (resp.ok) {
                    const data = await resp.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    const success = document.getElementById('successMessage');
                    if (success) { success.textContent = '¡Bienvenido! Redirigiendo...'; success.classList.add('show'); }
                    setTimeout(() => {
                        window.location.href = (data.user && data.user.role === 'ADMIN') ? 'dashboard.html' : 'index.html';
                    }, 1100);
                } else {
                    // Limpiar contraseña por seguridad y mostrar error
                    const pwdField = document.getElementById('login-password');
                    if (pwdField) {
                        pwdField.value = '';
                        pwdField.classList.remove('success');
                    }
                    setError('login-password', 'Credenciales inválidas');
                    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.orig || 'Iniciar Sesión'; }
                }
            } catch (err) {
                console.error(err);
                setError('login-password', 'Error de conexión');
                if (btn) { btn.disabled = false; btn.textContent = btn.dataset.orig || 'Iniciar Sesión'; }
            }
        });
    }

    // ===============================
    // OLVIDÉ CONTRASEÑA (enlace simple)
    // ===============================
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', (ev) => {
            ev.preventDefault();
            alert('Funcionalidad de recuperación no implementada en demo.');
        });
    }

}); 