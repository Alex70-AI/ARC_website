# ARC Website — Content Architecture Spec

**Stage 1 Deliverable (Revised)**
**Site:** agentreliabilitychallenge.com
**Format:** Single scroll page, anchor navigation, static HTML/JS/CSS
**Date:** April 2026

---

## 0. Structural Principles

Before the section inventory, three principles that govern every decision below.

**Principle 1: Two reading speeds, one scroll.**
The page serves skimmers (warm visitors from Telegram/LinkedIn who need confirmation, not persuasion) and readers (cold visitors from HN/Reddit/newsletters who need to be convinced). Every section has a scannable surface (headline + 1–2 sentences) and optional depth (expandable or naturally dense below the fold). Skimmers should be able to reach the registration form in under 60 seconds of scrolling without reading a single paragraph.

**Principle 2: Suppress domain, lead with engineering challenge.**
Per the brief's emphasis/suppress guidelines, "oil & gas" and "energy industry" do not appear above the fold or in any section headline. The domain is introduced as the *setting* — never the subject — and only after the technical challenge is established. The word "hackathon" never appears.

**Principle 3: Mobile is primary, not responsive.**
First-wave traffic arrives via Telegram and LinkedIn on mobile. The page is designed mobile-first. Desktop is the adaptation, not the other way around.

---

## 1. Header / Navigation Bar

| Attribute | Value |
|---|---|
| **Purpose** | Brand identification, soft audience routing, persistent registration access |
| **Primary audience** | All visitors |
| **Visibility** | Always visible; sticky on scroll (both desktop and mobile) |
| **Content density** | Sparse — logo + nav links only |

### Content Requirements

- ARC logo/wordmark (left-aligned). Placeholder acceptable for Stage 5; final asset required for Stage 6.
- Navigation links (right-aligned on desktop, hamburger on mobile):
  - "How It Works" → anchor to Section 4
  - "For AI Builders" → anchor to Section 5
  - "For Industry" → anchor to Section 8
  - "FAQ" → anchor to Section 10
- Primary CTA button: "Register" → anchors to nearest registration form instance (Section 6 or Section 11 depending on scroll position)

### Mobile Behavior

- Logo + hamburger icon. "Register" button remains visible outside the hamburger menu (persistent top-right).
- Hamburger opens a minimal overlay with anchor links. Tapping any link closes the overlay and smooth-scrolls.

---

## 2. Hero Block

| Attribute | Value |
|---|---|
| **Purpose** | First impression. Communicate the core differentiator in under 5 seconds. Create enough intrigue to keep scrolling. |
| **Primary audience** | All visitors (must work for both warm and cold) |
| **Visibility** | Always visible (never collapsible) |
| **Content density** | Sparse — headline, subline, one CTA. Maximum 40 words of body text. |

### Content Requirements

- **Primary headline:** Built around the "should vs. can" positioning line. This is the single most important piece of copy on the site.
- **Subline (1–2 sentences):** Communicates what the participant actually does — builds an agent that operates in a simulated enterprise environment, takes real actions, and is scored on correctness, reliability, and policy compliance. No domain jargon.
- **Primary CTA button:** "Register" or "Join the Challenge" — links to Section 6 registration form.
- **Secondary text link:** "Learn more ↓" or equivalent — smooth-scrolls to Section 3.
- **No background image or illustration required.** If used, it must not slow page load on mobile. Prefer a clean, typography-driven hero.

### What Does NOT Belong Here

- Partner logos (they appear as a logo bar between Sections 7 and 8)
- Dates/timeline (too early — earns space only after the challenge is understood)
- "Oil & gas," "energy," "hackathon," prize amounts
- Multiple CTAs or audience-switching UI

### Mobile Behavior

- Full-viewport height or near-full. Headline and subline must render without scrolling on a standard mobile screen (375px width). CTA button thumb-reachable (bottom half of viewport).

---

## 3. Challenge Overview ("What Is This")

| Attribute | Value |
|---|---|
| **Purpose** | Expand on the hero for readers who need more context. Communicate the four mandatory points from the brief and the strategic problem the challenge exists to solve. |
| **Primary audience** | Cold visitors (warm visitors may skip) |
| **Visibility** | Always visible |
| **Content density** | Medium — scannable blocks, not a wall of text |

### Content Requirements

**3a. Four Mandatory Points (always visible)**

This section communicates the brief's four mandatory collateral points in a scannable format. Each point is a short block (headline + body text):

1. **Realistic enterprise environment.** Agents interact with structured APIs, create records, and mutate state in a simulated business system. Not a prompt benchmark.
2. **No domain expertise needed.** The environment and a curated knowledge base provide everything the agent needs. Designed for AI builders from any background.
3. **Built-in, scored evaluation.** Success is measured by what the agent does — actions taken, records created, policies respected. Not by demos or presentations.
4. **Reliability and policy-awareness are scored dimensions.** The challenge tests whether your agent knows when to refuse, escalate, or ask for clarification. Not just whether it can complete a task.

**3b. Why This Challenge Exists (always visible)**

A brief problem-statement block (2–3 sentences) drawn from the brief's "Gap" narrative (Brief Section 2). This establishes why the challenge needs to exist, not just what it is.

Content direction: Frontier AI builders ship capable agents for sectors with mature digital infrastructure but have almost no exposure to the complex, policy-heavy environments that heavy industry operates in. Industry teams can't close this gap alone — they lack access to the methods and evaluation discipline that make agent deployment credible. This challenge bridges both worlds in a structured, short, high-signal engagement.

This block serves two audiences: cold HN/Reddit visitors who need a "why should this exist?" frame to take the challenge seriously, and enterprise leadership who need the problem statement to justify attention. It transitions naturally from the "what this is" blocks above into the "how it works" section below.

### Format Guidance

- 3a: Four blocks in a 2×2 grid on desktop, stacked vertically on mobile. Each block: bold headline (5–8 words), body text, optional small icon or visual marker.
- 3b: A single text block below the grid. Visually distinct from the four blocks (different treatment — e.g., a pull-quote style or a simple paragraph with a left border). Not a fifth grid block.
- No expand/collapse — this content is short enough to always display.

### Mobile Content Constraint

Blocks stack vertically on mobile. No truncation. Full content visible. **Stage 3 note:** On mobile, four stacked blocks plus the problem-statement block create a substantial scroll distance. Each block's body text must not exceed 2 sentences on mobile. The copywriter should write tight — if a block needs 3 sentences on desktop, the mobile rendering should truncate gracefully or the desktop copy should be constrained to 2 sentences from the start. Prefer the simpler approach: write each block to 2 sentences, period.

---

## 4. How It Works

| Attribute | Value |
|---|---|
| **Purpose** | Make the challenge format concrete. Answer "what do I actually do?" and "when does it happen?" |
| **Primary audience** | AI builders (primary), enterprise practitioners (secondary) |
| **Visibility** | Always visible (top-level steps and timeline). Task examples are collapsible. |
| **Content density** | Medium (top level) → Dense (expanded task examples) |

### Content Requirements

**4a. Format Summary (always visible)**

Three-step structure communicated visually (numbered steps, timeline, or simple flow):

- **Step 1: Register & warm up (~2 weeks).** Access a smaller test environment. Complete introductory tasks. Familiarize with the API, SDK, and evaluation mechanics. Progressive difficulty.
- **Step 2: Main challenge (1 day, ~2–6 hours).** Solve a set of tasks in the full simulated environment. Agent is scored automatically.
- **Step 3: Results & recognition.** Multiple leaderboards (accuracy, reliability, efficiency). Special nominations. Top solutions showcased.

Key logistics stated plainly: online format, worldwide access, teams or individuals, any language/framework, Python SDK provided.

**4b. What Your Agent Actually Does (always visible)**

A concise description of the agent's operating context:

- Receives tasks with an assigned role (engineer, technician, supervisor, planner)
- Interacts with enterprise systems through a REST API
- Creates records, updates work orders, checks inventory, enforces policies
- Must operate within the permissions of the assigned role
- Some tasks require the agent to *refuse* an action — because it falls outside role authority

This is the section where the domain setting is revealed naturally: "The simulated environment is an operations & maintenance system — but you don't need to know anything about the industry. The knowledge base and SOPs are provided."

**4c. Task Examples (collapsible — collapsed by default on both desktop and mobile)**

Expandable block titled "See example tasks" containing 3–5 concrete task scenarios, drawn from the brief's examples. Each scenario: 2–3 sentences describing the situation, what the agent must do, and why it's interesting (e.g., "The correct action here is to refuse — the work order belongs to a different discipline").

**Why collapsible:** Skimmers don't need this to register. Readers who want to assess difficulty or technical depth before committing will click through. This is the section that converts the "is this interesting enough?" crowd.

**4d. Key Dates (always visible)**

A compact, scannable timeline block showing the key milestones:

- Registration opens: [date or "Now open"]
- Warm-up period: [date range or "~2 weeks before main challenge"]
- Main challenge: [date or "1 day — date TBA"]
- Results announced: [date or "Shortly after challenge day"]

Visual treatment: a simple horizontal timeline on desktop (four points on a line), vertical on mobile (four stacked items). Minimal — no more than one line of text per milestone.

If dates are not confirmed at launch, the slot exists with placeholder content: "Dates announced soon — register to be notified." The slot must exist in the architecture regardless of date confirmation status, because dates are a primary decision factor for the target audience. A builder evaluating whether to register needs to know when this happens and whether it fits their schedule.

### Mobile Behavior

- Format summary: steps stack vertically. Each step is a compact card.
- Task examples: collapsed by default. Tap to expand. Full content visible when expanded (no truncation).
- Key dates: vertical stack, four items. Compact.

---

## 5. Why Compete / Builder Value Proposition

| Attribute | Value |
|---|---|
| **Purpose** | Directly address "why should I spend time on this?" for the primary audience |
| **Primary audience** | AI builders (Tier 1) |
| **Visibility** | Always visible |
| **Content density** | Medium — concise value points, not aspirational fluff |
| **Anchor ID** | `#builders` — linked from header nav "For AI Builders" |

### Content Requirements

Section headline oriented toward the builder: something like "Why This Challenge" or "What You Get."

Value points (not a numbered list in the copy — presented as short blocks or a compact visual layout):

- **A real enterprise test environment.** The kind of environment you can't access outside an actual enterprise deployment. Role-based authority, policy enforcement, multi-step workflows with consequences.
- **Objective scoring.** No judges, no demos. The environment evaluates your agent automatically across accuracy, reliability, and efficiency.
- **Framework-agnostic.** Any language, any framework. REST API + Python SDK provided. Starter templates for popular frameworks.
- **Recognition that matters.** Multiple leaderboards and special nominations: Safest Agent, Most Reliable, Most Efficient, Breakthrough Newcomer. Top solutions showcased.
- **Portfolio signal.** A completed submission demonstrates you can build an enterprise-grade agent, not just a chatbot demo.
- **Beyond prizes.** Top participants may be featured in solution showcases, invited to publish their approach, or connected with organizations exploring enterprise agent deployment. Specific non-monetary incentives will be listed here when confirmed — the slot exists for them. *(Placeholder acceptable for Stage 5 if commitments are not yet finalized.)*

Optional: a brief line acknowledging that prizes exist ("Prizes and recognition for top performers") without specifying amounts. Per the brief, prizes are not the main draw and should not lead.

### Mobile Behavior

- Value points stack vertically. No collapse needed — keep each point to 2–3 sentences.

---

## 6. Registration Form — Primary Placement

| Attribute | Value |
|---|---|
| **Purpose** | Primary conversion point. Capture registrations from the AI builder flow. |
| **Primary audience** | AI builders who have read enough to decide |
| **Visibility** | Always visible |
| **Content density** | Sparse — form fields + minimal context |

### Content Requirements

- **Contextual CTA headline:** Short, action-oriented. E.g., "Ready to test your agent?" or "Register for ARC."
- **One reinforcement line:** A single sentence restating the low-commitment pitch — e.g., "Free to enter. Any framework, any language. Warm-up starts [date]."
- **Form fields:** Defined in Stage 2 (Registration Form Design). Placeholder form area in this spec.
- **Submit button:** Clear label ("Register" or "Join the Challenge").
- **Post-submit behavior:** Defined in Stage 2. Inline confirmation message preferred over redirect.
- **Activation links (below or alongside the form):** "Join the Discord →" and "Explore the SDK & starter templates on GitHub →" — presented as secondary actions, not competing with the form. These are the natural "what to do next" or "while you wait" prompts. On post-submission, these links become the primary next-step guidance (per Stage 2 spec's confirmation message design). One-line descriptions: Discord — "Ask questions, form teams, get help during warm-up." GitHub — "Python SDK, example agent, documentation, starter templates for popular frameworks."

### Placement Rationale

This form sits after the builder value proposition (Section 5) and before the evaluation/technical depth sections. This is the natural decision point for the primary audience. Builders who are convinced by Sections 2–5 should not have to scroll further to act. Builders who want more detail (evaluation mechanics, FAQ) continue scrolling and encounter a second registration form in Section 11.

### Mobile Behavior

- Full-width form. Large tap targets. No horizontal scrolling. Form fields stack vertically.
- Discord and GitHub links stack below the form. Tap-friendly.

---

## 7. Evaluation & Scoring

| Attribute | Value |
|---|---|
| **Purpose** | Communicate how agents are evaluated. Build credibility through rigor. |
| **Primary audience** | AI builders (detail-oriented segment), enterprise observers |
| **Visibility** | Top-level summary always visible. Detailed breakdown collapsible. |
| **Content density** | Medium (summary) → Dense (expanded detail) |

### Content Requirements

**7a. Summary (always visible)**

Three leaderboard dimensions, each with a one-line explanation:

- **Accuracy** — Did the agent take the right actions and produce correct outcomes?
- **Reliability** — How consistently does the agent perform across repeated runs?
- **Efficiency** — How much compute/cost does the agent use per task?

One key line: "The environment evaluates your agent automatically. No subjective judging."

**7b. Detailed Evaluation Criteria (collapsible — collapsed by default)**

Expandable block containing deeper explanation of each dimension:

- Accuracy: outcome type classification (correct action vs. correct refusal vs. correct escalation), action correctness (right records, right values), response completeness.
- Reliability: repeated runs scoring, why an agent that reliably scores 85% is more valuable than one that scores 100% once and 60% on average.
- Efficiency: runtime, resource consumption, API call volume.
- Per-task isolation: each task runs against an isolated environment snapshot with a randomized operational date.

**7c. Special Nominations (always visible — compact)**

Listed inline or as small badges/tags: Safest Agent, Most Reliable Agent, Most Efficient Agent, Best Enterprise Team, Breakthrough Newcomer. One-line description each. The "Safest Agent" nomination should be visually slightly emphasized — per the brief, this is the nomination enterprise observers care most about and the one that embodies the "should vs. can" positioning.

**7d. Soft CTA (always visible — inline)**

A text-link prompt after the nominations: "Ready? Register →" linking to Section 6 (or Section 11 if user has scrolled past Section 6). Not a full CTA block — no background color, no box, no heading. Just an inline text link that catches convinced builders before they enter the enterprise section. **Stage 3 copy guidance:** This prompt should feel like a natural sentence ending the section, not a banner. E.g., "Seen enough? [Register now →]" or "Ready to test your agent? [Join the challenge →]."

### Mobile Behavior

- Summary dimensions stack vertically.
- Detailed criteria: collapsed by default. Full content on expand.
- Nominations: horizontal scroll of badge-style cards, or vertical stack if badges are too small to tap.
- Soft CTA: full-width text link, thumb-reachable.

---

## Partner Logo Bar (between Sections 7 and 8)

| Attribute | Value |
|---|---|
| **Purpose** | Credibility bridge before the enterprise section. Social proof for scrolling visitors; contextual validation for enterprise visitors arriving via `/#industry` who scroll up slightly. |
| **Primary audience** | All visitors, especially enterprise |
| **Visibility** | Always visible |
| **Content density** | Sparse — logos only, no accompanying text |

### Content Requirements

- Enterprise partner logos displayed at modest size in a single horizontal row. Per the brief's brand identity principle: "partners are acknowledged but not dominant."
- No section heading. No descriptive text. The logos speak for themselves.
- Placeholder slots acceptable for Stage 5 if partner confirmation is pending.
- This is not a numbered section — it's a visual divider element with content. It sits between Section 7 (Evaluation) and Section 8 (Enterprise) and serves as a credibility bridge: builders scrolling past it register that the challenge has institutional backing; enterprise visitors landing at `/#industry` see partner context immediately if they glance upward.

### Mobile Behavior

- Horizontal scroll or 2-column grid. Logos must remain recognizable at mobile scale.

---

## 8. For Industry Professionals (Enterprise Section)

| Attribute | Value |
|---|---|
| **Purpose** | Serve enterprise practitioners and leadership who arrive via `/#industry` or scroll to this section. Communicate enterprise-specific value without duplicating the builder flow. |
| **Primary audience** | Enterprise AI/digital practitioners (Tier 2), Enterprise leadership (Tier 4) |
| **Visibility** | Always visible |
| **Content density** | Medium — substance without overwhelming a non-builder audience |
| **Anchor ID** | `#industry` — linked from header nav "For Industry Professionals" and used in tailored distribution URLs |

### Standalone Entry Design

Visitors arriving directly at `/#industry` (via enterprise-targeted distribution) will land here without having read Sections 2–5. This section must work as a standalone entry point. It begins with a brief orienting block that establishes what ARC is before presenting the enterprise value proposition.

This orienting block is visible to all visitors but is primarily designed for direct-landing enterprise visitors. Scrolling visitors who have already read the builder flow will experience it as a brief transition — it must be short enough to not feel redundant.

### Content Requirements

**8a. Orienting Block (always visible — maximum 60 words)**

A compressed restatement of what ARC is, not a summary of the page above. The copywriter must hit three points in ≤60 words: (1) what ARC is (a global online challenge), (2) what participants do (build agents that operate in a simulated enterprise environment with real actions and policy constraints), and (3) how it's evaluated (automatically, on accuracy, reliability, and efficiency).

Content direction: "The Agents Reliability Challenge is a global online challenge where AI builders construct autonomous agents that operate in a simulated enterprise environment — creating records, enforcing policies, managing workflows, and knowing when to refuse unauthorized actions. Agents are evaluated automatically on accuracy, reliability, and efficiency."

The 60-word constraint is firm. Scrolling visitors should be able to read this block in under 10 seconds without feeling they're re-reading the hero.

**8b. Value for Practitioners (always visible)**

For in-house AI/ML teams, digital practitioners, and technically strong professionals:

- Hands-on exposure to modern agent architectures in a realistic environment you understand
- Low-risk way to test skills against the global AI community
- Structured onboarding with guided warm-up, SDK, and starter templates
- Compete alongside external AI builders — learn modern approaches firsthand
- "Best Enterprise Team" nomination for in-house industry teams

**8c. Value for Leadership / Observers (always visible)**

For CDOs, VP Digital, Heads of Innovation:

- See what autonomous agents can realistically handle in enterprise environments — through evaluated results, not slide decks
- Concrete benchmark data: which agent architectures work, which fail, what's ready for deployment
- Exposure to external AI talent with enterprise-aware thinking
- A low-risk way to understand the state of the art before committing to internal pilots

**8d. Participation Modes (collapsible — collapsed by default)**

Expandable block listing the ways enterprise partners can engage: active participation (internal teams), mixed teams, observers, judges/advisors, sponsors/local hosts, recruiters. Per the brief, this is multi-modal — not just "compete."

**8e. Enterprise CTA**

Not a full registration form repeat. A prominent CTA button ("Register Your Team" or "Get Involved") that scrolls down to Section 11 (the secondary registration form). This is the only direction — the CTA does not scroll up to Section 6.

Rationale: Enterprise visitors arriving via `/#industry` will scroll down through Section 8, then continue past the FAQ to Section 11. Scrolling up to Section 6 is counterintuitive and architecturally broken for the direct-landing case. Section 11 is a form instance (see Section 11 below), so the enterprise path always terminates at a working form below the visitor's current position.

Plus a secondary link: "Contact us for partnership or sponsorship inquiries" → mailto or simple contact form (Stage 2 decision).

### Mobile Behavior

- Orienting block: full visibility, no truncation.
- Value blocks: stack vertically.
- Participation modes: collapsed by default.
- CTA button: full-width, prominent.

---

## 9. FAQ

| Attribute | Value |
|---|---|
| **Purpose** | Handle objections and common questions. Reduce registration friction. |
| **Primary audience** | All visitors on the fence |
| **Visibility** | Collapsible accordion — questions visible, answers collapsed by default |
| **Content density** | Dense (when expanded) — this is the depth layer for visitors who need reassurance |
| **Anchor ID** | `#faq` — linked from header nav |

### Content Requirements

FAQ items should be derived from the brief's positioning and risk mitigation. Minimum set:

1. **Do I need oil & gas / energy industry experience?** (Answer: No. Firmly. This is the #1 filter to neutralize.)
2. **What programming language / framework should I use?** (Answer: Any. REST API, language-agnostic. Python SDK provided. Starter templates for LangChain, CrewAI, etc.)
3. **Can I participate as an individual or do I need a team?** (Answer: Both welcome.)
4. **How is my agent evaluated?** (Answer: Automatically, against built-in task criteria. Three dimensions: accuracy, reliability, efficiency. No subjective judging.)
5. **What does "policy enforcement" mean in the challenge?** (Answer: Some tasks require the agent to refuse an action because it exceeds the assigned role's authority. This is scored.)
6. **What's the time commitment?** (Answer: ~2 weeks warm-up at your own pace, then 1 day main challenge (~2–6 hours).)
7. **Is there a cost to participate?** (Answer: Free.)
8. **What do I win?** (Answer: Brief mention of grand prize and special nominations. Link to Section 7 for details. Do not lead with prize amounts.)
9. **I work at an energy company — how can my team participate?** (Answer: Direct to Section 8 for enterprise participation modes.)
10. **When does it start?** (Answer: Dates if confirmed; "Sign up to be notified" if not. Link to Section 4d timeline.)

### Format

- Accordion: question text always visible, answer expands on click/tap.
- Desktop: single column, full content width.
- Mobile: same accordion behavior. Answers may be slightly abbreviated if length is a concern, but content parity with desktop is preferred.

### Mobile Behavior

- Accordion works natively. No horizontal behavior.

---

## 10. Registration Form — Secondary Placement (Bottom CTA)

| Attribute | Value |
|---|---|
| **Purpose** | Catch visitors who scrolled past the primary form (Section 6) and are now ready to act after reading deeper content. Also serves as the conversion endpoint for the enterprise path (Section 8e CTA scrolls here). |
| **Primary audience** | All visitors who reached the bottom; enterprise visitors directed from Section 8e |
| **Visibility** | Always visible |
| **Content density** | Sparse |

### Content Requirements

- **CTA headline:** Different from Section 6 to avoid feeling repetitive. Oriented toward closure: "Join 100+ builders testing agents under real constraints" or "Don't miss Edition 1."
- **Compact inline registration form.** A minimal version of the registration form. The Stage 2 spec defines the full field set (name, email, optional country); this placement may use a subset (name + email) with a link to "complete your registration" for remaining fields, or the full field set if the form is short enough. The Stage 2 spec governs the exact field selection — but this placement is a form, not a button.

This is an architectural constraint, not a deferred decision. The enterprise path (Section 8e) depends on a working form below Section 8. A scroll-back button that sends visitors up to Section 6 breaks the `/#industry` direct-landing flow. This form instance must exist.

- **Activation links:** Same Discord and GitHub links as Section 6, repeated here for visitors who haven't seen them. Compact — one line each.

### Mobile Behavior

- Full-width form. Same behavior as Section 6.

---

## 11. Footer

| Attribute | Value |
|---|---|
| **Purpose** | Standard page closure. Legal, contact, social links. |
| **Primary audience** | All visitors |
| **Visibility** | Always visible |
| **Content density** | Sparse |

### Content Requirements

- Contact email or link
- Social links (Twitter/X, LinkedIn, Discord, GitHub) — icon row
- "Agents Reliability Challenge — Edition 1" or equivalent branding line
- Privacy policy link (required for registration form — see Stage 2)
- Copyright line

### Mobile Behavior

- Stacked vertically. Social icons in a single row.

---

## Scroll Order Summary

| # | Section | Anchor ID | Primary Audience | Density | Collapse Behavior |
|---|---|---|---|---|---|
| 1 | Header / Nav | — | All | Sparse | Sticky |
| 2 | Hero | — | All | Sparse | Never |
| 3 | Challenge Overview | — | Cold visitors | Medium | Never |
| 4 | How It Works | `#how-it-works` | Builders + practitioners | Medium | Task examples collapsed |
| 5 | Why Compete | `#builders` | AI builders | Medium | Never |
| 6 | Registration Form (primary) | `#register` | AI builders | Sparse | Never |
| 7 | Evaluation & Scoring | `#evaluation` | Builders + observers | Medium | Detailed criteria collapsed |
| — | Partner Logo Bar | — | All (credibility) | Sparse | Never |
| 8 | For Industry | `#industry` | Enterprise (Tiers 2 & 4) | Medium | Participation modes collapsed |
| 9 | FAQ | `#faq` | All (fence-sitters) | Dense (expanded) | Accordion |
| 10 | Registration Form (secondary) | — | All + enterprise path | Sparse | Never |
| 11 | Footer | — | All | Sparse | Never |

**Section numbering note:** The original spec used Sections 1–12. This revision removes the standalone Partners & Community section (original Section 9), splits its content (partner logos become an unnumbered visual bar; Discord/GitHub links move to Section 6), and adds content within existing sections (3b, 4d, 5 value point, 7d, 8a constraint). The result is Sections 1–11 plus one unnumbered visual element. Downstream stages should reference this numbering.

---

## Audience Navigation Paths

### Path 1: AI Builder (Primary Scroll Flow)

The default scroll order is optimized for this path. A builder arriving from any channel reads: Hero → Challenge Overview → How It Works (with dates) → Why Compete → **Registration Form** → (optionally) Evaluation & Scoring → FAQ.

The registration form (Section 6) is placed at the natural decision point after the value proposition. Builders who are convinced by Sections 2–5 should not have to scroll further to act. Builders who want more detail (evaluation mechanics, FAQ) continue scrolling. A soft CTA at the end of Section 7 catches those who are convinced by the evaluation detail. The secondary registration form (Section 10) catches everyone else at the bottom.

Header nav "For AI Builders" links to Section 5 (`#builders`), skipping the general overview sections for visitors who already know what ARC is.

### Path 2: Enterprise Professional (Direct Landing)

Enterprise contacts receive links with `/#industry` anchor. They land directly on Section 8, which opens with the standalone orienting block (≤60 words) providing ARC context. After reading the enterprise value proposition, the section's CTA (Section 8e) scrolls them **down** to Section 10 (the secondary registration form). The path is always forward — never backward.

Header nav "For Industry Professionals" links to Section 8 (`#industry`).

Enterprise visitors who scroll up from Section 8 encounter the partner logo bar and then the builder-focused content, which reinforces the challenge's technical credibility. Enterprise visitors who scroll down pass through FAQ (which handles enterprise-specific questions in Q9) and reach the registration form in Section 10.

### Path 3: Curious Browser (Cold, from HN/Reddit/Newsletter)

This visitor reads everything. The scroll order is designed for them: hero hooks, overview explains (including the "Gap" problem statement), how-it-works makes it concrete (including dates), value proposition speaks to them (they are builders), form captures them. If they're not ready, the evaluation details, FAQ, and secondary form catch them at the bottom.

---

## Collapsible Content Inventory

| Section | Collapsible Block | Default State (Desktop) | Default State (Mobile) | Trigger |
|---|---|---|---|---|
| 4c | Task Examples | Collapsed | Collapsed | "See example tasks" link/button |
| 7b | Detailed Evaluation Criteria | Collapsed | Collapsed | "See how scoring works" link/button |
| 8d | Enterprise Participation Modes | Collapsed | Collapsed | "See all participation options" link/button |
| 9 | FAQ answers | Collapsed (questions visible) | Collapsed (questions visible) | Tap/click question |

**Collapse implementation note:** All collapsible content should use `<details>/<summary>` HTML elements or equivalent JS toggle — no framework needed. Smooth height transitions preferred but not required for Stage 5. Collapsed content must be present in the DOM for SEO and anchor linking.

---

## Registration Form Placement Summary

| Instance | Location | Type | Purpose |
|---|---|---|---|
| Primary | Section 6 (after builder value prop) | Full embedded form | Main conversion point for builder flow |
| Secondary | Section 10 (bottom of page) | Compact inline form (architectural requirement — not a deferred decision) | Catch late-deciders + enterprise path endpoint |
| Enterprise CTA | Section 8e | Button scrolling **down** to Section 10 | Enterprise-specific entry point |
| Soft CTA | Section 7d | Inline text link to nearest form | Catch post-evaluation convinced builders |
| Header CTA | Section 1 (sticky nav) | Button linking to nearest form | Persistent access |

---

## Content Density Map

```
Section:     1    2    3a   3b   4a   4b   4c   4d   5    6    7a   7b   7c   [logos] 8    9    10   11
Density:     ·    ·    ██   █    ██   ██   ████ █    ██   ·    ██   ████ ██   ·      ██   ████ ·    ·
             ↑         ↑    ↑              ↑    ↑                   ↑                ↑
           sparse    med  brief          dense brief               dense            dense
                                       (collapsed)              (collapsed)       (collapsed)
```

The page alternates between sparse (breathing room / CTAs) and medium-density content. Dense content is always behind a collapse toggle, so the default scroll experience never hits a wall of text. The new additions (3b, 4d) are brief blocks that don't increase density — they fill content gaps without adding weight.

---

## OG / Social Preview Requirements

Defined in detail in Stage 4 (Tech Spec). Content architecture implications:

- **OG title:** Should use the "should vs. can" positioning line or a close variant. Not "ARC — Agents Reliability Challenge" (too generic for a social card).
- **OG description:** The elevator pitch from Section 2 hero subline. ~150 characters.
- **OG image:** A designed card (1200×630px) with the ARC brand and positioning line. Not a screenshot of the page.
- **Platform priority:** Telegram (inline OG card), LinkedIn, WhatsApp. Twitter cards for second-wave readiness.

---

## Analytics Anchor Points

Defined in detail in Stage 4 (Tech Spec). Content architecture implications:

Each section with an anchor ID should fire a scroll-depth event when it enters the viewport. Key conversion tracking points:

- Hero CTA click
- Section 6 form view (scroll-triggered)
- Section 6 form submission
- Section 7d soft CTA click
- Section 8 (`#industry`) direct landing (page load with anchor)
- Section 8e enterprise CTA click
- Section 10 secondary form view and submission
- Collapsible block expansions (each tracked individually)
- External link clicks (Discord, GitHub, partner links)

Attribution anchors for Telegram/WhatsApp (which strip UTM parameters): support distinct short URLs or channel-specific landing anchors (e.g., `/#t` for Telegram, `/#li` for LinkedIn) as a fallback attribution mechanism. Detail in Stage 4.

---

## Notes for Subsequent Stages

**For Stage 2 (Registration Form Design):**
- Form appears in two locations (Section 6 and Section 10). Section 10 is a compact form variant — decide which fields it includes (minimum: name + email; full set if the form is short enough). This is a form-design decision, not an architecture decision — the architecture requires a form, not a button.
- Enterprise CTA in Section 8e may need an enterprise-specific parameter appended to the Section 10 form submission for attribution.
- Privacy and GDPR compliance approach needed for global registration.

**For Stage 3 (Website Copy):**
- Hero headline is the most consequential piece of copy. Allocate disproportionate iteration time.
- Section 3a (Challenge Overview blocks) must communicate the four mandatory points from the brief without reading like a checklist. Find a natural prose or visual rhythm. Each block: ≤2 sentences body text (this is a hard constraint for mobile).
- Section 3b ("Gap" narrative) should be 2–3 sentences, problem-statement register. Not aspirational, not corporate. Tone: "here's the reality, here's the gap, here's what we're doing about it."
- Section 4d (Key Dates) accepts placeholder text. Write the placeholder: "Dates announced soon — register to be notified."
- Section 5 "Beyond prizes" value point: write as a concrete but honest statement. If specific incentives aren't confirmed, use directional language ("Top participants may be featured...") rather than promises.
- Section 7d soft CTA: write as a natural sentence ending the section. Not a heading, not a banner.
- Section 8a orienting block: ≤60 words, firm. Must hit three points: what ARC is, what participants do, how it's evaluated.
- Section 8 orienting block must be concise enough to not feel redundant for scrolling visitors, but complete enough to orient a direct-landing enterprise visitor. The 60-word constraint enforces this.
- FAQ answers should be written in a direct, non-corporate voice. Per the brief's brand identity: "community initiative with industry support — not a corporate hackathon."
- The domain reveal (Section 4b) should feel natural, not buried or apologetic: "The simulated environment is an operations & maintenance system" stated matter-of-factly.

**For Stage 4 (Tech Spec):**
- Sticky header with scroll-aware "Register" button targeting nearest form instance requires JS.
- `/#industry` direct landing: page should scroll to Section 8 on load if anchor is present. Ensure the orienting block is at the top of the viewport.
- Collapsible blocks: native `<details>/<summary>` preferred. Test on Telegram's in-app browser.
- OG metadata must be optimized for Telegram inline preview (Telegram uses specific OG tags and caches aggressively — test with Telegram's link preview tool).
- Analytics: lightweight implementation. No third-party analytics library heavier than ~10KB. Consider Plausible, Fathom, or a minimal custom event tracker.
- Partner logo bar is a visual element, not a section with anchor navigation. It does not need a scroll-depth event but should be accounted for in layout.

**For Stage 5 (Build Prototype):**
- Placeholder content is acceptable for: partner logos, exact dates (Section 4d), non-monetary incentive details (Section 5 "Beyond prizes"), prize amounts.
- The prototype must be testable on mobile (Telegram in-app browser, LinkedIn in-app browser, Safari, Chrome).
- **Critical test: `/#industry` hash anchor behavior.** Test in Telegram in-app browser, LinkedIn in-app browser, and WhatsApp in-app browser. If native hash anchors are unreliable in any of these environments, implement JS-based scroll-on-load as fallback. This is a real risk for the enterprise path — do not defer to post-launch.
- Performance target: Lighthouse performance score ≥ 90 on mobile. No render-blocking resources.
