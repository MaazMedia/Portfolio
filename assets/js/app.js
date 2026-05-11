/* ================================================
   GENIUSDEV STUDIO — Main JS
   Vanilla only. No jQuery. No frameworks.
   ================================================ */

(function () {
  'use strict';

  /* ── Navigation: transparent → solid on scroll ── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Mobile hamburger menu ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  /* ── Intersection Observer: fade-up animations ── */
  const animateEls = document.querySelectorAll('[data-animate]');

  if (animateEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animateEls.forEach(el => observer.observe(el));
  }

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#calendly') return; // let placeholder links pass through

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── About photo: graceful fallback ── */
  const aboutImg = document.querySelector('.about-photo');
  if (aboutImg) {
    aboutImg.addEventListener('error', function () {
      const wrap = this.closest('.about-photo-placeholder') || this.parentElement;
      this.remove();
      const placeholder = document.createElement('div');
      placeholder.className = 'about-photo-placeholder';
      placeholder.innerHTML = '<span>maaz-photo.jpg</span>';
      wrap.appendChild(placeholder);
    });
  }

})();
