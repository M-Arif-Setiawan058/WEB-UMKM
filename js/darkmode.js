/* ============================================================
   SehatKu — darkmode.js
   Dark mode toggle, scroll progress, sticky search,
   newsletter subscription
   ============================================================ */

/* ---- DARK MODE ---- */
function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('sk-theme', isDark ? 'light' : 'dark');
}

function applyStoredTheme() {
  const theme = localStorage.getItem('sk-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const active = theme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', active);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = active === 'dark' ? '☀️' : '🌙';
}

/* ---- SCROLL PROGRESS ---- */
function updateScrollProgress() {
  const bar  = document.getElementById('scrollBar');
  const sticky = document.getElementById('stickySearch');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = docH > 0 ? (scrollTop / docH) * 100 : 0;
  bar.style.width = pct + '%';

  // Show sticky search after hero passes
  if (sticky) {
    const heroH = document.querySelector('.hero')?.offsetHeight || 500;
    if (scrollTop > heroH * 0.7) sticky.classList.add('visible');
    else sticky.classList.remove('visible');
  }
}

/* ---- NEWSLETTER ---- */
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const email = input?.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠️ Masukkan alamat email yang valid.');
    return;
  }
  // Simulate submission
  input.value = '';
  input.disabled = true;
  showToast('✅ Berhasil! Cek email Anda untuk konfirmasi langganan.');
  const btn = document.querySelector('.newsletter-btn');
  if (btn) {
    btn.textContent = '✓ Terdaftar';
    btn.disabled = true;
    btn.style.background = 'var(--clr-primary-dk)';
  }
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Sync sticky search with hero input
  const stickyInput = document.getElementById('stickySearchInput');
  const heroInput   = document.getElementById('heroSearchInput');
  if (stickyInput && heroInput) {
    heroInput.addEventListener('input', () => { stickyInput.value = heroInput.value; });
    stickyInput.addEventListener('input', () => { heroInput.value = stickyInput.value; });
  }
});
