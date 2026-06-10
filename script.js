/* ==========================================================
   script.js — Isabel Lucena Portfólio
   Recursos JS:
   1. Dark / Light Mode com persistência (localStorage)
   2. Header com sombra ao rolar (scroll)
   3. Menu mobile (hamburguer toggle)
   4. Reveal on scroll (IntersectionObserver)
   5. Filtro de projetos por categoria
   6. Validação e envio do formulário de contato
   ========================================================== */

/* ── 1. TEMA CLARO / ESCURO ──────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Aplica o tema salvo (ou o padrão claro)
applyTheme(localStorage.getItem('theme') || 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ── 2. HEADER COM SOMBRA AO ROLAR ──────────────────────── */
const siteHeader = document.getElementById('site-header');

function handleHeaderScroll() {
  if (!siteHeader) return;
  siteHeader.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

/* ── 3. MENU MOBILE ─────────────────────────────────────── */
const menuBtn   = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  // Fecha ao clicar em um link do menu mobile
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ── 4. REVEAL ON SCROLL ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Atraso escalonado para elementos dentro do mesmo viewport
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 5. FILTRO DE PROJETOS ──────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');
const emptyState   = document.getElementById('emptyState');

if (filterBtns.length && projectCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza botão ativo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      projectCards.forEach(card => {
        const cats = card.dataset.category || '';
        const match = filter === 'all' || cats.includes(filter);
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      // Mostra/esconde o estado vazio
      if (emptyState) emptyState.hidden = visibleCount > 0;
    });
  });
}

/* ── 6. FORMULÁRIO DE CONTATO ────────────────────────────── */
const contactForm  = document.getElementById('contactForm');
const submitBtn    = document.getElementById('submitBtn');
const submitLabel  = document.getElementById('submitLabel');
const formSuccess  = document.getElementById('formSuccess');

function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return;
  field.classList.add('invalid');
  error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name    = document.getElementById('form-name');
    const email   = document.getElementById('form-email');
    const msg     = document.getElementById('form-msg');
    const subject = document.getElementById('form-subject');
    let valid = true;

    if (!name.value.trim()) {
      showError('form-name', 'err-name', 'Por favor, informe seu nome.');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError('form-email', 'err-email', 'Informe um e-mail válido.');
      valid = false;
    }
    if (!msg.value.trim()) {
      showError('form-msg', 'err-msg', 'Escreva uma mensagem antes de enviar.');
      valid = false;
    }

    if (!valid) return;

    // Feedback visual
    if (submitLabel) submitLabel.textContent = 'Enviando...';
    if (submitBtn)   submitBtn.disabled = true;

    setTimeout(() => {
      if (formSuccess) formSuccess.hidden = false;

      const sub  = encodeURIComponent(subject?.value || `Contato via portfólio — ${name.value}`);
      const body = encodeURIComponent(
        `Nome: ${name.value}\nE-mail: ${email.value}\n\nMensagem:\n${msg.value}`
      );
      window.location.href = `mailto:isabel.lucena2007@gmail.com?subject=${sub}&body=${body}`;

      // Reset
      contactForm.reset();
      if (submitLabel) submitLabel.textContent = 'Enviar mensagem';
      if (submitBtn)   submitBtn.disabled = false;
    }, 900);
  });

  // Remove erro ao digitar
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const errId = 'err-' + field.id.replace('form-', '');
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  });
}
