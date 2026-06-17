// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Desplazamiento suave para la navegación
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

    // Funcionalidad de búsqueda
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('focus', function () {
            this.style.width = '300px';
        });
        searchInput.addEventListener('blur', function () {
            if (!this.value) {
                this.style.width = '250px';
            }
        });
    }

    // Formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input') ? this.querySelector('input').value : '';
            alert(`¡Gracias por suscribirte! Te enviaremos los mejores drops a ${email}`);
            this.reset();
        });
    }

    // Animación de las tarjetas de producto al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedEls = document.querySelectorAll('.product-card, .trust-item, .community-card');
    if (animatedEls.length) {
        animatedEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    // Animación del botón del carrito
    // La página usa aria-label="Carrito" en la plantilla, también soportamos "Cart"
    const cartBtn = document.querySelector('.icon-btn[aria-label="Carrito"], .icon-btn[aria-label="Cart"]');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Efecto en el header al hacer scroll
    let lastScroll = 0;
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > 100) {
                header.style.padding = '15px 5%';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.padding = '20px 5%';
                header.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }

    // Interacciones del botón de producto
    document.querySelectorAll('.product-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard && productCard.querySelector('.product-name') ? productCard.querySelector('.product-name').textContent : '';
            const productPrice = productCard && productCard.querySelector('.product-price') ? productCard.querySelector('.product-price').textContent : '';

            this.textContent = '✓ AGREGADO';
            this.style.backgroundColor = 'var(--neon-green)';
            this.style.color = 'var(--dark-bg)';

            // Actualizar contador del carrito
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                const current = parseInt(cartBadge.textContent) || 0;
                cartBadge.textContent = current + 1;
            }

            mostrarNotificacion('🛒 Producto agregado al carrito');

            setTimeout(() => {
                this.textContent = 'COMPRAR';
                this.style.backgroundColor = 'transparent';
                this.style.color = 'var(--neon-green)';
            }, 2000);
        });
    });

    // Navegación rápida de tarjetas
    document.querySelectorAll('.quick-card').forEach(card => {
        card.addEventListener('click', function () {
            const title = this.querySelector('h3') ? this.querySelector('h3').textContent : '';
            console.log(`Navegando a: ${title}`);
            // Aquí irían las redirecciones reales
        });
    });

    // MOSTRAR NOTIFICACIÓN
    function mostrarNotificacion(mensaje, tipo = 'exito') {
        const notificacion = document.getElementById('notificacion');
        if (!notificacion) return;

        notificacion.textContent = mensaje;

        if (tipo === 'error') {
            notificacion.classList.add('error');
        } else {
            notificacion.classList.remove('error');
        }

        notificacion.classList.add('mostrar');

        setTimeout(() => {
            notificacion.classList.remove('mostrar');
        }, 3000);
    }

});
