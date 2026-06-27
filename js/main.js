/* Pink Petals Facility Solutions — Main JS */
(function () {
  'use strict';

  /* ---- Mobile drawer ---- */
  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.querySelector('.drawer');
  const overlay   = document.querySelector('.drawer-overlay');
  const closeBtn  = document.querySelector('.drawer-close');

  function openDrawer() {
    if (drawer)    { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
    if (overlay)   overlay.classList.add('open');
    if (hamburger) { hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); }
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (drawer)    { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
    if (overlay)   overlay.classList.remove('open');
    if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link, .drawer .btn-pink, .drawer .btn-pink-sm').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });

  /* ---- Sticky nav ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Active nav link ---- */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop().split('#')[0] || 'index.html';
    if (href === page) link.classList.add('active');
  });

  /* ---- Scroll reveal ([data-reveal] system) ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        if (delay) el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-revealed');
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-revealed'));
  }

  /* ---- Legacy .reveal support (subpages) ---- */
  const legacyReveals = document.querySelectorAll('.reveal');
  if (legacyReveals.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    legacyReveals.forEach(el => io2.observe(el));
  } else {
    legacyReveals.forEach(el => el.classList.add('in'));
  }

  /* ---- Stat counters ---- */
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(easeOut(progress) * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => counterIO.observe(el));
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

  /* ---- Capability statement download alert ---- */
  document.querySelectorAll('[data-capability]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Capability Statement will be available for download shortly.\nFor an immediate copy, please call (219) 285-8345 or email pinkpetalsfacilitysolutions@gmail.com');
    });
  });

  /* ---- Legacy drawer support (old subpages using .nav__drawer classes) ---- */
  const legacyHamburger = document.querySelector('.nav__hamburger');
  const legacyDrawer    = document.querySelector('.nav__drawer');
  const legacyOverlay   = document.querySelector('.nav__drawer-overlay');
  const legacyClose     = document.querySelector('.nav__drawer-close');

  if (legacyHamburger && legacyDrawer) {
    function openLegacy()  { legacyDrawer.classList.add('open'); legacyOverlay && legacyOverlay.classList.add('open'); legacyHamburger.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeLegacy() { legacyDrawer.classList.remove('open'); legacyOverlay && legacyOverlay.classList.remove('open'); legacyHamburger.classList.remove('open'); document.body.style.overflow = ''; }
    legacyHamburger.addEventListener('click', () => legacyDrawer.classList.contains('open') ? closeLegacy() : openLegacy());
    legacyOverlay && legacyOverlay.addEventListener('click', closeLegacy);
    legacyClose && legacyClose.addEventListener('click', closeLegacy);
    document.querySelectorAll('.nav__drawer-link, .nav__drawer-cta .btn').forEach(el => el.addEventListener('click', closeLegacy));
  }

})();
