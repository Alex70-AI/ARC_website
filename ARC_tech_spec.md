# ARC Website — Technical Specification

**Stage 4 Deliverable**
**Site:** ai-agents-challenge.digital
**Format:** Single-page static HTML/JS/CSS, no framework, no build step
**Date:** April 2026
**Depends on:** ARC_content_architecture_spec_v2.md, ARC_registration_form_spec.md

---

## Quick Reference

| Item | Value |
|---|---|
| Primary domain | ai-agents-challenge.digital |
| Stack | Static HTML + Vanilla JS + CSS (no framework, no build step) |
| Hosting | DigitalOcean (see Section 10 for platform recommendation) |
| Backend | Python (FastAPI) — serves static files and handles form POST |
| Storage | `registrations.json` → migrates to platform DB at Stage 7 |
| Performance target | Lighthouse ≥ 90 on mobile |
| Phase A | Local prototype — no server, runs by opening `index.html` |
| Phase B | Deployed site — server, HTTPS, password hashing, bot mitigation |

---

## Contents

1. [File Structure](#1-file-structure)
2. [Sticky Header and Scroll-Aware Navigation](#2-sticky-header-and-scroll-aware-navigation)
3. [Collapsible Content Blocks](#3-collapsible-content-blocks)
4. [Registration Form Implementation](#4-registration-form-implementation)
5. [Form Submission Backend](#5-form-submission-backend)
6. [Analytics](#6-analytics)
7. [OG / Social Preview Metadata](#7-og--social-preview-metadata)
8. [Anchor Navigation and Entry URLs](#8-anchor-navigation-and-entry-urls)
9. [Responsive Behavior](#9-responsive-behavior)
10. [Build and Deploy](#10-build-and-deploy)

---

## 1. File Structure

No framework. No build step. No `node_modules`. The site is a directory of files that can be opened in a browser or served by any HTTP server.

### Phase A — Local Prototype

```
arc-website/
├── index.html              # Single page (all sections)
├── css/
│   ├── base.css            # Custom properties, reset, typography
│   ├── layout.css          # Grid, flexbox, section spacing
│   ├── components.css      # Header, forms, collapsibles, accordions
│   └── responsive.css      # Media queries (mobile-first breakpoints)
├── js/
│   ├── nav.js              # Sticky header, scroll-aware CTA, hamburger
│   ├── collapsibles.js     # <details> polyfill behavior, analytics hooks
│   ├── form.js             # Validation, Phase A JSON logging
│   ├── analytics.js        # Lightweight event tracker (Phase A: no-op stubs)
│   └── scroll.js           # Hash anchor on load, smooth scroll, attribution
├── assets/
│   ├── logo.svg            # ARC wordmark (placeholder acceptable for Stage 5)
│   ├── og-image.png        # 1200×630px OG card for social preview
│   └── partner-logos/      # Partner logo files (placeholder slots for Stage 5)
│       └── placeholder.svg
├── registrations.json      # Phase A only — local submission log (gitignored)
├── .gitignore
└── README.md               # Setup instructions
```

**`.gitignore` must include:**
```
registrations.json
```

**Local development:** Open `index.html` directly in a browser. No server required in Phase A. All assets use relative paths. `registrations.json` is written by the Phase A JS form handler (see Section 4).

> **Note on Phase A `registrations.json` writing:** Modern browsers block JS from writing to local files due to security restrictions. Phase A uses a download-based workaround: on form submission, JS constructs the updated JSON array and triggers a file download with the filename `registrations.json`, prompting the user to save it to the project folder. This preserves the "no server" contract while making the data inspectable. Stage 5 build notes should document this approach clearly. Alternatively, Phase A can write to `localStorage` and display submissions in the browser console/DOM — simpler for iteration.

### Phase B — Deployed Site

Extends Phase A with a backend directory:

```
arc-website/
├── index.html
├── css/                    # (same as Phase A)
├── js/
│   ├── nav.js
│   ├── collapsibles.js
│   ├── form.js             # Updated: POST to /register instead of local log
│   ├── analytics.js        # Updated: live event tracking
│   └── scroll.js
├── assets/
├── server/
│   ├── main.py             # FastAPI application (static files + /register endpoint)
│   ├── requirements.txt    # fastapi, uvicorn, python-multipart, bcrypt, slowapi
│   └── registrations.json  # Written by server (gitignored)
├── .gitignore
└── README.md
```

The FastAPI server in `server/main.py` mounts the root directory as static files and adds a single POST route at `/register`. One process handles both static file serving and form submissions.

---

## 2. Sticky Header and Scroll-Aware Navigation

### Behavior Specification

**Always visible:** The header is `position: sticky; top: 0;` on both desktop and mobile. It remains visible through the entire scroll.

**Desktop layout:**
- Left: ARC logo/wordmark
- Center/Right: Nav links — "How It Works" (`#how-it-works`), "For AI Builders" (`#builders`), "For Industry" (`#industry`), "FAQ" (`#faq`)
- Far right: "Register" button (primary CTA)

**Mobile layout:**
- Left: ARC logo/wordmark
- Right: "Register" button (always visible — not inside hamburger) + hamburger icon
- Hamburger opens a full-overlay or drawer with the four nav links. Tapping any link closes the overlay and smooth-scrolls to target.

### Scroll-Aware "Register" Button

The "Register" button in the header must link to the **nearest registration form instance** based on scroll position. There are two form instances:
- Section 6 (primary): anchor `#register`
- Section 10 (secondary): anchor `#register-secondary`

**Logic:**

```js
// nav.js
function getNearestFormAnchor() {
  const secondaryForm = document.getElementById('register-secondary');
  if (!secondaryForm) return '#register';
  const rect = secondaryForm.getBoundingClientRect();
  // If secondary form has been scrolled past (top is above viewport), 
  // user is at/near the bottom — link back to primary.
  // If secondary form is below viewport, primary is closer.
  // Switch point: when the user is past the midpoint between the two forms.
  const switchEl = document.getElementById('register-switch-point');
  if (switchEl && switchEl.getBoundingClientRect().top < 0) {
    return '#register-secondary';
  }
  return '#register';
}

// Add a hidden sentinel element between Sections 7 and 8 in HTML:
// <div id="register-switch-point"></div>
// When this element scrolls above the viewport, switch to secondary form.

document.querySelector('.nav-register-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const anchor = getNearestFormAnchor();
  smoothScrollToId(anchor.replace('#', ''));
});
```

The switch point sentinel is placed between the evaluation section (7) and the enterprise section (8) in `index.html`. Once the user has scrolled past this point, the header "Register" button targets the secondary form. Before it, it targets the primary form.

### Smooth Scroll

All anchor links use JS smooth scroll for in-app browser compatibility (see Section 8):

```js
// scroll.js
function smoothScrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    if (!id || id.startsWith('t') || id.startsWith('li')) return; // attribution anchors handled elsewhere
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      smoothScrollToId(id);
    }
  });
});
```

### Mobile Hamburger Implementation

```html
<!-- In <header> -->
<button class="hamburger" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav">
  <span></span><span></span><span></span>
</button>
<nav id="mobile-nav" class="mobile-nav" aria-hidden="true">
  <a href="#how-it-works">How It Works</a>
  <a href="#builders">For AI Builders</a>
  <a href="#industry">For Industry</a>
  <a href="#faq">FAQ</a>
</nav>
```

```js
// nav.js
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
  document.body.classList.toggle('nav-open', isOpen); // prevents scroll behind overlay
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
```

---

## 3. Collapsible Content Blocks

### Approach: Native `<details>` / `<summary>`

All collapsible blocks use `<details>` / `<summary>`. This is the required approach per the v2 spec. Reasons: no JS required to function, works in Telegram's in-app browser, works with screen readers, collapsed content is in the DOM (SEO-safe, anchor-linkable).

**Telegram in-app browser compatibility:** Native `<details>` is supported in Telegram's in-app browser (WebKit-based on iOS, Chrome-based on Android). No polyfill required. Test explicitly in Stage 5.

### Collapsible Inventory (from v2 spec)

| Section | Block | Trigger Label | Default State |
|---|---|---|---|
| 4c | Task Examples | "See example tasks" | Collapsed (both desktop and mobile) |
| 7b | Detailed Evaluation Criteria | "See how scoring works" | Collapsed (both desktop and mobile) |
| 8d | Enterprise Participation Modes | "See all participation options" | Collapsed (both desktop and mobile) |
| 9 | FAQ answers | Question text (each `<summary>`) | Collapsed (questions always visible) |

### HTML Pattern

```html
<!-- Section 4c — Task Examples -->
<details class="collapsible" id="task-examples">
  <summary class="collapsible__trigger">
    See example tasks
    <span class="collapsible__icon" aria-hidden="true"></span>
  </summary>
  <div class="collapsible__body">
    <!-- content here -->
  </div>
</details>

<!-- Section 9 — FAQ accordion item -->
<details class="faq-item" id="faq-1">
  <summary class="faq-item__question">
    Do I need oil &amp; gas industry experience?
  </summary>
  <div class="faq-item__answer">
    <p>No. Firmly no...</p>
  </div>
</details>
```

### CSS

```css
/* components.css */
details.collapsible summary {
  cursor: pointer;
  list-style: none; /* removes default marker */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

details.collapsible summary::-webkit-details-marker { display: none; }

.collapsible__icon::after {
  content: '+';
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

details[open] .collapsible__icon::after {
  content: '−';
}

.collapsible__body {
  /* Smooth height transition — progressive enhancement */
  overflow: hidden;
}

/* Smooth open animation (CSS only, no JS needed) */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
details[open] .collapsible__body {
  animation: fadeIn 0.2s ease;
}
```

### Analytics Hooks (via JS)

```js
// collapsibles.js
document.querySelectorAll('details[id]').forEach(el => {
  el.addEventListener('toggle', () => {
    if (el.open) {
      trackEvent('collapsible_open', { block_id: el.id });
    }
  });
});
```

`trackEvent` is a wrapper defined in `analytics.js` (no-op stub in Phase A, live in Phase B).

---

## 4. Registration Form Implementation

### Section 10 Compact Form — Field Recommendation

The v2 spec leaves the Section 10 field subset as a recommendation for Stage 4. **Recommendation: name + email only**, with a visible note beneath the submit button: *"You'll set a password when warm-up access opens — we'll email you."*

**Rationale:** Section 10 serves late-deciding builders and enterprise visitors directed from Section 8e. Both groups are in a lower-friction mindset at this point. Removing the password field reduces the form to two fields and a checkbox — register in under 15 seconds. The password is not needed until platform onboarding; collecting it here only because the primary form does so is not sufficient justification for the friction cost. Phase B handles password-less Section 10 registrations by sending a set-password email when warm-up opens.

**Section 10 fields:**
- Full name (required, text)
- Email (required, email)
- Consent checkbox (required)
- Submit button

**Section 6 fields (full form):**
- Full name (required, text)
- Email (required, email)
- Password (required, password, min 8 chars)
- Country (optional, searchable dropdown, ISO 3166-1 + "Prefer not to say")
- Consent checkbox (required)
- Submit button

### HTML Structure — Section 6 (Primary Form)

```html
<section id="register" class="section section--form">
  <h2 class="section__heading">Ready to test your agent?</h2>
  <p class="section__subtext">Free to enter. Any framework, any language. Warm-up starts [date].</p>

  <form id="form-primary" class="reg-form" novalidate data-form-instance="primary">
    <!-- Honeypot — Phase B only, include in HTML from Phase A so it's always there -->
    <div class="honeypot-wrapper" aria-hidden="true">
      <input type="text" name="website" tabindex="-1" autocomplete="off">
    </div>
    <!-- Timing field — populated by JS on form render -->
    <input type="hidden" name="form_rendered_at" id="form-primary-rendered-at">

    <div class="form-field">
      <label for="name-primary">Full name <span aria-hidden="true">*</span></label>
      <input type="text" id="name-primary" name="full_name" required
             autocomplete="name" minlength="2"
             aria-describedby="name-primary-error">
      <span class="field-error" id="name-primary-error" role="alert" aria-live="polite"></span>
    </div>

    <div class="form-field">
      <label for="email-primary">Email <span aria-hidden="true">*</span></label>
      <input type="email" id="email-primary" name="email" required
             autocomplete="email"
             aria-describedby="email-primary-error">
      <span class="field-error" id="email-primary-error" role="alert" aria-live="polite"></span>
    </div>

    <div class="form-field">
      <label for="password-primary">Password <span aria-hidden="true">*</span></label>
      <input type="password" id="password-primary" name="password" required
             minlength="8" autocomplete="new-password"
             aria-describedby="password-primary-hint password-primary-error">
      <span class="field-hint" id="password-primary-hint">Minimum 8 characters</span>
      <span class="field-error" id="password-primary-error" role="alert" aria-live="polite"></span>
    </div>

    <div class="form-field">
      <label for="country-primary">Country <span class="optional-label">(optional)</span></label>
      <select id="country-primary" name="country" autocomplete="country">
        <option value="">Select country</option>
        <option value="prefer-not">Prefer not to say</option>
        <!-- ISO 3166-1 country list inserted here — see Section 4 note -->
      </select>
    </div>

    <div class="form-field form-field--consent">
      <label class="consent-label">
        <input type="checkbox" name="consent" required id="consent-primary"
               aria-describedby="consent-primary-error">
        <span>I agree to the processing of my data as described in the
          <button type="button" class="privacy-toggle" aria-expanded="false"
                  aria-controls="privacy-notice-primary">Privacy Notice</button>
          to participate in the Agents Reliability Challenge.
        </span>
      </label>
      <span class="field-error" id="consent-primary-error" role="alert" aria-live="polite"></span>
    </div>

    <!-- Privacy notice — expandable, inline, no page navigation -->
    <div id="privacy-notice-primary" class="privacy-notice" hidden>
      <!-- Full privacy notice text from ARC_registration_form_spec.md Section 2 -->
    </div>

    <button type="submit" class="btn btn--primary btn--full-width" id="submit-primary">
      Register
    </button>
  </form>

  <!-- Confirmation message — hidden until submission -->
  <div id="confirm-primary" class="submission-confirm" hidden role="status" aria-live="polite">
    <h3>You're registered.</h3>
    <p>Check your email (<strong id="confirm-email-primary"></strong>) for a confirmation with next steps.</p>
    <nav class="post-register-links">
      <a href="[discord-url]" class="btn btn--secondary" target="_blank" rel="noopener">Join the Discord →</a>
      <a href="[github-url]" class="btn btn--secondary" target="_blank" rel="noopener">Explore the SDK on GitHub →</a>
    </nav>
  </div>

  <!-- Activation links — visible before submission -->
  <div class="activation-links" id="activation-links-primary">
    <a href="[discord-url]" class="activation-link" target="_blank" rel="noopener">
      Join the Discord →
      <span class="activation-link__desc">Ask questions, form teams, get help during warm-up.</span>
    </a>
    <a href="[github-url]" class="activation-link" target="_blank" rel="noopener">
      Explore the SDK &amp; starter templates on GitHub →
      <span class="activation-link__desc">Python SDK, example agent, documentation, starter templates for popular frameworks.</span>
    </a>
  </div>
</section>
```

**Country dropdown note:** The ISO 3166-1 country list is ~250 entries. Include it as a `<datalist>` or a `<select>` with all options hardcoded in HTML — no JS-loaded external file. Searchable behavior: on desktop, native `<select>` filter-as-you-type is not universally available. Implement a simple JS-powered searchable dropdown (custom `<input>` + `<ul>` listbox pattern, ~50 lines) or use the native `<select>` with "Prefer not to say" at top. For Phase A, native `<select>` is sufficient. For Phase B, upgrade to the searchable pattern if UX testing shows friction.

### Section 10 (Secondary/Compact Form)

Same structural pattern as Section 6 but with only name, email, consent, and submit. No password field. No country dropdown.

```html
<section id="register-secondary" class="section section--form section--form-compact">
  <h2 class="section__heading">Don't miss Edition 1.</h2>
  <p class="section__subtext">Join 100+ builders testing agents under real constraints.</p>

  <form id="form-secondary" class="reg-form reg-form--compact" novalidate data-form-instance="secondary">
    <div class="honeypot-wrapper" aria-hidden="true">
      <input type="text" name="website" tabindex="-1" autocomplete="off">
    </div>
    <input type="hidden" name="form_rendered_at" id="form-secondary-rendered-at">

    <div class="form-field">
      <label for="name-secondary">Full name <span aria-hidden="true">*</span></label>
      <input type="text" id="name-secondary" name="full_name" required
             autocomplete="name" minlength="2"
             aria-describedby="name-secondary-error">
      <span class="field-error" id="name-secondary-error" role="alert" aria-live="polite"></span>
    </div>

    <div class="form-field">
      <label for="email-secondary">Email <span aria-hidden="true">*</span></label>
      <input type="email" id="email-secondary" name="email" required
             autocomplete="email"
             aria-describedby="email-secondary-error">
      <span class="field-error" id="email-secondary-error" role="alert" aria-live="polite"></span>
    </div>

    <div class="form-field form-field--consent">
      <label class="consent-label">
        <input type="checkbox" name="consent" required id="consent-secondary"
               aria-describedby="consent-secondary-error">
        <span>I agree to the processing of my data as described in the
          <button type="button" class="privacy-toggle" aria-expanded="false"
                  aria-controls="privacy-notice-secondary">Privacy Notice</button>
          to participate in the Agents Reliability Challenge.
        </span>
      </label>
      <span class="field-error" id="consent-secondary-error" role="alert" aria-live="polite"></span>
    </div>

    <div id="privacy-notice-secondary" class="privacy-notice" hidden>
      <!-- Same privacy notice text -->
    </div>

    <button type="submit" class="btn btn--primary btn--full-width" id="submit-secondary">
      Register
    </button>
    <p class="form-note">You'll set a password when warm-up access opens — we'll email you.</p>
  </form>

  <div id="confirm-secondary" class="submission-confirm" hidden role="status" aria-live="polite">
    <h3>You're registered.</h3>
    <p>Check your email (<strong id="confirm-email-secondary"></strong>) for a confirmation with next steps.</p>
    <!-- same post-register links -->
  </div>
</section>
```

### Client-Side Validation (Both Phases)

```js
// form.js

const VALIDATORS = {
  full_name: (v) => v.trim().length >= 2 ? null : 'Enter your full name (minimum 2 characters).',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Enter a valid email address.',
  password: (v) => v.length >= 8 ? null : 'Password must be at least 8 characters.',
  consent: (v, el) => el.checked ? null : 'You must agree to the Privacy Notice to register.',
};

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[name]').forEach(field => {
    if (!VALIDATORS[field.name]) return;
    const error = VALIDATORS[field.name](field.value, field);
    const errorEl = form.querySelector(`#${field.id}-error`) ||
                    form.querySelector(`[id$="${field.name}-error"]`);
    if (errorEl) errorEl.textContent = error || '';
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (error) valid = false;
  });
  return valid;
}
```

### Privacy Notice Toggle

```js
// form.js
document.querySelectorAll('.privacy-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const notice = document.getElementById(btn.getAttribute('aria-controls'));
    const isHidden = notice.hasAttribute('hidden');
    if (isHidden) {
      notice.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      notice.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});
```

### Phase A — Form Submission Handler

In Phase A there is no server. On submit, JS validates fields and either:
- (Preferred for iteration) Writes the record to `localStorage` under the key `arc_registrations`, and displays the confirmation message on-page. An optional debug panel can render all `localStorage` submissions during development.
- (Alternative) Triggers a JSON file download.

```js
// form.js — Phase A submission handler
function handleSubmitPhaseA(form, event) {
  event.preventDefault();
  if (!validateForm(form)) return;

  const instance = form.dataset.formInstance; // 'primary' or 'secondary'
  const data = buildRecord(form, instance);

  // Append to localStorage
  const existing = JSON.parse(localStorage.getItem('arc_registrations') || '[]');
  existing.push(data);
  localStorage.setItem('arc_registrations', JSON.stringify(existing, null, 2));

  showConfirmation(form, data.email);
  trackEvent('form_submit', { instance, phase: 'A' });
}

function buildRecord(form, instance) {
  const fd = new FormData(form);
  return {
    form_instance: instance,
    full_name: fd.get('full_name'),
    email: (fd.get('email') || '').toLowerCase().trim(),
    password: fd.get('password') || null, // plaintext — Phase A local only
    country: fd.get('country') || null,
    consent_given: !!form.querySelector('[name="consent"]').checked,
    registered_at: new Date().toISOString(),
    registration_source: getAttributionSource(),
  };
}

function showConfirmation(form, email) {
  const confirmId = `confirm-${form.dataset.formInstance}`;
  const confirmEl = document.getElementById(confirmId);
  const emailEl = confirmEl.querySelector('[id$="confirm-email-primary"], [id$="confirm-email-secondary"]');
  if (emailEl) emailEl.textContent = email;
  form.setAttribute('hidden', '');
  confirmEl.removeAttribute('hidden');
  const activationLinks = document.getElementById(`activation-links-${form.dataset.formInstance}`);
  if (activationLinks) activationLinks.setAttribute('hidden', '');
}
```

**JSON record structure (Phase A, matches form spec Section 3):**
```json
{
  "form_instance": "primary",
  "full_name": "Jane Smith",
  "email": "jane@example.com",
  "password": "plaintexthere",
  "country": "GB",
  "consent_given": true,
  "registered_at": "2026-04-08T14:23:00.000Z",
  "registration_source": "telegram"
}
```

> **Phase A password note:** Password stored in plaintext in `localStorage` or downloaded JSON. This is acceptable for local design iteration only. The `localStorage` data is cleared when the developer wants a clean slate (`localStorage.clear()`). Never deploy Phase A form handling to a public server.

### Phase B — Form Submission Handler

```js
// form.js — Phase B submission handler (replaces Phase A handler)
async function handleSubmitPhaseB(form, event) {
  event.preventDefault();
  if (!validateForm(form)) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering…';

  const instance = form.dataset.formInstance;
  const fd = new FormData(form);
  const payload = {
    full_name: fd.get('full_name'),
    email: (fd.get('email') || '').toLowerCase().trim(),
    password: fd.get('password') || null,
    country: fd.get('country') || null,
    consent: !!form.querySelector('[name="consent"]').checked,
    form_rendered_at: fd.get('form_rendered_at'),
    website: fd.get('website'), // honeypot
    registration_source: getAttributionSource(),
    form_instance: instance,
  };

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showConfirmation(form, payload.email);
      trackEvent('form_submit', { instance, phase: 'B' });
    } else {
      const errorData = await res.json().catch(() => ({}));
      handleServerError(form, res.status, errorData);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register';
    }
  } catch (err) {
    showFormError(form, 'network', 'Couldn\'t reach the server. Check your connection and try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
}

function handleServerError(form, status, data) {
  const messages = {
    409: 'This email is already registered.',
    422: data.detail || 'Please check your details and try again.',
    429: 'Too many registration attempts. Please try again in a few minutes.',
  };
  const msg = messages[status] || 'Something went wrong. Please try again.';
  showFormError(form, 'server', msg);
}
```

### Timing Field (Phase B)

```js
// form.js — set form_rendered_at on page load
document.querySelectorAll('.reg-form').forEach(form => {
  const field = form.querySelector('[name="form_rendered_at"]');
  if (field) field.value = Date.now().toString();
});
```

---

## 5. Form Submission Backend

**Phase A: No backend.** All submission handling is client-side JS (Section 4).

### Phase B — FastAPI Server

**Stack:** Python 3.11+, FastAPI, Uvicorn, bcrypt, slowapi (rate limiting), python-multipart.

**Single process serves static files and handles POST `/register`.**

#### `server/requirements.txt`

```
fastapi==0.110.0
uvicorn[standard]==0.29.0
bcrypt==4.1.2
slowapi==0.1.9
python-multipart==0.0.9
```

#### `server/main.py`

```python
import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import bcrypt
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, field_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# ── Configuration ────────────────────────────────────────────────────────────

REGISTRATIONS_FILE = Path(__file__).parent / "registrations.json"
STATIC_DIR = Path(__file__).parent.parent  # serves index.html from project root
MIN_FORM_SECONDS = 3  # submissions faster than this are rejected silently
BCRYPT_ROUNDS = 12

# ── Rate limiter ──────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Request model ─────────────────────────────────────────────────────────────

class RegistrationRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: Optional[str] = None
    country: Optional[str] = None
    consent: bool
    form_rendered_at: Optional[str] = None  # JS timestamp (ms since epoch)
    website: Optional[str] = None           # honeypot field
    registration_source: Optional[str] = None
    form_instance: Optional[str] = "primary"

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("full_name must be at least 2 characters")
        return v.strip()

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, v):
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def password_length(cls, v):
        if v is not None and len(v) < 8:
            raise ValueError("password must be at least 8 characters")
        return v

# ── File locking ──────────────────────────────────────────────────────────────

import threading
_file_lock = threading.Lock()

def read_registrations() -> list:
    if not REGISTRATIONS_FILE.exists():
        return []
    with open(REGISTRATIONS_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def write_registrations(records: list) -> None:
    with open(REGISTRATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

# ── Registration endpoint ─────────────────────────────────────────────────────

@app.post("/register")
@limiter.limit("5/hour;10/day")
async def register(request: Request, body: RegistrationRequest):

    # Bot mitigation Layer 1: Honeypot
    if body.website:
        # Silent fake success — do not reveal rejection
        return JSONResponse(status_code=200, content={"status": "ok"})

    # Bot mitigation Layer 2: Submission timing
    if body.form_rendered_at:
        try:
            rendered_ms = int(body.form_rendered_at)
            elapsed_s = (datetime.now(timezone.utc).timestamp() * 1000 - rendered_ms) / 1000
            if elapsed_s < MIN_FORM_SECONDS:
                return JSONResponse(status_code=200, content={"status": "ok"})
        except (ValueError, OverflowError):
            pass  # malformed timestamp — proceed normally

    # Consent required
    if not body.consent:
        raise HTTPException(status_code=422, detail="Consent is required.")

    # Password hashing (None for compact form — Section 10)
    password_hash = None
    if body.password:
        password_hash = bcrypt.hashpw(
            body.password.encode("utf-8"),
            bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
        ).decode("utf-8")

    now = datetime.now(timezone.utc).isoformat()
    client_ip = get_remote_address(request)

    new_record = {
        "id": str(uuid.uuid4()),
        "full_name": body.full_name,
        "email": body.email,
        "password_hash": password_hash,
        "country": body.country or None,
        "consent_given": True,
        "consent_timestamp": now,
        "registered_at": now,
        "ip_address": client_ip,
        "registration_source": body.registration_source,
        "form_instance": body.form_instance,
        "email_confirmed": False,
    }

    with _file_lock:
        records = read_registrations()

        # Check for duplicate email
        for r in records:
            if r.get("email") == body.email:
                raise HTTPException(
                    status_code=409,
                    detail="This email is already registered."
                )

        records.append(new_record)
        write_registrations(records)

    return JSONResponse(status_code=200, content={"status": "ok"})

# ── Static file serving ───────────────────────────────────────────────────────

# Mount static files AFTER routes so /register is matched first
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
```

#### Running Phase B Locally

```bash
cd arc-website/server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Site available at http://localhost:8000
```

### JSON Schema — DB Migration Readiness (Stage 7)

The `registrations.json` record structure maps cleanly to a relational table. The fields are designed for zero-ambiguity migration at Stage 7:

| JSON Field | SQL Column | Type | Notes |
|---|---|---|---|
| `id` | `id` | UUID / VARCHAR(36) | Primary key |
| `full_name` | `full_name` | TEXT | UTF-8, no normalization |
| `email` | `email` | VARCHAR(255) | UNIQUE constraint |
| `password_hash` | `password_hash` | TEXT | bcrypt / argon2 hash, or NULL |
| `country` | `country` | CHAR(2) | ISO 3166-1 alpha-2 or NULL |
| `consent_given` | `consent_given` | BOOLEAN | Always TRUE (required) |
| `consent_timestamp` | `consent_timestamp` | TIMESTAMP WITH TIME ZONE | UTC |
| `registered_at` | `registered_at` | TIMESTAMP WITH TIME ZONE | UTC |
| `ip_address` | `ip_address` | VARCHAR(45) | IPv4/IPv6. Delete/anonymize after 30 days |
| `registration_source` | `registration_source` | VARCHAR(100) | UTM/anchor attribution |
| `form_instance` | `form_instance` | VARCHAR(20) | 'primary' or 'secondary' |
| `email_confirmed` | `email_confirmed` | BOOLEAN | Default FALSE |

**Stage 7 migration note:** Export `registrations.json` as-is, parse into the above schema. The `id` field (UUID) can become the platform's user ID directly. `password_hash` values generated with bcrypt are directly usable in any bcrypt-compatible auth system. No transformation required.

### File Locking Note

The Python `threading.Lock()` above is sufficient for a single Uvicorn worker process. For multi-worker deployments (e.g., `uvicorn --workers 4`), replace with filesystem-level locking (`fcntl.flock` on Linux, `msvcrt.locking` on Windows) or use a `multiprocessing.Lock`. For the expected registration volume (100–300 submissions), a single worker is sufficient and recommended.

---

## 6. Analytics

### Phase A

All `trackEvent` calls are no-op stubs. No analytics library loaded in Phase A. This keeps Phase A self-contained and avoids network dependencies.

```js
// analytics.js — Phase A
window.ARC = window.ARC || {};
window.ARC.trackEvent = function(name, props) {
  console.debug('[analytics stub]', name, props);
};
function trackEvent(name, props) {
  window.ARC.trackEvent(name, props);
}
```

### Phase B — Implementation

**Library choice: Plausible Analytics (self-hosted or cloud)**

- Script size: ~1KB (well under the 10KB limit from the v2 spec)
- No cookies, GDPR-compliant out of the box
- Custom event support via `plausible()` function
- Works with CSP; no cross-origin data sharing

**Alternative:** A custom 50-line event beacon to a server endpoint (if Plausible adds operational overhead). The custom approach sends a `POST /analytics` payload with event name + properties. Simpler, but requires log analysis instead of a dashboard.

**Plausible integration:**

```html
<!-- In <head> — Phase B only -->
<script defer data-domain="ai-agents-challenge.digital"
        src="https://plausible.io/js/script.tagged-events.js"></script>
```

```js
// analytics.js — Phase B
function trackEvent(name, props) {
  if (typeof plausible === 'function') {
    plausible(name, { props });
  }
}
```

### Analytics Anchor Points

Every event below must fire in Phase B. Events are organized by source.

#### Page Load Events

| Event | When | Properties |
|---|---|---|
| `page_load` | On `DOMContentLoaded` | `{ source: getAttributionSource(), has_anchor: !!location.hash }` |
| `industry_direct_landing` | On load, if `location.hash === '#industry'` | `{ source: getAttributionSource() }` |

#### Scroll Depth Events (Intersection Observer)

Fire once per page load when each section first enters the viewport. Do not re-fire on scroll back.

| Event | Trigger Element |
|---|---|
| `section_view_how_it_works` | `#how-it-works` |
| `section_view_builders` | `#builders` |
| `section_view_register_primary` | `#register` |
| `section_view_evaluation` | `#evaluation` |
| `section_view_industry` | `#industry` |
| `section_view_faq` | `#faq` |
| `section_view_register_secondary` | `#register-secondary` |

```js
// analytics.js
const SECTION_EVENTS = {
  'how-it-works': 'section_view_how_it_works',
  'builders': 'section_view_builders',
  'register': 'section_view_register_primary',
  'evaluation': 'section_view_evaluation',
  'industry': 'section_view_industry',
  'faq': 'section_view_faq',
  'register-secondary': 'section_view_register_secondary',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (SECTION_EVENTS[id]) {
        trackEvent(SECTION_EVENTS[id], { source: getAttributionSource() });
        observer.unobserve(entry.target); // fire once only
      }
    }
  });
}, { threshold: 0.3 }); // 30% of section in viewport

Object.keys(SECTION_EVENTS).forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
```

#### Click Events

| Event | Trigger | Properties |
|---|---|---|
| `nav_register_click` | Header "Register" button | `{ target_form: 'primary' or 'secondary' }` |
| `soft_cta_click` | Section 7d inline text link | `{}` |
| `enterprise_cta_click` | Section 8e "Register Your Team" button | `{}` |
| `discord_link_click` | Any Discord link | `{ location: 'form_primary' / 'form_secondary' / 'confirm' }` |
| `github_link_click` | Any GitHub link | `{ location: 'form_primary' / 'form_secondary' / 'confirm' }` |

#### Form Events

| Event | Trigger | Properties |
|---|---|---|
| `form_submit` | Successful submission (client-side, before server response) | `{ instance: 'primary'/'secondary', phase: 'A'/'B' }` |
| `form_submit_success` | 2xx server response (Phase B only) | `{ instance: 'primary'/'secondary' }` |
| `form_submit_error` | Non-2xx or network failure (Phase B only) | `{ instance, status_code }` |

#### Collapsible Events

| Event | Trigger | Properties |
|---|---|---|
| `collapsible_open` | Any `<details>` element opens | `{ block_id: element id }` |

Block IDs: `task-examples`, `evaluation-detail`, `participation-modes`, `faq-1` through `faq-10`.

### UTM Capture and Fallback Attribution

Telegram, WhatsApp, and LinkedIn direct messages strip URL parameters. The analytics approach must support both UTM-based and anchor-based attribution.

```js
// scroll.js / analytics.js
function getAttributionSource() {
  // Priority order: UTM source > channel anchor > referrer > 'direct'
  const params = new URLSearchParams(location.search);
  if (params.get('utm_source')) {
    return params.get('utm_source');
  }

  // Attribution anchors: /#t = Telegram, /#li = LinkedIn
  // These are set server-side in short URLs and must not conflict with section anchors
  const hash = location.hash.replace('#', '');
  const ATTRIBUTION_ANCHORS = { t: 'telegram', li: 'linkedin', wa: 'whatsapp', hn: 'hackernews' };
  if (ATTRIBUTION_ANCHORS[hash]) {
    return ATTRIBUTION_ANCHORS[hash];
  }

  if (document.referrer) {
    const ref = new URL(document.referrer).hostname;
    if (ref.includes('t.me') || ref.includes('telegram')) return 'telegram';
    if (ref.includes('linkedin.com')) return 'linkedin';
    if (ref.includes('reddit.com')) return 'reddit';
    if (ref.includes('news.ycombinator.com')) return 'hackernews';
    if (ref.includes('twitter.com') || ref.includes('x.com')) return 'twitter';
  }

  return 'direct';
}
```

**Attribution anchor implementation (see also Section 8):** Short URLs for distribution channels:
- `ai-agents-challenge.digital/#t` → Telegram distribution
- `ai-agents-challenge.digital/#li` → LinkedIn distribution
- `ai-agents-challenge.digital/#wa` → WhatsApp distribution
- `ai-agents-challenge.digital/?utm_source=hackernews` → HN post (UTM works here)

The `#t`, `#li`, `#wa` anchors do not scroll — `scroll.js` detects them as attribution anchors and ignores them for scroll purposes. The attribution value is captured at load time and stored in a module-level variable, persisting through the session.

---

## 7. OG / Social Preview Metadata

### Full Meta Tag Set

Place in `<head>` of `index.html`:

```html
<!-- Primary meta -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The first agent challenge that tests whether your agent should act — ARC</title>
<meta name="description" content="Build an agent that operates in a simulated enterprise environment — creating records, enforcing policies, and knowing when to refuse. Scored on accuracy, reliability, and efficiency. Free to enter.">

<!-- Canonical URL -->
<link rel="canonical" href="https://ai-agents-challenge.digital/">

<!-- Open Graph (Facebook, LinkedIn, WhatsApp, Telegram) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://ai-agents-challenge.digital/">
<meta property="og:title" content="The first agent challenge that tests whether your agent should act — not just whether it can.">
<meta property="og:description" content="Build an agent that operates in a simulated enterprise environment. Scored on accuracy, reliability, and efficiency. Free. Any framework, any language.">
<meta property="og:image" content="https://ai-agents-challenge.digital/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Agents Reliability Challenge — ARC. The first agent challenge that tests whether your agent should act — not just whether it can.">
<meta property="og:site_name" content="Agents Reliability Challenge">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="The first agent challenge that tests whether your agent should act — not just whether it can.">
<meta name="twitter:description" content="Build an agent that operates in a simulated enterprise environment. Scored on accuracy, reliability, and efficiency. Free. Any framework, any language.">
<meta name="twitter:image" content="https://ai-agents-challenge.digital/assets/og-image.png">
<meta name="twitter:image:alt" content="Agents Reliability Challenge — ARC">

<!-- Telegram-specific: no additional tags needed. Telegram reads og: tags.
     Critical: og:image must be served over HTTPS with correct Content-Type.
     Recommended: og:image:width and og:image:height must be set (Telegram uses them to avoid fetch). -->
```

### OG Image Specification

| Attribute | Value |
|---|---|
| Dimensions | 1200 × 630 px |
| Format | PNG (preferred over JPEG for text legibility) |
| File size | < 500KB (compress aggressively — Telegram may time out on large images) |
| Content | ARC wordmark/logo, positioning line ("should act — not just whether it can"), challenge name, URL |
| Text minimum size | 32px for readability in card thumbnails |
| Background | High contrast — social card previews render at ~280px wide on mobile |

### Platform-Specific Notes

**Telegram:**
- Renders OG cards inline in chat for links. Reads `og:title`, `og:description`, `og:image`.
- **Aggressive caching.** Once Telegram fetches the OG card for a URL, it caches it. To bust the cache during testing: use Telegram's link preview testing tool (`t.me/webpreview_bot` or the desktop Telegram link preview feature) and append query strings for cache-busting during development (`?v=2`). In production, if the OG image changes post-launch, update the filename (not just the content).
- Image must be served over HTTPS. Telegram will not fetch HTTP images.
- Recommended image size: ≤ 5MB; prefer < 300KB for fast rendering on mobile connections.

**LinkedIn:**
- Reads `og:title`, `og:description`, `og:image`.
- Cache behavior: use LinkedIn's Post Inspector (`linkedin.com/post-inspector/`) to force re-scrape.
- Title and description are truncated in the card. Keep OG title under 90 characters; OG description under 200 characters.

**WhatsApp:**
- Reads `og:title`, `og:description`, `og:image`.
- Strips UTM parameters from shared links — attribution via `#wa` anchor instead.
- No special tags needed beyond standard OG.

**Twitter/X:**
- `twitter:card = summary_large_image` gives the full-width image card.
- Twitter's card validator: `cards-dev.twitter.com/validator` (check before launch).

### OG Title Requirement (from v2 spec)

The OG `title` uses the positioning line, not the brand name. "ARC — Agents Reliability Challenge" is too generic for a social card. The title must front-load the challenge differentiator:

> "The first agent challenge that tests whether your agent should act — not just whether it can."

This is what appears in Telegram message previews and LinkedIn shares. It is the first impression for warm-but-unaware contacts receiving the link. The brand name follows as context (`og:site_name`).

---

## 8. Anchor Navigation and Entry URLs

### Section Anchor Scheme

All section anchors match the v2 spec exactly:

| Section | Anchor ID | Use |
|---|---|---|
| Section 4 (How It Works) | `how-it-works` | Nav link "How It Works" |
| Section 5 (Why Compete) | `builders` | Nav link "For AI Builders" |
| Section 6 (Primary Form) | `register` | Header CTA, soft CTA |
| Section 7 (Evaluation) | `evaluation` | Soft CTA reference |
| Section 8 (Industry) | `industry` | Nav link "For Industry", enterprise distribution URLs |
| Section 9 (FAQ) | `faq` | Nav link "FAQ" |
| Section 10 (Secondary Form) | `register-secondary` | Enterprise CTA (Section 8e), header CTA switch |

**Sentinel (no content, no nav):**

```html
<!-- Placed between Section 7 and Section 8 in HTML -->
<div id="register-switch-point" aria-hidden="true" style="height:0;overflow:hidden;"></div>
```

### `/#industry` Scroll-on-Load Behavior

Enterprise distribution links use `ai-agents-challenge.digital/#industry`. On page load, the browser should scroll to Section 8. Native hash anchor behavior is unreliable in some in-app browsers (Telegram iOS in particular can scroll before images are loaded, landing at the wrong position).

**JS fallback (always active — even where native hash works, this ensures correct position):**

```js
// scroll.js
function handleInitialAnchor() {
  const hash = location.hash.replace('#', '');

  // Attribution anchors — do not scroll
  const ATTRIBUTION_ANCHORS = ['t', 'li', 'wa', 'hn'];
  if (ATTRIBUTION_ANCHORS.includes(hash)) {
    captureAttribution(hash);
    return;
  }

  if (!hash) return;

  // Delay scroll until layout is stable
  // Use requestAnimationFrame x2 to allow browser to complete first paint
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
```

**If double-rAF is insufficient in testing:** Use a `setTimeout(() => { ... }, 100)` fallback. Stage 5 must test this in Telegram iOS in-app browser and LinkedIn in-app browser (both are known problem cases per v2 spec).

### Attribution Anchors

Attribution anchors (`#t`, `#li`, `#wa`, `#hn`) are single-character or two-character fragments that must not match any section ID. Current section IDs (`how-it-works`, `builders`, `register`, `evaluation`, `industry`, `faq`, `register-secondary`) do not conflict.

Do not use `#l` for LinkedIn — it could conflict with future content. Use `#li`.

Do not use `#h` for HN — use `#hn`.

Attribution values are captured at load time:

```js
// scroll.js
let _attributionSource = null;

function captureAttribution(anchorOrUtm) {
  _attributionSource = anchorOrUtm;
}

// Called by getAttributionSource() in analytics.js
window.getAttributionSource = getAttributionSource; // expose for form.js
```

### Short URL Strategy

For channels that strip UTM parameters, create redirect short URLs (301 redirects configured at the hosting level or via a URL shortener under the primary domain):

| Short URL | Destination | Channel |
|---|---|---|
| `ai-agents-challenge.digital/t` | `/#t` | Telegram |
| `ai-agents-challenge.digital/li` | `/#li` | LinkedIn DM/WhatsApp |
| `ai-agents-challenge.digital/industry` | `/#industry` | Enterprise distribution (partner co-promotion) |

These are server-side redirects (Phase B). In Phase A (no server), all links go to the direct URL.

**Phase B short URL redirects in FastAPI:**

```python
from fastapi.responses import RedirectResponse

@app.get("/t")
async def redirect_telegram():
    return RedirectResponse(url="/#t", status_code=301)

@app.get("/li")
async def redirect_linkedin():
    return RedirectResponse(url="/#li", status_code=301)

@app.get("/industry")
async def redirect_industry():
    return RedirectResponse(url="/#industry", status_code=301)
```

### Section 8e Enterprise CTA Behavior

The "Register Your Team" button in Section 8e scrolls **down** to `#register-secondary`. It does not link to `#register` (which is above Section 8). Implementation:

```html
<!-- Section 8e -->
<a href="#register-secondary" class="btn btn--primary enterprise-cta"
   data-track="enterprise_cta_click">
  Register Your Team
</a>
```

The JS smooth-scroll handler (Section 2) handles the click. The `data-track` attribute is picked up by the analytics click event listener.

---

## 9. Responsive Behavior

### Mobile-First Approach

CSS is written mobile-first. Base styles target mobile (≤ 375px viewport). Media queries add desktop adaptations.

**Per v2 spec Principle 3:** Mobile is the primary design target. First-wave traffic arrives via Telegram and LinkedIn on mobile. Desktop is the adaptation.

### Breakpoints

| Name | Value | Use |
|---|---|---|
| `--bp-sm` | 480px | Large mobile / small tablet |
| `--bp-md` | 768px | Tablet / desktop switch |
| `--bp-lg` | 1024px | Wide desktop |
| `--bp-xl` | 1280px | Max content width |

```css
/* responsive.css */
@media (min-width: 768px) { /* desktop adaptations */ }
@media (min-width: 1024px) { /* wide desktop */ }
```

No framework. No grid library. CSS Grid and Flexbox only.

### CSS Custom Properties

All design tokens in `base.css`:

```css
/* base.css */
:root {
  /* Typography */
  --font-primary: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Courier New', Courier, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Colors — to be confirmed by Stage 6 brand/design */
  --color-bg: #ffffff;
  --color-text: #111111;
  --color-text-muted: #555555;
  --color-primary: #0057FF;       /* Adjust to ARC brand */
  --color-primary-hover: #0040CC;
  --color-border: #e0e0e0;
  --color-surface: #f7f7f7;
  --color-error: #CC0000;

  /* Layout */
  --content-max-width: 1200px;
  --section-padding-mobile: var(--space-2xl) var(--space-md);
  --section-padding-desktop: var(--space-3xl) var(--space-xl);

  /* Header */
  --header-height: 60px;
}
```

### Section-Level Responsive Patterns

**Section 3a (2×2 grid of challenge overview blocks):**
```css
/* mobile: single column */
.overview-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-lg); }

@media (min-width: 768px) {
  .overview-grid { grid-template-columns: 1fr 1fr; }
}
```

**Section 4a (How It Works steps):**
```css
/* mobile: stacked cards */
.steps { display: flex; flex-direction: column; gap: var(--space-lg); }

@media (min-width: 768px) {
  .steps { flex-direction: row; }
}
```

**Partner logo bar:**
```css
/* mobile: horizontal scroll or 2-column grid */
.partner-logos {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  justify-content: center;
  align-items: center;
  overflow-x: auto;
}
.partner-logo { height: 40px; width: auto; opacity: 0.7; }

@media (min-width: 768px) {
  .partner-logo { height: 50px; }
}
```

**Section 5 value points:**
```css
/* mobile: stacked vertically */
.value-points { display: flex; flex-direction: column; gap: var(--space-lg); }
```

**Section 7c (Nominations — badge/tag row):**
```css
/* mobile: horizontal scroll */
.nominations { display: flex; gap: var(--space-sm); overflow-x: auto; padding-bottom: var(--space-sm); }
.nomination-badge { flex-shrink: 0; }

@media (min-width: 768px) {
  .nominations { flex-wrap: wrap; overflow-x: visible; }
}
```

**Hero block:**
```css
.hero {
  min-height: 100svh; /* small viewport height — iOS Safari safe */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-2xl) var(--space-md);
}
```

### Form Responsive Behavior

Forms are full-width on all screen sizes. No horizontal scrolling. Minimum tap target: 44px × 44px (WCAG 2.5.5).

```css
.reg-form .form-field input,
.reg-form .form-field select,
.reg-form .btn {
  width: 100%;
  min-height: 44px;
  font-size: var(--text-base); /* prevent iOS auto-zoom on focus */
}
```

> **iOS auto-zoom prevention:** iOS Safari zooms into any `<input>` with `font-size < 16px`. Set `font-size: 16px` (= `var(--text-base)`) on all form inputs. Do not use `user-scalable=no` in the viewport meta tag (accessibility violation).

### Performance

**Lighthouse ≥ 90 on mobile — implementation constraints:**

1. **No render-blocking resources.** All `<script>` tags are `defer` or `async`. No inline `<script>` in `<head>` (except critical-path inline CSS if needed).
2. **CSS is split into files but served as separate requests.** At current file sizes (< 20KB total), HTTP/1.1 connection cost is acceptable. If performance testing shows regression, inline critical CSS in `<head>` and lazy-load the rest.
3. **No web fonts in Phase A.** Use system font stack only. Web fonts (if added in Stage 6) must use `font-display: swap` and be subset to the Latin character set.
4. **Images:** OG image (`assets/og-image.png`) is never rendered in the page — only referenced in meta tags. Partner logos in `assets/partner-logos/` should be SVG (vector, small). Any raster images use the `loading="lazy"` attribute.
5. **No third-party scripts in Phase A.** Analytics (Plausible) loads in Phase B only.
6. **`<link rel="preconnect">` for Phase B:** Add preconnect for the Plausible analytics domain once the domain is known.

---

## 10. Build and Deploy

### Hosting Platform Recommendation: DigitalOcean App Platform

**Decision: App Platform (not a Droplet).**

**Rationale:**

| Factor | App Platform | Droplet |
|---|---|---|
| SSL/TLS | Automatic (Let's Encrypt, managed) | Manual (certbot + cron renewal) |
| Process management | Managed (no PM2/systemd needed) | Manual |
| Deployments | Git push → auto-deploy | SSH + restart |
| DNS | DigitalOcean DNS with App Platform domain management | Manual A record + wait for propagation |
| Cost | ~$5–12/month (Basic plan) | ~$6/month Droplet + time cost of setup |
| Stage 7 migration | App Platform scales to multi-service with minimal reconfiguration | Droplet migration requires service rebuild |

App Platform handles SSL, process management, and rolling deployments without manual intervention. For a lean team, the operational overhead of a Droplet is not justified at this stage. Stage 7 platform integration is easier from App Platform (add a managed database, add more services to the same app).

**Droplet is appropriate if:** the ARC platform itself (Python/JS backend) is already running on a Droplet and co-location simplifies ops. If Stage 7 lands everything on one Droplet, deploy this site there and set up Nginx + PM2/systemd. But for an independent static+server site, App Platform is the right default.

### Phase A — Local Prototype

No deployment. Open `index.html` in Chrome, Safari, or Firefox. Test on mobile by either:
- Using browser DevTools mobile emulation (Lighthouse testing)
- Opening the file via a local server: `python -m http.server 8080` from the project root, then navigating to `http://localhost:8080` on a mobile device on the same network

No server needed for Phase A. Test registration by submitting the form and checking `localStorage` in DevTools.

### Phase B — DigitalOcean App Platform

#### Prerequisites

- DigitalOcean account
- Domain `ai-agents-challenge.digital` registered and nameservers pointing to DigitalOcean
- GitHub repo with the project (App Platform deploys from Git)

#### App Platform Configuration

Create a new App Platform app with **one service: a Python (Web) service**.

**`server/main.py`** is the entry point. App Platform detects Python apps; configure the run command explicitly.

**App spec (`.do/app.yaml`):**

```yaml
name: arc-website
region: fra1  # Frankfurt — close to European and ME audience

services:
  - name: arc-web
    github:
      repo: your-org/arc-website
      branch: main
      deploy_on_push: true
    build_command: pip install -r server/requirements.txt
    run_command: uvicorn server.main:app --host 0.0.0.0 --port $PORT
    instance_size_slug: basic-xxs  # $5/month — 512MB RAM, sufficient for expected load
    instance_count: 1
    http_port: 8080
    health_check:
      http_path: /
    envs:
      - key: ENVIRONMENT
        value: production
        type: GENERAL

domains:
  - domain: ai-agents-challenge.digital
    type: PRIMARY
  - domain: www.ai-agents-challenge.digital
    type: ALIAS
```

**`registrations.json` persistence:** App Platform containers are ephemeral — the filesystem resets on each deploy. For Phase B, `registrations.json` must be stored on a DigitalOcean Managed Database (PostgreSQL) or a DigitalOcean Space (object storage). **Recommended:** DigitalOcean Spaces (S3-compatible). The server reads/writes `registrations.json` to a Space bucket instead of the local filesystem.

**Phase B storage update for App Platform:**

```python
# server/main.py addition for Spaces storage
import boto3  # or use the `boto3` library for S3-compatible storage

# Environment variables set in App Platform dashboard:
# DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET, DO_SPACES_REGION

import os
import boto3
from botocore.client import Config

s3 = boto3.client(
    's3',
    region_name=os.environ.get('DO_SPACES_REGION', 'fra1'),
    endpoint_url=f"https://{os.environ.get('DO_SPACES_REGION', 'fra1')}.digitaloceanspaces.com",
    aws_access_key_id=os.environ.get('DO_SPACES_KEY'),
    aws_secret_access_key=os.environ.get('DO_SPACES_SECRET'),
    config=Config(signature_version='s3v4'),
)
SPACES_BUCKET = os.environ.get('DO_SPACES_BUCKET', 'arc-registrations')
SPACES_KEY = 'registrations.json'

def read_registrations() -> list:
    try:
        obj = s3.get_object(Bucket=SPACES_BUCKET, Key=SPACES_KEY)
        return json.loads(obj['Body'].read())
    except s3.exceptions.NoSuchKey:
        return []

def write_registrations(records: list) -> None:
    s3.put_object(
        Bucket=SPACES_BUCKET,
        Key=SPACES_KEY,
        Body=json.dumps(records, indent=2, ensure_ascii=False).encode('utf-8'),
        ContentType='application/json',
    )
```

> **Concurrent writes:** The threading lock in Section 5 is insufficient for multi-process or stateless server environments. For Spaces-backed storage, replace file locking with an S3 conditional put (check ETag before write) or a DigitalOcean Managed Redis instance for a distributed lock. For Edition 1 volumes (100–300 registrations, not concurrent bursts), the risk of a concurrent write collision is low but should be addressed before launch. The cleanest Stage 7 migration path is to switch to a Managed PostgreSQL database with UNIQUE constraint on email, which eliminates the concurrency concern entirely.

#### DNS Configuration

1. In DigitalOcean DNS, add the domain `ai-agents-challenge.digital`.
2. App Platform provides a CNAME target — add a CNAME record for `www` and an ALIAS/ANAME record for the apex domain (or use DigitalOcean's Load Balancer for apex CNAME if needed).
3. App Platform provisions SSL automatically via Let's Encrypt within minutes of DNS propagation.

**DNS records:**
```
ai-agents-challenge.digital.     A      <App Platform IP>
www.ai-agents-challenge.digital. CNAME  <app-name>.ondigitalocean.app.
```

#### SSL

Automatic. App Platform provisions and renews Let's Encrypt certificates. No manual certbot configuration.

Force HTTPS in FastAPI:

```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
# Only in production — Phase B
if os.environ.get('ENVIRONMENT') == 'production':
    app.add_middleware(HTTPSRedirectMiddleware)
```

#### Process Management

App Platform manages the process. No PM2, no systemd, no supervisor. The `run_command` in `.do/app.yaml` is what App Platform executes.

For multi-worker (not needed for Edition 1, but noted for Stage 7):
```yaml
run_command: uvicorn server.main:app --host 0.0.0.0 --port $PORT --workers 2
```

#### Deploy Steps (First Deploy)

1. Push code to GitHub main branch.
2. Create new App in DigitalOcean App Platform → connect GitHub repo.
3. Set build and run commands (or use `.do/app.yaml` for declarative config).
4. Add environment variables in App Platform dashboard: `ENVIRONMENT=production`, `DO_SPACES_KEY`, `DO_SPACES_SECRET`, `DO_SPACES_BUCKET`, `DO_SPACES_REGION`.
5. Configure custom domain `ai-agents-challenge.digital`.
6. Update DNS at domain registrar to point to DigitalOcean nameservers.
7. Wait for SSL provisioning (typically 5–10 minutes after DNS propagation).
8. Test: `curl -I https://ai-agents-challenge.digital/` — expect `200 OK`.
9. Test registration form submission end-to-end.
10. Test `/#industry` scroll behavior in Telegram and LinkedIn in-app browsers.

#### Stage 7 Integration Notes

Stage 7 migrates the ARC platform (Python/JS/HTML) to DigitalOcean and integrates the registration database.

**Decisions made now that ease Stage 7:**

1. **JSON record schema** (Section 5) maps directly to a relational schema. No transformation needed.
2. **`password_hash`** uses bcrypt — compatible with any bcrypt library in any language.
3. **`form_instance` field** distinguishes Section 6 vs Section 10 registrations for analytics.
4. **`registration_source` field** carries UTM/anchor attribution through to the platform DB.
5. **`email_confirmed` boolean** is already in the schema — ready for email verification activation.
6. **App Platform** allows adding a Managed Database service to the same app without rebuilding the server.
7. **The `read_registrations`/`write_registrations` abstraction** in `main.py` makes the storage backend swappable — replace Spaces with a DB connection without changing the endpoint logic.
8. **No platform-specific dependencies** in the frontend. The static files deploy anywhere without modification.

---

## Appendix A: Phase A / Phase B Distinction Summary

| Area | Phase A | Phase B |
|---|---|---|
| Hosting | Local — open `index.html` in browser | DigitalOcean App Platform |
| Server | None | FastAPI + Uvicorn |
| Form submission | JS writes to `localStorage`; no network | JS POSTs to `/register`; server writes to Spaces |
| Password handling | Plaintext in `localStorage` (local only) | Bcrypt hash, never stored plaintext |
| Bot mitigation | Not implemented | Layers 1–4 active (honeypot, timing, rate limit, email signal) |
| Analytics | No-op stubs (`console.debug`) | Plausible (live events) |
| HTTPS | Not applicable | Automatic via App Platform + Let's Encrypt |
| Short URL redirects | Not implemented | FastAPI routes (`/t`, `/li`, `/industry`) |
| OG / social preview | Meta tags present in HTML (testable with browser DevTools) | Live on HTTPS domain (testable with Telegram/LinkedIn preview tools) |
| Email confirmation | Not implemented | Server-side trigger on successful registration |
| Duplicate email check | Not implemented | Enforced at storage layer |
| Rate limiting | Not implemented | slowapi: 5/hour, 10/day per IP |

---

## Appendix B: File Checklist for Stage 5 Build

Stage 5 builds Phase A first. This checklist defines the complete deliverable for Phase A sign-off before Phase B work begins.

**Phase A — Required for sign-off:**

- [ ] `index.html` — complete single-page structure with all sections (1–11 + logo bar), correct anchor IDs
- [ ] `css/base.css` — custom properties, reset, typography
- [ ] `css/layout.css` — grid, section spacing
- [ ] `css/components.css` — header, forms, collapsibles, FAQ accordion, buttons
- [ ] `css/responsive.css` — all breakpoint adaptations
- [ ] `js/nav.js` — sticky header, scroll-aware Register CTA, hamburger menu
- [ ] `js/collapsibles.js` — `<details>` analytics hooks
- [ ] `js/form.js` — validation, Phase A `localStorage` submission, privacy notice toggle
- [ ] `js/analytics.js` — no-op stubs
- [ ] `js/scroll.js` — hash-anchor-on-load, smooth scroll, attribution capture
- [ ] `assets/logo.svg` — placeholder acceptable
- [ ] `assets/og-image.png` — 1200×630px, required even in Phase A for meta tag testing
- [ ] `assets/partner-logos/placeholder.svg` — placeholder slots
- [ ] `.gitignore` — includes `registrations.json`
- [ ] `README.md` — local setup instructions

**Phase A — Test checklist:**

- [ ] `index.html` opens in Chrome, Firefox, Safari without errors
- [ ] All `<details>` collapse/expand correctly
- [ ] FAQ accordion works
- [ ] Primary form validates all fields client-side, shows inline errors
- [ ] Secondary form validates name + email + consent
- [ ] Privacy notice expands/collapses on toggle
- [ ] Form submission stores to `localStorage`, shows confirmation message
- [ ] Header "Register" button targets correct form based on scroll position
- [ ] Hamburger menu opens/closes on mobile (DevTools emulation)
- [ ] Hash anchors (`#how-it-works`, `#builders`, `#register`, `#evaluation`, `#industry`, `#faq`) scroll correctly
- [ ] `/#industry` scrolls to Section 8 on page load
- [ ] Attribution anchors (`#t`, `#li`) do not scroll
- [ ] Lighthouse mobile score ≥ 90 (Chrome DevTools Lighthouse)
- [ ] No console errors

**Phase A — In-app browser test checklist (Stage 5 critical):**

- [ ] `<details>` expand/collapse in Telegram iOS in-app browser
- [ ] `<details>` expand/collapse in Telegram Android in-app browser
- [ ] `/#industry` hash anchor scroll in Telegram iOS in-app browser
- [ ] `/#industry` hash anchor scroll in LinkedIn in-app browser
- [ ] `/#industry` hash anchor scroll in WhatsApp in-app browser
- [ ] Form submission and confirmation message in Telegram in-app browser
- [ ] Hamburger menu in Telegram in-app browser

**Phase B — Required before deployment:**

- [ ] `server/main.py` — FastAPI app with `/register` endpoint
- [ ] `server/requirements.txt`
- [ ] `.do/app.yaml` — App Platform spec
- [ ] `js/form.js` updated — Phase B fetch submission handler active
- [ ] `js/analytics.js` updated — Plausible live events
- [ ] OG meta tags point to live HTTPS URL
- [ ] Environment variables configured in App Platform
- [ ] `registrations.json` storage wired to DigitalOcean Spaces
- [ ] DNS configured, SSL provisioned
- [ ] End-to-end registration tested on live domain
- [ ] Rate limiting tested (5 submissions from same IP)
- [ ] Honeypot tested (submit with `website` field populated)
- [ ] OG card previewed in Telegram using Telegram's link preview tool
- [ ] OG card previewed in LinkedIn using LinkedIn's Post Inspector
