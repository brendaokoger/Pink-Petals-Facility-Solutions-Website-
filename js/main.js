/* Pink Petals Facility Solutions — Main JS */
(function () {
  'use strict';

  /* ── MOBILE DRAWER ────────────────────────────────────────── */
  const burger   = document.querySelector('.nav-burger');
  const drawer   = document.getElementById('drawer');
  const scrim    = document.getElementById('drawer-scrim');
  const drawerX  = document.querySelector('.drawer-x');

  function openDrawer() {
    drawer && (drawer.classList.add('open'), drawer.setAttribute('aria-hidden', 'false'));
    scrim  && scrim.classList.add('open');
    burger && (burger.classList.add('open'), burger.setAttribute('aria-expanded', 'true'));
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer && (drawer.classList.remove('open'), drawer.setAttribute('aria-hidden', 'true'));
    scrim  && scrim.classList.remove('open');
    burger && (burger.classList.remove('open'), burger.setAttribute('aria-expanded', 'false'));
    document.body.style.overflow = '';
  }

  burger  && burger.addEventListener('click',  () => drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  scrim   && scrim.addEventListener('click',   closeDrawer);
  drawerX && drawerX.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-link, .drawer-btn').forEach(el => el.addEventListener('click', closeDrawer));

  /* ── STICKY NAV ───────────────────────────────────────────── */
  const nav = document.getElementById('site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── SCROLL REVEAL ────────────────────────────────────────── */
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

  /* ── CONTACT FORM ─────────────────────────────────────────── */
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn   = form.querySelector('[type="submit"]');
      const label = btn.querySelector('.submit-label');
      const orig  = label ? label.textContent : btn.textContent;
      if (label) label.textContent = 'Message Sent!';
      else btn.textContent = 'Message Sent!';
      btn.style.background = '#156B43';
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

  /* ── CAPABILITY STATEMENT FALLBACK ───────────────────────── */
  document.querySelectorAll('[data-capability]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Capability Statement will be available for download shortly.\nFor an immediate copy, please call (219) 285-8345 or email pinkpetalsfacilitysolutions@gmail.com');
    });
  });

  /* ── HERO IMAGE PARALLAX (desktop only) ──────────────────── */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 861px)').matches) return;

    const photoWrap = document.querySelector('.hero-photo-wrap');
    const hero      = document.querySelector('.hero');
    if (!photoWrap || !hero) return;

    let rafId    = null;
    let isActive = true;

    const onParallaxScroll = function () {
      if (!isActive || rafId) return;
      rafId = requestAnimationFrame(function () {
        const y = Math.max(0, window.scrollY);
        photoWrap.style.transform = 'translateY(' + (y * 0.09) + 'px)';
        rafId = null;
      });
    };

    window.addEventListener('scroll', onParallaxScroll, { passive: true });

    if ('IntersectionObserver' in window) {
      var ioParallax = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          isActive = e.isIntersecting;
          if (!isActive) photoWrap.style.transform = '';
        });
      }, { threshold: 0 });
      ioParallax.observe(hero);
    }
  }());

}());
