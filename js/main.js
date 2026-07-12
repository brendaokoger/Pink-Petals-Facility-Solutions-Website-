/* Pink Petals Facility Solutions — Main JS */
(function () {
  'use strict';

  /* ── CINEMATIC INTRO — logo blooms then shatters into petals ── */
  (function () {
    var overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var seen = false;
    try { seen = sessionStorage.getItem('pp-intro-v2') === '1'; } catch (e) {}
    if (seen || reduced) { overlay.classList.add('io-gone'); return; }

    /* Create canvas — sits above overlay (z 9999 vs overlay's 9998) */
    var cvs = document.createElement('canvas');
    cvs.setAttribute('aria-hidden', 'true');
    cvs.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'z-index:9999;pointer-events:none;';
    document.body.appendChild(cvs);
    var ctx = cvs.getContext('2d');

    function setSize() {
      cvs.width  = window.innerWidth;
      cvs.height = window.innerHeight;
    }
    setSize();
    window.addEventListener('resize', setSize);

    /* Strip white/near-white pixels from logo so it shows cleanly on black */
    function processLogo(img, cb) {
      var oc  = document.createElement('canvas');
      oc.width  = img.naturalWidth  || 512;
      oc.height = img.naturalHeight || 512;
      var ox = oc.getContext('2d');
      ox.drawImage(img, 0, 0);
      try {
        var id = ox.getImageData(0, 0, oc.width, oc.height);
        var d  = id.data;
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i], g = d[i+1], b = d[i+2];
          var luma = 0.299*r + 0.587*g + 0.114*b;
          var maxC = Math.max(r,g,b), minC = Math.min(r,g,b);
          var sat  = maxC === 0 ? 0 : (maxC - minC) / maxC;
          /* Near-white, low-saturation → transparent */
          if (sat < 0.20 && luma > 205) {
            var t = Math.min(1, (luma - 205) / 50);
            d[i+3] = Math.round(d[i+3] * (1 - t));
          }
        }
        ox.putImageData(id, 0, 0);
        cb(oc);
      } catch (e) {
        cb(img); /* CORS fallback — use original image */
      }
    }

    /* Draw petal shape (bezier oval) */
    var PETAL_COLORS = [
      '#E8387A','#F27BA5','#C82060','#B83268',
      '#0E5032','#1A7A4A','#FAF9F7'
    ];

    function drawPetal(x, y, w, h, rot, color, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo( w*0.55, -h*0.25,  w*0.55,  h*0.25, 0,  h*0.5);
      ctx.bezierCurveTo(-w*0.55,  h*0.25, -w*0.55, -h*0.25, 0, -h*0.5);
      ctx.shadowColor = color;
      ctx.shadowBlur  = 5;
      ctx.fillStyle   = color;
      ctx.fill();
      ctx.restore();
    }

    /* Draw logo with optional glow passes */
    function drawLogo(logo, cx, cy, size, alpha, rot, glowAmt) {
      if (!logo || alpha <= 0) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      if (glowAmt > 0) {
        ctx.globalAlpha = Math.min(1, alpha * 0.5);
        ctx.shadowColor = '#E8387A';
        ctx.shadowBlur  = 65 * glowAmt;
        ctx.drawImage(logo, -size/2, -size/2, size, size);
        ctx.globalAlpha = Math.min(1, alpha * 0.75);
        ctx.shadowBlur  = 22 * glowAmt;
        ctx.drawImage(logo, -size/2, -size/2, size, size);
      }
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.shadowBlur  = 0;
      ctx.drawImage(logo, -size/2, -size/2, size, size);
      ctx.restore();
    }

    /* Easing helpers */
    function easeOutCubic(t)  { return 1 - Math.pow(1 - t, 3); }
    function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

    /* Build particle arrays */
    function createParticles() {
      var cx = cvs.width / 2, cy = cvs.height / 2;
      var arr = [];

      /* Fast burst — scatter and fade */
      for (var i = 0; i < 62; i++) {
        var ang = (Math.PI * 2 * i / 62) + (Math.random() - 0.5) * 0.4;
        var spd = 3.5 + Math.random() * 11;
        arr.push({
          x: cx + (Math.random()-0.5)*55, y: cy + (Math.random()-0.5)*55,
          vx: Math.cos(ang)*spd,          vy: Math.sin(ang)*spd,
          rot:  Math.random()*Math.PI*2,  rotSpd: (Math.random()-0.5)*0.30,
          w:    7  + Math.random()*17,    h: 11 + Math.random()*28,
          color: PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)],
          alpha: 1,
          decay: 0.009 + Math.random()*0.016,
          drag:  0.94  + Math.random()*0.04,
          grav:  0.04  + Math.random()*0.07,
          delay: Math.random()*90,
          trailer: false
        });
      }

      /* Slow trailers — drift across the hero section 2–3 s */
      for (var j = 0; j < 18; j++) {
        var ta  = Math.random() * Math.PI * 2;
        var tsp = 0.5 + Math.random() * 2.0;
        arr.push({
          x: cx + (Math.random()-0.5)*130, y: cy + (Math.random()-0.5)*70,
          vx: Math.cos(ta)*tsp,            vy: Math.sin(ta)*tsp - 0.5,
          rot:  Math.random()*Math.PI*2,   rotSpd: (Math.random()-0.5)*0.05,
          w:    8  + Math.random()*13,     h: 13 + Math.random()*21,
          color: PETAL_COLORS[Math.floor(Math.random()*4)],
          alpha: 0.88,
          decay: 0.0016 + Math.random()*0.0020,
          drag:  0.993, grav: 0.008,
          delay: 200 + Math.random()*480,
          trailer: true
        });
      }
      return arr;
    }

    /* Animation state */
    var logoBitmap = null;
    var phase      = 'fadein';   /* fadein | glow | explode */
    var startTs    = null;
    var glowStart  = null;
    var xplodeTs   = null;
    var particles  = [];
    var raf;

    function tick(ts) {
      if (!startTs) startTs = ts;
      var el = ts - startTs;

      var W  = cvs.width,  H  = cvs.height;
      var cx = W / 2,      cy = H / 2;
      var sz = Math.min(W * 0.36, H * 0.40, 268);

      ctx.clearRect(0, 0, W, H);

      /* Canvas owns its own black background during logo phases */
      if (phase === 'fadein' || phase === 'glow') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
      }

      /* ─── Phase 1: logo fades in (0–520 ms) ─── */
      if (phase === 'fadein') {
        var p = Math.min(1, el / 520);
        var scale = 0.85 + 0.15 * easeOutCubic(p);
        drawLogo(logoBitmap, cx, cy, sz * scale, easeOutCubic(p), 0, 0);
        if (el >= 520) { phase = 'glow'; glowStart = ts; }
      }

      /* ─── Phase 2: glow + slow rotation (520 ms → 1120 ms) ─── */
      else if (phase === 'glow') {
        var gt = ts - glowStart;
        var gp = Math.min(1, gt / 600);
        var glw = Math.sin(gp * Math.PI) * 1.0;          /* peaks mid-phase */
        var rot = Math.sin(easeInOutSine(gp) * Math.PI) * 0.13; /* ≈7.5° */
        drawLogo(logoBitmap, cx, cy, sz, 1, rot, glw);
        if (gt >= 600) {
          phase    = 'explode';
          xplodeTs = ts;
          particles = createParticles();
          /* Begin revealing the page behind */
          overlay.style.transition = 'opacity 0.42s ease';
          overlay.style.opacity    = '0';
          setTimeout(function () { overlay.classList.add('io-gone'); }, 460);
        }
      }

      /* ─── Phase 3: explosion + trailer petals (1120 ms → ~4000 ms) ─── */
      else if (phase === 'explode') {
        var et = ts - xplodeTs;

        /* Logo dissolves out in first 220 ms of explosion */
        var lf = Math.max(0, 1 - et / 220);
        if (lf > 0) drawLogo(logoBitmap, cx, cy, sz, lf, 0, lf * 0.25);

        /* Update and draw each particle */
        var alive = 0;
        for (var i = 0; i < particles.length; i++) {
          var pr = particles[i];
          if (pr.alpha <= 0.01) continue;
          if (et < pr.delay) { alive++; continue; }
          alive++;
          pr.x += pr.vx;  pr.y  += pr.vy;
          pr.vy += pr.grav;
          pr.vx *= pr.drag; pr.vy *= pr.drag;
          pr.rot += pr.rotSpd;
          pr.alpha -= pr.decay;
          drawPetal(pr.x, pr.y, pr.w, pr.h, pr.rot, pr.color, Math.max(0, pr.alpha));
        }

        if (alive === 0 || et > 4400) {
          /* All petals gone — fade canvas out and clean up */
          cvs.style.transition = 'opacity 0.35s';
          cvs.style.opacity    = '0';
          setTimeout(function () {
            cvs.remove();
            window.removeEventListener('resize', setSize);
            try { sessionStorage.setItem('pp-intro-v2', '1'); } catch (e) {}
          }, 380);
          return;
        }
      }

      raf = requestAnimationFrame(tick);
    }

    /* Load → process → animate */
    var imgEl  = new Image();
    imgEl.crossOrigin = 'anonymous';
    imgEl.onload = function () {
      processLogo(imgEl, function (processed) {
        logoBitmap = processed;
        raf = requestAnimationFrame(tick);
      });
    };
    imgEl.onerror = function () {
      raf = requestAnimationFrame(tick); /* animate without logo */
    };
    imgEl.src = 'images/logo.png';
  }());

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
      '#why',
      '#industries',
      '#gov-ready',
      '#standards',
      '#contact',
    ];

    /* ── Spawn a petal element ── */
    function spawnPetal(idx, vw, vh) {
      var el = document.createElement('div');
      el.className = 'petal-fx';
      el.setAttribute('data-v', String((idx % 3) + 1));

      /* Size: elongated petal shapes closer to the logo silhouette */
      var w   = 20 + Math.random() * 16;           /* 20–36 px */
      var h   = w * (2.0 + Math.random() * 0.80); /* 2.0–2.8× */

      /* Spawn across viewport width, in upper portion (lighter backgrounds) */
      var x   = vw * (0.06 + Math.random() * 0.88);
      var y   = vh * (0.10 + Math.random() * 0.30);

      /* Drift: graceful upward float with gentle lateral sway */
      var dx  = (Math.random() - 0.5) * 88;
      var dy  = -(58 + Math.random() * 72);

      /* Rotation: gentle — not a full spin */
      var r0  = Math.random() * 70 - 35;
      var r1  = r0 + (Math.random() * 110 - 55);

      /* Stagger delays naturally */
      var delay = idx * 0.16 + Math.random() * 0.08;
      var dur   = 1.8 + Math.random() * 0.90;
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
