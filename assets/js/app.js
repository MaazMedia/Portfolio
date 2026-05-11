/* ================================================
   GENIUSDEV STUDIO — Main JS
   Vanilla only. No jQuery. No frameworks.
   ================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. NAVIGATION — transparent → glassmorphism
     ───────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ─────────────────────────────────────────────
     2. MOBILE HAMBURGER MENU
     ───────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
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

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }


  /* ─────────────────────────────────────────────
     3. INTERSECTION OBSERVER — scroll animations
     ───────────────────────────────────────────── */
  const animateEls = document.querySelectorAll('[data-animate]');

  if (animateEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animateEls.forEach(el => revealObserver.observe(el));
  }


  /* ─────────────────────────────────────────────
     4. SMOOTH SCROLL on anchor links
     ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#calendly') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────────
     5. STATS COUNTER ANIMATION
     Triggers once when the stats bar enters view.
     ───────────────────────────────────────────── */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const prefix   = el.dataset.countPrefix || '';
    const suffix   = el.dataset.countSuffix || '';
    const duration = target > 100 ? 2000 : 1500;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      const formatted = target >= 1000
        ? value.toLocaleString()
        : String(value);

      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        /* Ensure final value matches exactly */
        const finalFormatted = target >= 1000
          ? target.toLocaleString()
          : String(target);
        el.textContent = prefix + finalFormatted + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    let counted = false;
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statsObserver.disconnect();
          document.querySelectorAll('[data-count]').forEach(animateCount);
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsBar);
  }


  /* ─────────────────────────────────────────────
     6. CUSTOM CURSOR GLOW — desktop only, lerp
     ───────────────────────────────────────────── */
  (function initCursor() {
    /* Only on real pointer devices (not touch-only) */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let started = false;

    document.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        cx = tx; cy = ty;
        started = true;
      }
      glow.classList.add('visible');
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('visible');
    });

    (function lerp() {
      /* Smooth lag: 10% of distance per frame */
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(lerp);
    })();

    /* Expand glow on hoverable elements */
    const hoverTargets = document.querySelectorAll(
      'a, button, .project-card, .service-card, .profile-card, .gallery-card'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => glow.classList.add('hovering'));
      el.addEventListener('mouseleave', () => glow.classList.remove('hovering'));
    });
  })();


  /* ─────────────────────────────────────────────
     7. ABOUT PHOTO — graceful fallback
     ───────────────────────────────────────────── */
  const aboutImg = document.querySelector('.about-photo');
  if (aboutImg) {
    aboutImg.addEventListener('error', function () {
      const wrap = this.parentElement;
      this.outerHTML = '<div class="about-photo-placeholder">maaz-photo.jpg</div>';
      /* Glow stays behind via .about-photo-glow sibling */
    });
  }

})();
