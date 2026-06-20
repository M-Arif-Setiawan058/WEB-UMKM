document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    // Back to top
    const btn = document.getElementById('backToTop');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- HAMBURGER ---- */
  const ham = document.getElementById('hamburger');
  const navL = document.getElementById('navLinks');
  if (ham && navL) {
    ham.addEventListener('click', () => navL.classList.toggle('open'));
    // close when link clicked
    navL.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navL.classList.remove('open')));
  }

  /* ---- BACK TO TOP button (inject if not present) ---- */
  if (!document.getElementById('backToTop')) {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.title = 'Kembali ke atas';
    btn.setAttribute('aria-label', 'Kembali ke atas');
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
  }

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length) {
    const formatNumber = (n) => {
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'Jt';
      if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
      return n.toString();
    };
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const update = () => {
        current += increment;
        if (current < target) {
          el.textContent = formatNumber(Math.floor(current));
          requestAnimationFrame(update);
        } else {
          el.textContent = formatNumber(target);
        }
      };
      update();
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => obs.observe(c));
  }

  /* ---- SMOOTH REVEAL ON SCROLL ---- */
  const reveals = document.querySelectorAll('.section');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => {
    r.style.opacity = '0';
    r.style.transform = 'translateY(30px)';
    r.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revObs.observe(r);
  });

});

/* ---- TOAST HELPER ---- */
function showToast(msg, duration = 2800) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}
