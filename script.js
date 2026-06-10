/* ── THEME ───────────────────────────────────── */
const toggleBtn = document.getElementById('themeToggle');
const iconSun   = document.getElementById('icon-sun');
const iconMoon  = document.getElementById('icon-moon');
const html      = document.documentElement;

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  if (t === 'dark') {
    iconSun.style.display  = 'none';
    iconMoon.style.display = '';
  } else {
    iconSun.style.display  = '';
    iconMoon.style.display = 'none';
  }
}

setTheme(localStorage.getItem('theme') || 'light');
toggleBtn.addEventListener('click', () =>
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

/* ── CURSOR ──────────────────────────────────── */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

(function loop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
  requestAnimationFrame(loop);
})();

/* ── NAV SCROLL ──────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
  nav.classList.toggle('scrolled', scrollY > 50)
);

/* ── REVEAL ON SCROLL ────────────────────────── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 90);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── CONTACT FORM ────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const n  = document.getElementById('form-name').value;
  const em = document.getElementById('form-email').value;
  const m  = document.getElementById('form-msg').value;
  if (!n || !em || !m) return;
  document.getElementById('form-feedback').style.display = 'block';
  setTimeout(() => {
    const s = encodeURIComponent(`Contato via portfólio - ${n}`);
    const b = encodeURIComponent(`Nome: ${n}\nE-mail: ${em}\n\nMensagem:\n${m}`);
    window.location.href = `mailto:isabel.lucena2007@gmail.com?subject=${s}&body=${b}`;
  }, 800);
}
