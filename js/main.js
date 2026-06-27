/* Pink Petals Facility Solutions — Main JS */
(function () {
  'use strict';

  /* ── MOBILE DRAWER ──────────────────────────────────────── */
  const toggle   = document.querySelector('.nav-toggle');
  const drawer   = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const close    = document.querySelector('.drawer-close');

  function openDrawer() {
    drawer   && (drawer.classList.add('open'),   drawer.setAttribute('aria-hidden', 'false'));
    backdrop && backdrop.classList.add('open');
    toggle   && (toggle.classList.add('open'),   toggle.setAttribute('aria-expanded', 'true'));
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer   && (drawer.classList.remove('open'), drawer.setAttribute('aria-hidden', 'true'));
    backdrop && backdrop.classList.remove('open');
    toggle   && (toggle.classList.remove('open'), toggle.setAttribute('aria-expanded', 'false'));
    document.body.style.overflow = '';
  }

  toggle   && toggle.addEventListener('click',   () => drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  backdrop && backdrop.addEventListener('click',  closeDrawer);
  close    && close.addEventListener('click',    closeDrawer);

  document.querySelectorAll('.drawer-link, .drawer-cta').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });

  /* ── STICKY NAV ─────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        el.style.transitionDelay = delay ? delay + 'ms' : '';
        el.classList.add('revealed');
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── LEGACY REVEAL (.reveal / .in) ─────────────────────── */
  const legacyEls = document.querySelectorAll('.reveal');
  if (legacyEls.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    legacyEls.forEach(el => io2.observe(el));
  } else {
    legacyEls.forEach(el => el.classList.add('in'));
  }

  /* ── COUNT-UP ANIMATION ─────────────────────────────────── */
  const countEls = document.querySelectorAll('.count-up[data-target]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const ioCount = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
        ioCount.unobserve(el);
      });
    }, { threshold: 0.6 });
    countEls.forEach(el => ioCount.observe(el));
  }

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const label = btn.querySelector('.submit-label');
      const orig = label ? label.textContent : btn.textContent;
      if (label) label.textContent = 'Message Sent!';
      else btn.textContent = 'Message Sent!';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
      setTimeout(() => {
        if (label) label.textContent = orig;
        else btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  /* ── CAPABILITY STATEMENT FALLBACK ─────────────────────── */
  document.querySelectorAll('[data-capability]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Capability Statement will be available for download shortly.\nFor an immediate copy, please call (219) 285-8345 or email pinkpetalsfacilitysolutions@gmail.com');
    });
  });

  /* ── LEGACY DRAWER (old subpages) ──────────────────────── */
  const legHamburger = document.querySelector('.nav__hamburger');
  const legDrawer    = document.querySelector('.nav__drawer');
  const legOverlay   = document.querySelector('.nav__drawer-overlay');
  const legClose     = document.querySelector('.nav__drawer-close');
  if (legHamburger && legDrawer) {
    const legOpen  = () => { legDrawer.classList.add('open'); legOverlay && legOverlay.classList.add('open'); legHamburger.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const legClose2 = () => { legDrawer.classList.remove('open'); legOverlay && legOverlay.classList.remove('open'); legHamburger.classList.remove('open'); document.body.style.overflow = ''; };
    legHamburger.addEventListener('click', () => legDrawer.classList.contains('open') ? legClose2() : legOpen());
    legOverlay && legOverlay.addEventListener('click', legClose2);
    legClose && legClose.addEventListener('click', legClose2);
    document.querySelectorAll('.nav__drawer-link, .nav__drawer-cta .btn').forEach(el => el.addEventListener('click', legClose2));
  }

})();
