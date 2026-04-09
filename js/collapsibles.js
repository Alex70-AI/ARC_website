/* collapsibles.js — <details> analytics hooks */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('details[id]').forEach(el => {
    el.addEventListener('toggle', () => {
      if (el.open) {
        trackEvent('collapsible_open', { block_id: el.id });
      }
    });
  });
});
