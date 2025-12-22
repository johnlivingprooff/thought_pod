# Full Next.js 15 UI / UX Design Prompt

**Feature:** `/notes` – Thought Podcast Community Notes Page
**Framework:** Next.js 15 (App Router)
**Design Philosophy:** Lightweight, contemplative, community-first, editorial without hierarchy abuse

---

## 1. Overall Page Intent

Design a **public-facing Notes page** that acts as:

* A living blog
* A community notebook
* A reflective extension of a podcast

The page must feel:

* Quiet but alive
* Thoughtful, not noisy
* Editorial but participatory
* Lightweight in interaction and visual weight

No dashboards. No admin panel aesthetic.
Everything is written **in the open**.

---

## 2. Global Layout Structure

### Page Route

`/notes`

### Layout Hierarchy (Top → Bottom)

1. **Hero Context (Minimal)**
2. **Latest Notes Section**
3. **Add a Note Section**
4. **Notes Feed (Scrollable)**
5. **Footer Context (Subtle)**

The layout should guide the eye **vertically**, with soft sectional separation.

---

## 3. Background & Atmosphere

### Background

* Inherit the **main site background**:

  * Animated shooting stars
  * Subtle parallax movement
  * Implemented with **Three.js**
* Background must:

  * Be visually present
  * Never compete with text
  * Be slightly blurred or dimmed under content cards

Use a translucent overlay layer (`rgba` or `backdrop-filter`) to ensure readability.

---

## 4. Latest Notes Section (Above the Fold)

### Purpose

Give users an immediate sense that:

* This space is alive
* Both hosts and community are thinking together

### Layout

Two **featured note cards**, side by side on desktop, stacked on mobile:

#### Card A: Latest Episode Note

* Source: Admin / Host
* Displays:

  * Episode title
  * Short excerpt (3–4 lines)
  * Author label: “From the host”
* Visual priority: slightly larger

#### Card B: Latest Community Note

* Source: Community
* Displays:

  * Short excerpt
  * Optional author name or “Anonymous”
  * Linked episode (if applicable)
* Visual priority: slightly smaller

### Visual Style

* Cards should look like **transparent sticky notes**
* Characteristics:

  * Soft rounded corners
  * Slight tilt variation (1–2° rotation)
  * Subtle drop shadow
  * Frosted-glass transparency
* No hard borders

---

## 5. Add a Note Section (Core Interaction)

### Placement

Immediately below Latest Notes.

### UI Inspiration

**GitHub Pull Request comment box**

### Visual Design

* Neutral, grounded container
* Slightly elevated from background
* Clear affordance: “This is where you write”

### Fields

* Episode selector (optional dropdown)
* Name input (optional)
* Text area (primary focus)
* Submit button

### Behavior

* No login wall for community
* Admin sees **extra controls**, but:

  * Same UI
  * No visual dominance

---

## 6. Admin UX Enhancements (Invisible Power)

Admins use the **same interface**, but gain:

### Admin-Only UI Enhancements

* “Publish immediately” toggle
* Episode pinning option
* Editorial highlight checkbox
* Moderation status badge visibility

These controls:

* Appear inline
* Are visually subtle
* Never disrupt the community aesthetic

### Admin Notes Visual Distinction

* Small “Editorial” badge
* Slightly stronger contrast
* No color that implies authority dominance

---

## 7. Notes Feed (Main Body)

### Structure

Vertical feed of note cards.

### Filtering (Optional, Minimal)

* By episode
* By newest / featured
* By editorial vs community

### Note Card Design

* Same sticky-note aesthetic
* Slight random rotation for organic feel
* Soft hover effect (lift + clarity)
* No engagement counters (no likes by default)

### Content Display

* Author name or “Anonymous”
* Episode reference (if attached)
* Timestamp (human readable)
* Content body

---

## 8. Interaction Principles

* No infinite scroll abuse
* Gentle pagination or “Load more”
* No aggressive animations
* Transitions should be slow and intentional

---

## 9. Typography & Tone

### Typography

* Editorial serif or humanist sans-serif
* Large line height
* Comfortable reading width

### Tone

* Calm
* Thoughtful
* Inviting reflection

Avoid:

* Tech-heavy UI language
* Social media patterns
* Gamification

---

## 10. Accessibility & Performance

* Text contrast meets WCAG AA
* Keyboard-navigable forms
* Three.js background must:

  * Pause on low-power devices
  * Be optional for reduced motion users

---

## 11. Technical Assumptions (UI-Level)

* Next.js 15 App Router
* Server Components for read views
* Client Components for:

  * Add Note form
  * Admin controls
* JSON-fed rendering from SQLite-backed API
* No visible admin dashboard routes

---

## 12. Emotional Outcome (Design Success Metric)

A user should leave thinking:

> “This feels like a quiet room where people think together.”

Not:

* “This is a comment section”
* “This is a blog”
* “This is social media”
