/* Pink Petals Facility Solutions — Main JS */
(function () {
  'use strict';

  /* ---- Drawer (mobile menu) ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const drawer    = document.querySelector('.nav__drawer');
  const overlay   = document.querySelector('.nav__drawer-overlay');
  const closeBtn  = document.querySelector('.nav__drawer-close');

  function openDrawer() {
    drawer && drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer && drawer.classList.remove('open');
    overlay && overlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  overlay && overlay.addEventListener('click', closeDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);

  /* Close drawer on nav link click */
  document.querySelectorAll('.nav__drawer-link, .nav__drawer-cta .btn').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });

  /* ---- Sticky nav shadow ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  /* ---- Active nav link ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__drawer-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === path) link.classList.add('active');
  });

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---- Contact form ---- */
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  /* ---- Capability statement ---- */
  document.querySelectorAll('[data-capability]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Capability Statement will be available for download shortly.\nFor an immediate copy, please call (219) 285-8345 or email info@pinkpetalsfacility.com');
    });
  });

})();
