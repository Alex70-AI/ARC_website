/* form.js - Validation, Phase A JSON file workflow, privacy notice toggle */

const VALIDATORS = {
  full_name: (v) =>
    v.trim().length >= 2 ? null : 'Enter your full name (minimum 2 characters).',
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Enter a valid email address.',
  password: (v) =>
    v.length >= 8 ? null : 'Password must be at least 8 characters.',
  consent: (_v, el) =>
    el.checked ? null : 'You must agree to the Privacy Notice to register.',
};

let loadedRegistrations = null;
let loadedFileName = 'registrations.json';
let lastRegistrationIntent = null;

const SECTION_LABELS = {
  'how-it-works': 'how_it_works',
  builders: 'builders',
  register: 'register_primary',
  evaluation: 'evaluation',
  industry: 'industry',
  faq: 'faq',
  'register-secondary': 'register_secondary',
};

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

function getSource() {
  return typeof window.getAttributionSource === 'function'
    ? window.getAttributionSource()
    : 'direct';
}

function buildRecord(form, instance) {
  const fd = new FormData(form);
  const intent = getRegistrationIntent(instance);
  return {
    form_instance: instance,
    full_name: (fd.get('full_name') || '').trim(),
    email: (fd.get('email') || '').toLowerCase().trim(),
    password: fd.get('password') || null,
    country: fd.get('country') || null,
    consent_given: !!form.querySelector('[name="consent"]').checked,
    registered_at: new Date().toISOString(),
    registration_source: getSource(),
    cta_source: intent.cta_source,
    cta_button_text: intent.cta_button_text,
    cta_section_owner: intent.cta_section_owner,
    cta_target_form: intent.cta_target_form,
    cta_section_context: intent.cta_section_context,
    cta_clicked_at: intent.cta_clicked_at,
  };
}

function getCurrentSectionContext() {
  const probeY = window.scrollY + (window.innerHeight * 0.35);
  let bestId = 'top';
  let bestTop = -Infinity;

  Object.keys(SECTION_LABELS).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop;
    if (top <= probeY && top > bestTop) {
      bestTop = top;
      bestId = id;
    }
  });

  if (bestId === 'top') return 'header';
  return SECTION_LABELS[bestId] || bestId;
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
  if (href === '#register' || href === '#register-secondary') {
    return `${sectionId}_${text || 'register_link'}`;
  }
  return null;
}

function resolveSectionOwner(link) {
  const section = link.closest('section[id], header, footer');
  if (!section) return 'page';
  if (section.tagName.toLowerCase() === 'header') return 'header';

  const id = section.id;
  if (id === 'how-it-works') return 'how_it_works';
  if (id === 'builders') return 'builders';
  if (id === 'evaluation') return 'evaluation';
  if (id === 'industry') return 'industry';
  if (id === 'faq') return 'faq';
  if (id === 'register') return 'register_primary';
  if (id === 'register-secondary') return 'register_secondary';
  return id || 'page';
}

function resolveTargetForm(link) {
  const href = link.getAttribute('href');
  if (href === '#register') return 'primary';
  if (href === '#register-secondary') return 'secondary';
  return null;
}

function resolveButtonText(link) {
  return (link.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function captureRegistrationIntent(link) {
  const ctaSource = resolveCtaSource(link);
  if (!ctaSource) return;

  lastRegistrationIntent = {
    cta_source: ctaSource,
    cta_button_text: resolveButtonText(link),
    cta_section_owner: resolveSectionOwner(link),
    cta_target_form: resolveTargetForm(link),
    cta_section_context: getCurrentSectionContext(),
    cta_clicked_at: new Date().toISOString(),
  };
}

function getRegistrationIntent(instance) {
  if (lastRegistrationIntent) return lastRegistrationIntent;
  return {
    cta_source: instance === 'primary' ? 'direct_form_primary' : 'direct_form_secondary',
    cta_button_text: 'Register',
    cta_section_owner: instance === 'primary' ? 'register_primary' : 'register_secondary',
    cta_target_form: instance,
    cta_section_context: getCurrentSectionContext(),
    cta_clicked_at: null,
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
  document.querySelectorAll('a[href="#register"], a[href="#register-secondary"]').forEach((link) => {
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
