/* analytics.js — Phase A: no-op stubs. Phase B: swap for live implementation. */

window.ARC = window.ARC || {};

window.ARC.trackEvent = function (name, props) {
  console.debug('[analytics stub]', name, props);
};

function trackEvent(name, props) {
  window.ARC.trackEvent(name, props);
}

/* ── Scroll depth events (Intersection Observer) ────────────────────────── */
/* Fire once per page load when section first enters viewport at 30% */

const SECTION_EVENTS = {
  'how-it-works':        'section_view_how_it_works',
  'builders':            'section_view_builders',
  'register':            'section_view_register_primary',
  'evaluation':          'section_view_evaluation',
  'industry':            'section_view_industry',
  'faq':                 'section_view_faq',
  'register-secondary':  'section_view_register_secondary',
};

document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (SECTION_EVENTS[id]) {
          trackEvent(SECTION_EVENTS[id], { source: window.getAttributionSource ? window.getAttributionSource() : 'direct' });
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.3 });

  Object.keys(SECTION_EVENTS).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  /* ── Click event delegation ─────────────────────────────────────────── */

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-track]');
    if (!target) return;
    const eventName = target.getAttribute('data-track');
    const props = {};
    if (target.dataset.trackProps) {
      try { Object.assign(props, JSON.parse(target.dataset.trackProps)); } catch (_) {}
    }
    trackEvent(eventName, props);
  });

  /* ── Page load events ───────────────────────────────────────────────── */

  trackEvent('page_load', {
    source: window.getAttributionSource ? window.getAttributionSource() : 'direct',
    has_anchor: !!location.hash,
  });

  if (location.hash === '#industry') {
    trackEvent('industry_direct_landing', {
      source: window.getAttributionSource ? window.getAttributionSource() : 'direct',
    });
  }
});
