/* scroll.js — Hash anchor on load, smooth scroll, attribution capture */

/* ── Attribution ─────────────────────────────────────────────────────────── */

const ATTRIBUTION_ANCHORS = { t: 'telegram', li: 'linkedin', wa: 'whatsapp', hn: 'hackernews' };

let _attributionSource = null;

function captureAttribution(anchorKey) {
  _attributionSource = ATTRIBUTION_ANCHORS[anchorKey] || anchorKey;
}

function getAttributionSource() {
  if (_attributionSource) return _attributionSource;

  // Priority 1: UTM source
  const params = new URLSearchParams(location.search);
  if (params.get('utm_source')) return params.get('utm_source');

  // Priority 2: Attribution anchor
  const hash = location.hash.replace('#', '');
  if (ATTRIBUTION_ANCHORS[hash]) return ATTRIBUTION_ANCHORS[hash];

  // Priority 3: Referrer hostname
  if (document.referrer) {
    try {
      const ref = new URL(document.referrer).hostname;
      if (ref.includes('t.me') || ref.includes('telegram')) return 'telegram';
      if (ref.includes('linkedin.com')) return 'linkedin';
      if (ref.includes('reddit.com')) return 'reddit';
      if (ref.includes('news.ycombinator.com')) return 'hackernews';
      if (ref.includes('twitter.com') || ref.includes('x.com')) return 'twitter';
    } catch (_) {}
  }

  return 'direct';
}

// Expose globally so form.js and analytics.js can call it
window.getAttributionSource = getAttributionSource;

/* ── Smooth scroll ───────────────────────────────────────────────────────── */

function smoothScrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Attach smooth scroll to all anchor links ────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);

      // Attribution anchors — do not scroll
      if (ATTRIBUTION_ANCHORS[id]) return;

      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        smoothScrollToId(id);
      }
    });
  });
});

/* ── Initial anchor scroll on page load ─────────────────────────────────── */

function handleInitialAnchor() {
  const hash = location.hash.replace('#', '');
  if (!hash) return;

  // Attribution anchors — capture but do not scroll
  if (ATTRIBUTION_ANCHORS[hash]) {
    captureAttribution(hash);
    // Remove attribution anchor from URL cleanly (no history entry)
    try {
      history.replaceState(null, '', location.pathname + location.search);
    } catch (_) {}
    return;
  }

  // Use double-rAF to allow layout to stabilise before scrolling
  // (Telegram iOS in-app browser can fire scroll before images load)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', handleInitialAnchor);
