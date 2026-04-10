# ARC Registration Form — Design Spec (Stage 2)

**Project:** Agents Reliability Challenge — ai-agents-challenge.digital  
**Stage:** 2 of 7 (Registration Form Design)  
**Status:** Draft for review  
**Dependencies:** ARC Integrated Brief, ARC Website Plan

---

## Phasing

This spec covers two phases. The distinction matters because it determines what gets built now vs. what gets built when the site goes live.

**Phase A — Local Prototype (current phase).** The website lives in a folder on a local machine. The registration form is a working HTML form that logs submissions to a local JSON file (`registrations.json`) in the same folder. No server, no network, no backend. The purpose is to iterate on design, copy, and form behavior until everything is right. Phase A implements: form fields and client-side validation (Section 1), visual form layout including consent checkbox and privacy notice (Section 2), on-page confirmation message on submit (Section 3), and JSON file logging (Section 4). Phase A does not implement: confirmation emails, server-side validation, unique access-link token generation, rate limiting, bot mitigation, email uniqueness enforcement, or any feature that requires a server.

**Phase B — Deployed site.** The website moves to online hosting. The JSON file is replaced by a real backend (serverless function + database). All production features activate: server-side validation, HTTPS, email delivery of unique access links with tokens, bot mitigation, rate limiting, GDPR data access/deletion endpoints. Phase B is addressed in full in this spec but is not built during local prototyping.

Sections below are marked **[Phase A]** or **[Phase B]** where the distinction affects what to build. Unmarked content applies to both phases.

---

## 1. Field Specification

### Design Principle

Minimum viable data at registration. Collect only what is needed to create an account and contact the registrant. Everything else moves to post-registration profile completion on the ARC platform.

Authentication is passwordless: registration does not ask the participant to create or enter a password. The system generates a personal access token and sends a unique access link to the registered email.

The target: a technically strong person arriving from a Telegram link registers in under 60 seconds. Name and email are sufficient to register. Country remains optional for reporting and timezone communications.

### Registration Fields

| # | Field | Required | Type | Validation | Rationale |
|---|-------|----------|------|------------|-----------|
| 1 | **Full name** | Yes | Text input | Min 2 characters. No character-set restriction (supports non-Latin names). | Identity. Needed for leaderboard display, certificates, and communications. Single field — not split into first/last. Reduces friction, accommodates naming conventions globally. |
| 2 | **Email** | Yes | Email input | Standard email format validation (client-side + server-side). | Primary contact channel. Account identifier. Used for confirmation, warm-up access credentials, and all challenge communications. Personal access links are sent to this address. |
| 3 | **Country** | Optional | Dropdown (searchable) | ISO 3166-1 country list. "Prefer not to say" as an option. | Useful for understanding geographic distribution, timezone-aware communications, and partner reporting. Optional because it's not essential for participation and adds a decision point. |

### Fields Explicitly Excluded from Registration

These are collected post-registration in the participant's ARC platform profile. Each has value but does not justify friction at the registration gate.

| Field | Where Collected | Why Not at Registration |
|-------|-----------------|----------------------|
| Team vs. individual | Platform profile | Many registrants don't know yet. Forcing a choice creates hesitation. Teams form during warm-up. |
| Team name / members | Platform profile | Teams are fluid before the challenge. Let them self-organize. |
| Audience segment (AI builder / enterprise practitioner / student) | Platform profile | Self-categorization at registration biases responses and adds cognitive load. Collect when it's contextually relevant (e.g., during onboarding). |
| Experience level | Platform profile | Subjective, uncomfortable to answer, and not actionable at the registration stage. |
| Framework preferences | Platform profile | Interesting for analytics but zero operational value at sign-up. |
| Company / organization | Platform profile | Sensitive for some (enterprise participants may not want to declare affiliation publicly). Better asked in a private profile context. |
| GitHub / portfolio link | Platform profile | Valuable for showcasing and recruiting, but adds friction and feels like gatekeeping at registration. |
| Password / passphrase | Not collected at registration | ARC uses passwordless access. The system issues a personal tokenized access link to the registered email. |
| How did you hear about ARC | Platform profile or post-registration survey | Attribution is better handled through URL parameters and analytics than self-report at the form level. If asked, make it a lightweight post-registration prompt — not a registration-gate field. |

### Profile Completion (Post-Registration)

After registration, the ARC platform profile collects additional information through progressive profiling. "Complete profile" is defined as having filled in the following fields, which are prompted but not enforced:

**Prompted profile fields (define "complete profile"):**

- Participation format: individual or team
- If team: team name (team member linking handled separately)
- Audience segment: AI/ML builder, enterprise practitioner, student/academic, other
- Country (if not provided at registration)
- Brief bio or background (free text, 280 characters max — enough for a tweet-length description)
- Primary programming language / agent framework (optional, for analytics)

**Profile completion reminders:**

Send a reminder email prompting registrants to complete their profile at two points: 48 hours after registration (if profile is incomplete), and 3 days before warm-up opens (if profile is still incomplete). The reminder should be lightweight — "Complete your profile so you're ready when the warm-up opens" — with a direct link to the profile page. One email per trigger, no nagging sequences.

---

## 2. Privacy Notice and Consent

### Approach

GDPR-compliant by default. Lawful basis: consent (Article 6(1)(a)) for processing registration data for the stated purpose. Data minimization is built into the field specification. The notice is written to be honest and readable — not boilerplate legalese — while covering the required disclosures.

### Consent Mechanism

A single mandatory checkbox before the submit button:

> ☐ **I agree to the processing of my data as described in the [Privacy Notice](#privacy-notice) to participate in the Agents Reliability Challenge.**

The checkbox is unchecked by default. Registration cannot be submitted without checking it. The privacy notice link opens inline (expandable section) or as a modal — not a new page (preserves form state and avoids losing partially completed registrations).

### Privacy Notice Text

Display as an expandable section linked from the consent checkbox. Draft text:

---

**Privacy Notice — Agents Reliability Challenge Registration**

**Who we are:** The Agents Reliability Challenge (ARC) is operated by [OPERATOR ENTITY — to be confirmed]. Contact: [privacy contact email].

**What we collect:** Your name and email address when you register. Country is optional. Additional profile information you choose to provide after registration.

**Why we collect it:** To create your participant account, grant access to the challenge environment, communicate with you about the challenge (timeline, warm-up access, results), display your name on leaderboards (if you participate), and analyze aggregate participation patterns to improve the challenge.

**Lawful basis:** Your consent, given by checking the consent box at registration.

**Who sees your data:** Your name appears on public leaderboards if you submit a solution (you may use an alias by updating your display name in your profile). Your email is never shared publicly. Aggregate, anonymized statistics (number of participants by country, completion rates) may be shared with challenge partners. We do not sell your data or share individual-level data with third parties for marketing purposes.

**How long we keep it:** Your account data is retained for the duration of the challenge and for 12 months afterward (to support follow-on editions and community continuity). You can request deletion at any time.

**Your rights:** You have the right to access, correct, or delete your personal data. You have the right to withdraw consent at any time — withdrawal does not affect the lawfulness of processing before withdrawal. You have the right to request a copy of your data in a portable format. To exercise any of these rights, contact [privacy contact email].

**Security:** Registration data is stored in [hosting region — to be confirmed] and transmitted over encrypted connections (HTTPS/TLS). Access is provided through a unique email link with a token.

**Cookies:** The registration form uses no tracking cookies. Analytics on the website are [covered in the website privacy/analytics approach — cross-reference Stage 4].

---

### Implementation Notes

- The privacy notice must be accessible before the user checks the consent box (expandable or modal — not hidden behind submission).
- Consent is recorded with a timestamp in the registration data (see Section 4).
- The operator entity name and contact email are placeholders — they need to be confirmed before launch.
- If the operator entity has no EU establishment, consider whether a GDPR representative appointment is needed. For a lean first edition with modest data collection, this is a low-priority concern but should be flagged for legal review.

---

## 3. Submission Flow

### Phase A — Local Prototype

On submit, JavaScript intercepts the form, validates client-side, and appends a JSON object to `registrations.json` in the project folder. No network request. The form renders the on-page confirmation message (see below) exactly as it will appear in production — this allows iterating on the confirmation UX locally.

**JSON record structure (Phase A):**

```json
{
  "full_name": "entered value",
  "email": "entered value (lowercased)",
  "country": "entered value or null",
  "consent_given": true,
  "registered_at": "ISO 8601 timestamp"
}
```

Note: In Phase A, registration test data is stored in the local JSON file for design iteration only. In Phase B, access-link token issuance happens server-side.

**Phase A does not implement:** confirmation emails, server-side validation, duplicate email detection, rate limiting, or bot mitigation. These are all Phase B.

### Phase B — Deployed Site

### On Submit (Client-Side)

1. **Validate all fields.** Client-side validation fires before submission. Errors displayed inline next to the relevant field — not in a summary block at the top.
2. **Disable the submit button** and show a loading state ("Registering..." or a spinner). Prevents double-submission.
3. **Send the form data** to the submission endpoint (POST request, JSON payload over HTTPS).

### On Success (Server Response: 2xx)

1. **Replace the form** with an on-page confirmation message. Do not redirect — the registrant may want to continue reading the page.

   Confirmation message:

   > **You're registered.**
   >
   > Check your email (**[email address]**) for a confirmation with your next steps. If you don't see it within a few minutes, check your spam folder.
   >
   > While you wait: [Join the Discord →] [Star the GitHub repo →]

2. **Send a confirmation email** immediately (triggered server-side on successful registration). Contents:

   - Subject: "You're in — ARC Registration Confirmed"
   - Body: Confirms registration. States when the warm-up opens (or "we'll email you when the warm-up opens" if date is TBD). Includes the participant's personal tokenized access link. Links to Discord and GitHub repo. Includes a link to complete their profile on the ARC platform (if the platform is ready) or notes that platform access is coming soon. Footer includes the privacy contact email and a note that they can request data deletion at any time.

3. **Do not auto-redirect** to the ARC platform. The static website and the platform are separate systems at launch. The confirmation email is the bridge.

### On Failure (Server Response: 4xx/5xx)

| Scenario | User-Facing Message | Technical Note |
|----------|-------------------|----------------|
| Duplicate email | "This email is already registered. Check your inbox for your latest access link." | 409 Conflict. Return generic message — do not confirm whether the email exists to unauthenticated users (prevents email enumeration). See note below. |
| Validation error (server-side) | Inline field errors matching the issue (e.g., "Enter a valid email address") | 422 Unprocessable Entity. |
| Rate limited | "Too many registration attempts. Please try again in a few minutes." | 429 Too Many Requests. |
| Server error | "Something went wrong. Please try again. If it keeps happening, contact [support email]." | 500/502/503. Log the error server-side. |
| Network error | "Couldn't reach the server. Check your connection and try again." | Client-side detection (fetch failure). |

**Email enumeration note:** The duplicate-email message above reveals that an email is registered. For a technical competition with modest data sensitivity, this is an acceptable tradeoff — it prevents frustration for someone who forgot they registered. If a stricter approach is preferred, return a generic "Check your email for next steps" for all submissions, and send an email to existing addresses saying "You already have access — use your latest link." This adds complexity to the submission flow and delays feedback for the user. Recommend the simpler approach for Edition 1.

### Post-Submission State

- The confirmation message persists on the page (not a transient toast). If the user scrolls away and comes back, it's still there.
- The form does not reappear on the same page load. If the user refreshes, the empty form reappears (no local storage of submission state — keeps it simple).
- No redirect to the ARC platform. The email handles the hand-off.

---

## 4. Data Storage Requirements

### Phase A — Local Prototype

A single `registrations.json` file in the project folder. The file is an array of registration objects (see Section 3 for the record structure). JavaScript appends to this array on each submission. The file is human-readable and can be opened in any text editor to inspect test registrations.

No database, no server, no encryption. This file contains test data only and should be added to `.gitignore` if the project folder is version-controlled.

### Phase B — Deployed Site

### Minimum Data Record per Registration

Every registration creates a record with the following fields:

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `id` | UUID or auto-increment | Generated server-side | Unique identifier. |
| `full_name` | String (UTF-8) | Form input | As entered. No normalization. |
| `email` | String | Form input | Normalized to lowercase. Unique constraint. |
| `access_link_last_sent_at` | ISO 8601 datetime (UTC) or null | Generated server-side | Timestamp of the most recent access-link email dispatch. |
| `country` | String (ISO 3166-1 alpha-2) or null | Form input | Null if not provided. |
| `consent_given` | Boolean | Derived from checkbox state | Must be `true` for record creation. |
| `consent_timestamp` | ISO 8601 datetime (UTC) | Generated server-side | When consent was recorded. |
| `registered_at` | ISO 8601 datetime (UTC) | Generated server-side | Record creation time. |
| `ip_address` | String | Request metadata | Stored for abuse mitigation. Retained for 30 days, then deleted or anonymized. |
| `registration_source` | String or null | Derived from URL parameters or referrer | UTM source / channel anchor if available. Null if attribution parameters are stripped. |
| `email_confirmed` | Boolean | Default: false | Set to true when the registrant confirms via email (if email confirmation is implemented — see note). |

### Email Confirmation

Two approaches, choose based on operational capacity:

**Option A — No email confirmation (simpler, recommended for Edition 1):** Registration creates an active account immediately. The confirmation email is informational only, not a verification gate. Risk: some registrations may use invalid emails. Acceptable for a first edition where the registration volume is modest (100–300) and the warm-up access is the real activation point.

**Option B — Email confirmation required:** Registration creates a pending account. A confirmation link in the email activates it. Prevents invalid emails but adds a drop-off point. If chosen, send a reminder to unconfirmed registrations after 24 hours.

Recommendation: Option A for Edition 1. Revisit for Edition 2 if invalid-email registrations become a problem.

### Backend-Agnostic Requirements

Regardless of whether the backend is a serverless function (Cloudflare Workers, Vercel Edge Function), an ARC platform endpoint, or a temporary solution:

- **HTTPS only.** No unencrypted transmission of registration data.
- **Access token links** are generated and signed server-side. Tokens must be time-limited and never logged in plaintext.
- **Email uniqueness** enforced at the storage layer (unique constraint or equivalent).
- **Consent must be recorded.** A registration without `consent_given: true` and a `consent_timestamp` is invalid.
- **Data export capability.** Must be able to export all data for a given email address (GDPR data access request). For a temporary solution (spreadsheet), this is trivial. For a database, ensure a query path exists.
- **Deletion capability.** Must be able to delete all data for a given email address (GDPR right to erasure). For a temporary solution, this is a manual process. For a database, a delete endpoint or admin function.

### Temporary Backend Considerations

If the backend is a temporary solution before ARC platform integration:

- **Spreadsheet (Google Sheets / Airtable):** Avoid as a production registration system because it cannot safely handle tokenized access-link workflows and lifecycle controls.
- **Email-based collection:** Avoid. Email is not a data store — it creates GDPR compliance risk (data scattered across inboxes with no structured deletion path).
- **Serverless function writing to a simple database (e.g., Cloudflare D1, Vercel Postgres, Supabase):** Preferred temporary approach. Handles secure access-link token issuance, uniqueness constraints, and structured data access/deletion.

---

## 5. Bot and Bulk Registration Mitigation [Phase B Only]

Not implemented during local prototyping. The entire section below applies when the site is deployed to public hosting.

### Threat Model

The goal is to prevent automated bulk registration (hundreds of fake accounts from scripts) while allowing legitimate registrations from any source, including users who employ browser agents, autofill tools, or AI assistants to complete the form.

The distinction: one person (or their personal AI agent) filling out and submitting a single legitimate registration is fine. A script hammering the endpoint to create 500 accounts is not.

### Mitigation Layers

Each layer operates independently. They are additive — triggering one does not affect the others. The registrant should encounter zero friction in normal use.

#### Layer 1: Honeypot Field (Silent)

Add a hidden form field that is invisible to human users (and to screen readers, via `aria-hidden="true"` and `tabindex="-1"`) but visible to naive bots that fill all fields.

- Field name: something plausible (e.g., `website` or `company`). Do not name it `honeypot`.
- CSS: `position: absolute; left: -9999px; opacity: 0; height: 0; overflow: hidden;` applied to a wrapping `div`, not the input directly (some bots detect `display: none` on inputs).
- Validation: if the field contains any value on submission, reject silently (return a fake success response — 200 OK with the standard confirmation message). Do not reveal that the submission was rejected. Log the attempt server-side.

**Effectiveness:** Blocks unsophisticated bots. Trivially bypassed by targeted scripts, but raises the floor.

#### Layer 2: Submission Timing (Silent)

Record the timestamp when the form becomes interactive (page load or form render) in a hidden field or JavaScript variable. On submission, calculate the elapsed time.

- If elapsed time < 3 seconds: very likely automated. Reject silently (fake success response). Log the attempt.
- If elapsed time 3–8 seconds: possibly automated, possibly a fast human with autofill. Accept but flag for review if other signals are suspicious.
- If elapsed time > 8 seconds: almost certainly a human or a human-controlled agent. Accept normally.

**Implementation:** A hidden field populated by JavaScript with a timestamp on `DOMContentLoaded` or form focus. Submitted with the form. Server compares submission timestamp minus form-render timestamp.

**Effectiveness:** Reliable for blocking crude scripts. Human-controlled AI agents (browser bots filling the form on behalf of a person) typically take 5–15 seconds to navigate and fill — well above the threshold.

#### Layer 3: Rate Limiting (Server-Side)

Rate limits on the registration endpoint, applied per IP and globally:

| Scope | Limit | Window | Response on Exceed |
|-------|-------|--------|-------------------|
| Per IP | 5 registrations | 1 hour | 429 Too Many Requests. User-facing message: "Too many registration attempts. Please try again in a few minutes." |
| Per IP | 10 registrations | 24 hours | Same. |
| Global | 100 registrations | 1 minute | 503 Service Unavailable. Log alert. This protects against distributed attacks — if 100 registrations arrive in under a minute from any combination of IPs, something is wrong. |

**Implementation:** Standard rate limiting at the serverless function or API gateway level. Most hosting platforms (Cloudflare, Vercel) provide this natively.

**Note on shared IPs:** The per-IP limit of 5/hour is generous enough that multiple legitimate registrants behind a corporate NAT or VPN should not be affected. If a specific case arises (e.g., a university lab registering 20 students), handle it through a manual allowlist or temporary rate-limit increase, not by relaxing the default.

#### Layer 4: Email Verification Signal (Passive)

If email confirmation is implemented (Option B in Section 4), unconfirmed registrations that remain unconfirmed after 72 hours are flagged and can be purged in bulk. This is a natural bot filter — bots register with fake or disposable emails that never confirm.

If email confirmation is not implemented (Option A, recommended), this layer is not available. The other three layers are sufficient for Edition 1's expected volume.

#### Layer 5: Progressive Challenge (Reserved — Not Implemented at Launch)

If Layers 1–4 prove insufficient (unlikely for Edition 1's expected volume of 100–300 registrations), implement a progressive challenge triggered only by suspicious patterns:

- Trigger: a submission that fails the honeypot OR the timing check AND comes from an IP that has already been rate-limited.
- Challenge: a simple interactive verification (e.g., "Click the button to confirm you're registering" — a second-step confirmation page, not a CAPTCHA).
- Normal registrants never see this. Only submissions that have already tripped multiple signals encounter additional friction.

**Status:** Designed but not built for Edition 1. Implement only if abuse is observed during the registration period.

### What This Approach Does NOT Do

- No CAPTCHA. Ever. CAPTCHAs degrade the experience for legitimate users, are increasingly solved by bots, and conflict with the design principle that AI-assisted registration is fine.
- No JavaScript proof-of-work or browser fingerprinting. Disproportionate to the threat level for a first edition.
- No email domain blocklisting (blocking disposable email providers). Some legitimate users use these for privacy. If bulk registration through disposable emails becomes a problem, address it in Edition 2.

---

## Appendix: Implementation Boundary

This spec defines **what** the form does and **why**. It does not define **how** it is built.

**Phase A (local prototype) builds:** HTML form with all fields from Section 1, client-side validation, consent checkbox and expandable privacy notice, on-page confirmation message, and JSON file logging. This is enough to iterate on the complete registration UX without any backend.

**Phase B (deployment) adds:** Everything deferred from Phase A — serverless function, database, HTTPS, access-link email delivery with token issuance, bot mitigation, rate limiting, GDPR endpoints. The form HTML/CSS/JS from Phase A carries forward; only the submission handler changes.

The following are explicitly deferred to Stage 4 (Tech Spec):

- HTML structure and field markup
- CSS styling and responsive behavior
- JavaScript validation implementation
- Serverless function architecture
- Database schema and migration
- Analytics event tagging
- Accessibility testing and WCAG compliance details
- OG metadata and social preview behavior

The Stage 4 tech spec takes this document as input alongside the Stage 1 content architecture.
