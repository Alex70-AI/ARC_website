/* nav.js — Sticky header, scroll-aware CTA, hamburger */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Hamburger / mobile nav ──────────────────────────────────────────── */

  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close on link tap
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
        hamburger.focus();
      }
    });
  }

  /* ── Scroll-aware "Register" button ─────────────────────────────────── */
  /*
   * The header Register button targets the nearest form based on scroll.
   * A sentinel div (#register-switch-point) sits between sections 7 and 8.
   * When the sentinel has scrolled above the viewport, target #register-secondary.
   * Otherwise target #register.
   */

  function getNearestFormAnchor() {
    const switchEl = document.getElementById('register-switch-point');
    if (switchEl && switchEl.getBoundingClientRect().top < 0) {
      return '#register-secondary';
    }
    return '#register';
  }

  const navRegisterBtns = document.querySelectorAll('.nav-register-btn');
  navRegisterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const anchor = getNearestFormAnchor();
      const id = anchor.replace('#', '');
      if (typeof smoothScrollToId === 'function') {
        smoothScrollToId(id);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      trackEvent('nav_register_click', {
        target_form: id === 'register' ? 'primary' : 'secondary',
      });
    });
  });

});
