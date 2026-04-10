/* form.js - Validation, Phase A JSON file workflow, privacy notice toggle */

const VALIDATORS = {
  full_name: (v) =>
    v.trim().length >= 2 ? null : 'Enter your full name (minimum 2 characters).',
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Enter a valid email address.',
  consent: (_v, el) =>
    el.checked ? null : 'You must agree to the Privacy Notice to register.',
};

let loadedRegistrations = null;
let loadedFileName = 'registrations.json';
let lastRegistrationIntent = null;

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[name]').forEach(field => {
    if (!VALIDATORS[field.name]) return;
    const error = VALIDATORS[field.name](field.value, field);
    const errorEl =
      document.getElementById(field.id + '-error') ||
      form.querySelector(`[id$="${field.name}-error"]`);
    if (errorEl) errorEl.textContent = error || '';
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (error) valid = false;
  });
  return valid;
}

function buildRecord(form, instance) {
  const fd = new FormData(form);
  const intent = getRegistrationIntent(instance);
  return {
    form_instance: instance,
    full_name: (fd.get('full_name') || '').trim(),
    email: (fd.get('email') || '').toLowerCase().trim(),
    country: fd.get('country') || null,
    cta_button_id: intent.cta_button_id,
    team_vs_individual: null,
    audience_segment: null,
    experience_level: null,
    consent_given: !!form.querySelector('[name="consent"]').checked,
    registered_at: new Date().toISOString(),
    cta_source: intent.cta_source,
  };
}

function normaliseText(value) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function resolveCtaSource(link) {
  if (link.dataset.track) return link.dataset.track;

  const href = link.getAttribute('href');
  const section = link.closest('section[id], header, footer');
  const sectionId = section?.id || section?.tagName?.toLowerCase() || 'page';
  const text = normaliseText(link.textContent);
  if (href === '#register') {
    return `${sectionId}_${text || 'register_link'}`;
  }
  return null;
}

function resolveCtaButtonId(link) {
  return (link.dataset.ctaId || '').trim() || null;
}

function captureRegistrationIntent(link) {
  const ctaSource = resolveCtaSource(link);
  const ctaButtonId = resolveCtaButtonId(link);
  if (!ctaSource && !ctaButtonId) return;

  lastRegistrationIntent = {
    cta_button_id: ctaButtonId,
    cta_source: ctaSource,
  };
}

function getRegistrationIntent(instance) {
  if (lastRegistrationIntent) return lastRegistrationIntent;
  return {
    cta_button_id: 'direct_submit_primary',
    cta_source: 'direct_form_primary',
  };
}

function showConfirmation(form, email) {
  const instance = form.dataset.formInstance;
  const confirmEl = document.getElementById('confirm-' + instance);
  if (!confirmEl) return;

  const emailEl = confirmEl.querySelector('[data-confirm-email]');
  if (emailEl) emailEl.textContent = email;

  form.setAttribute('hidden', '');
  const activationLinks = document.getElementById('activation-links-' + instance);
  if (activationLinks) activationLinks.setAttribute('hidden', '');
  confirmEl.removeAttribute('hidden');
  confirmEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showFormError(form, _type, message) {
  let banner = form.querySelector('.form-error-banner');
  if (!banner) {
    banner = document.createElement('p');
    banner.className = 'form-error-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');
    form.prepend(banner);
  }
  banner.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  const banner = form.querySelector('.form-error-banner');
  if (banner) banner.remove();
}

function getWorkflowFileName() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('-') + '_' + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('-');
  return `registrations-${stamp}.json`;
}

function syncWorkflowStatus(message, tone = 'info') {
  document.querySelectorAll('[data-json-status]').forEach((el) => {
    el.textContent = message;
    el.dataset.tone = tone;
  });
}

function syncLoadedFileName(name) {
  document.querySelectorAll('[data-json-file]').forEach((el) => {
    el.textContent = name;
  });
}

function setLoadedRegistrations(data, fileName) {
  loadedRegistrations = data;
  loadedFileName = fileName || 'registrations.json';
  syncLoadedFileName(loadedFileName);
  syncWorkflowStatus(
    `Loaded ${loadedRegistrations.length} registrations from ${loadedFileName}. The next submit will append a record and download a new JSON file.`,
    'success'
  );
}

function downloadRegistrations(data) {
  const outputFileName = getWorkflowFileName();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outputFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  syncWorkflowStatus(
    `Downloaded ${outputFileName}. Save or move it into Registration and use that latest file next time.`,
    'success'
  );
}

async function handleJsonFileLoad(file) {
  if (!file) return;

  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('JSON root must be an array of registration records.');
    }
    setLoadedRegistrations(parsed, file.name);
  } catch (err) {
    loadedRegistrations = null;
    loadedFileName = 'registrations.json';
    syncLoadedFileName(loadedFileName);
    syncWorkflowStatus(
      `Couldn't load ${file.name}. Use a valid registrations.json array file.`,
      'error'
    );
    console.warn('[Phase A] JSON load failed:', err);
  }
}

function handleSubmitPhaseA(form, event) {
  event.preventDefault();
  clearErrors(form);

  if (!validateForm(form)) return;
  if (!Array.isArray(loadedRegistrations)) {
    showFormError(form, 'json', 'Load the current registrations.json file before submitting.');
    syncWorkflowStatus(
      'No JSON file loaded yet. Load Registration/registrations.json first.',
      'error'
    );
    return;
  }

  const instance = form.dataset.formInstance;
  const data = buildRecord(form, instance);
  const nextRegistrations = [...loadedRegistrations, data];

  downloadRegistrations(nextRegistrations);
  setLoadedRegistrations(nextRegistrations, loadedFileName);
  showConfirmation(form, data.email);
  lastRegistrationIntent = null;
  trackEvent('form_submit', { instance, phase: 'A', storage: 'json_download' });
}

function initPrivacyToggles() {
  const dialog = document.getElementById('privacy-notice-dialog');
  if (!dialog) return;

  document.querySelectorAll('.privacy-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      dialog.showModal();
      btn.setAttribute('aria-expanded', 'true');
    });
  });

  const closeBtn = dialog.querySelector('.privacy-dialog__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => dialog.close());
  }

  dialog.addEventListener('close', () => {
    document.querySelectorAll('.privacy-toggle').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on backdrop click
  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });
}

function initTimingFields() {
  document.querySelectorAll('.reg-form').forEach(form => {
    const field = form.querySelector('[name="form_rendered_at"]');
    if (field) field.value = Date.now().toString();
  });
}

function initJsonWorkflow() {
  document.querySelectorAll('[data-json-load-input]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const [file] = event.target.files || [];
      handleJsonFileLoad(file);
    });
  });

  syncLoadedFileName(loadedFileName);
  syncWorkflowStatus(
    'Load Registration/registrations.json before submitting. Each registration download becomes your new latest source file.',
    'info'
  );
}

function initRegistrationIntentCapture() {
  document.querySelectorAll('a[href="#register"]').forEach((link) => {
    link.addEventListener('click', () => captureRegistrationIntent(link));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTimingFields();
  initPrivacyToggles();
  initJsonWorkflow();
  initRegistrationIntentCapture();

  document.querySelectorAll('.reg-form').forEach(form => {
    form.addEventListener('submit', (e) => handleSubmitPhaseA(form, e));
  });
});
