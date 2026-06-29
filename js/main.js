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

  /* ── PETAL TRANSITION SYSTEM ─────────────────────────────── */
  /*
   * Triggers a brief (1.6–2.4s) petal burst when the user scrolls
   * DOWN into each major section boundary.
   *
   * Rules:
   *  - Only fires on downward scroll
   *  - Global cooldown: 3.2s between any two bursts
   *  - Per-section cooldown: 5s before same section re-triggers
   *  - Skips sections already visible on page load
   *  - Fully disabled by prefers-reduced-motion
   *  - pointer-events:none, z-index:50 — never blocks anything
   */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    var GLOBAL_COOLDOWN  = 3200;
    var SECTION_COOLDOWN = 5000;
    var INIT_DELAY       = 900;   /* wait for hero animation to finish */
    var MIN_PETALS       = 5;
    var MAX_PETALS       = 8;

    var lastFired    = 0;
    var sectionTimes = {};
    var inViewOnLoad = new Set();
    var scrollDir    = 'down';
    var lastScrollY  = window.scrollY;

    /* Track scroll direction */
    window.addEventListener('scroll', function () {
      scrollDir  = window.scrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = window.scrollY;
    }, { passive: true });

    /* Sections that trigger a petal burst on entry */
    var WATCH_SELECTORS = [
      '.trust-strip',
      '#services',
      '#industries',
      '#government',
      '#capability',
      '#about',
      '#contact',
    ];

    /* ── Spawn a petal element ── */
    function spawnPetal(idx, vw, vh) {
      var el = document.createElement('div');
      el.className = 'petal-fx';
      el.setAttribute('data-v', String((idx % 3) + 1));

      /* Size: clearly visible petal shapes */
      var w   = 18 + Math.random() * 18;           /* 18–36 px */
      var h   = w * (1.8 + Math.random() * 0.65); /* 1.8–2.45× */

      /* Spawn across viewport width, in upper portion (lighter backgrounds) */
      var x   = vw * (0.06 + Math.random() * 0.88);
      var y   = vh * (0.10 + Math.random() * 0.30);

      /* Drift: always upward, gentle lateral sway */
      var dx  = (Math.random() - 0.5) * 100;
      var dy  = -(52 + Math.random() * 68);

      /* Rotation: gentle — not a full spin */
      var r0  = Math.random() * 70 - 35;
      var r1  = r0 + (Math.random() * 110 - 55);

      /* Stagger delays naturally */
      var delay = idx * 0.16 + Math.random() * 0.08;
      var dur   = 1.6 + Math.random() * 0.78;
      var peak  = 0.52 + Math.random() * 0.22; /* 0.52–0.74 — clearly visible */

      el.style.cssText = [
        'left:'     + x     + 'px',
        'top:'      + y     + 'px',
        'width:'    + w     + 'px',
        'height:'   + h     + 'px',
        '--r0:'     + r0    + 'deg',
        '--r1:'     + r1    + 'deg',
        '--dx:'     + dx    + 'px',
        '--dy:'     + dy    + 'px',
        '--delay:'  + delay + 's',
        '--dur:'    + dur   + 's',
        '--peak:'   + peak,
      ].join(';');

      document.body.appendChild(el);
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, (dur + delay) * 1000 + 250);
    }

    /* ── Check cooldowns, then spawn burst ── */
    function tryTrigger(key) {
      var now = Date.now();
      if (now - lastFired           < GLOBAL_COOLDOWN)  return;
      if (sectionTimes[key] && now - sectionTimes[key] < SECTION_COOLDOWN) return;

      lastFired       = now;
      sectionTimes[key] = now;

      var vw    = window.innerWidth;
      var vh    = window.innerHeight;
      var count = MIN_PETALS + Math.floor(Math.random() * (MAX_PETALS - MIN_PETALS + 1));
      for (var i = 0; i < count; i++) { spawnPetal(i, vw, vh); }
    }

    /* ── Boot after hero animation completes ── */
    setTimeout(function () {
      /* Seed which sections are already on-screen so they don't fire */
      WATCH_SELECTORS.forEach(function (sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) inViewOnLoad.add(el);
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            /* Only fire on downward scroll into a section not visible at load */
            if (scrollDir === 'down' && !inViewOnLoad.has(e.target)) {
              var key = e.target.id || e.target.className.split(' ')[0];
              tryTrigger(key);
            }
            inViewOnLoad.add(e.target);
          } else {
            /* Allow re-trigger next time the section scrolls in from below */
            inViewOnLoad.delete(e.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      });

      WATCH_SELECTORS.forEach(function (sel) {
        var el = document.querySelector(sel);
        if (el) io.observe(el);
      });

    }, INIT_DELAY);

  }());

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
