/* ---------------- Scroll suave para anclas ---------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      e.preventDefault();
      const t = document.querySelector(id);
      t && t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------------- Animación de entrada banners (Actualizado) ---------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  })
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

// Apuntamos a la clase ".banner-card"
document.querySelectorAll('.banner-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'all .6s ease-out';
  observer.observe(el);
});

/* ---------------- Micro-interacción carrito (Sin cambios) ---------------- */
const cartBtn = document.querySelector('.icon-btn[aria-label="Carrito"]');
if (cartBtn) {
  cartBtn.addEventListener('click', function () {
    this.style.transform = 'scale(1.18)';
    setTimeout(() => { this.style.transform = 'scale(1)'; }, 180);
  });
}

/* ---------------- CTA al click en banner (Actualizado) ---------------- */
document.querySelectorAll('.banner-card').forEach(card => {
  card.addEventListener('click', e => {
    const btn = card.querySelector('.banner-btn');
    // Previene el click si se está clickando en el botón mismo
    if (btn && !btn.contains(e.target)) {
      // Simular acción de agregar/ver
      mostrarNotificacion('🔥 Redirigiendo a detalles del drop...');
      setTimeout(() => {
        btn.click();
      }, 1000);
    }
  });
});

/* ---------------- HERO SLIDER (Vanilla) (¡Se queda!) ---------------- */
(function () {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const track = slider.querySelector('.hero-track');
  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const prevBtn = slider.querySelector('.hero-prev');
  const nextBtn = slider.querySelector('.hero-next');
  const dotsWrap = slider.querySelector('.hero-dots');

  let index = 0;
  let timer;
  const intervalMs = 4000;

  // Crear dots automáticamente
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot' + (i === 0 ? ' active' : '');
    b.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    slides.forEach((s, idx) => s.setAttribute('aria-hidden', String(idx !== index)));
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === index);
      d.setAttribute('aria-selected', idx === index ? 'true' : 'false');
    });
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  // Controles
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  // Autoplay con pausa
  function start() { timer = setInterval(next, intervalMs); }
  function stop() { clearInterval(timer); }
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  // Teclado
  slider.setAttribute('tabindex', '0');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // Swipe táctil
  let startX = 0, deltaX = 0, touching = false;
  slider.addEventListener('touchstart', (e) => { touching = true; startX = e.touches[0].clientX; stop(); }, { passive: true });
  slider.addEventListener('touchmove', (e) => { if (touching) deltaX = e.touches[0].clientX - startX; }, { passive: true });
  slider.addEventListener('touchend', () => {
    if (Math.abs(deltaX) > 40) { deltaX < 0 ? next() : prev(); }
    touching = false; deltaX = 0; start();
  });

  // Lazy
  slides.forEach(s => s.querySelector('img')?.setAttribute('loading', 'lazy'));

  // Init
  goTo(0);
  start();
})();


/* ---------------- MOSTRAR NOTIFICACIÓN ---------------- */
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
