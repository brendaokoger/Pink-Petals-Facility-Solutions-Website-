/* Pink Petals Facility Solutions — Main JS */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Nav ---- */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        navItems.forEach(i => i.classList.remove('open'));
      }
    });
    navItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.dropdown');
      if (dropdown && link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('open');
          }
        });
      }
    });
  }

  /* ---- Scroll Animations ---- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ---- Sticky navbar shadow ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(0,0,0,0.14)'
        : '0 2px 8px rgba(0,0,0,0.08)';
    });
  }

  /* ---- Active nav link ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });

  /* ---- Contact Form ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.style.background = '#1B5E38';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  /* ---- Capability Statement Download ---- */
  const dlBtn = document.getElementById('download-capability');
  if (dlBtn) {
    dlBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Capability Statement PDF will be available for download shortly. Please contact us directly at (219) 285-8345 for an immediate copy.');
    });
  }

});
