

### 🧠 **Prompt: Week 4 – 6 Development (Thought Podcast Website)**

**Context:**
The Thought Podcast website is an immersive, mobile-first experience built with Next.js (TypeScript).
It already features:

* A cosmic starfield background video/animation.
* RSS integration that fetches and displays podcast episodes dynamically.
* A player for the latest episode and a responsive UI.
* Introductory “About” content summarizing the 4 Cs: *Capacity, Connection, Condition, Commission.*

The next stage (Weeks 4–6) should **build on that foundation** — turning it from a functional app into an emotionally resonant, living digital space.

---

### 🧩 **Your Tasks**

#### **1. Deepen the Immersion (Visual + Audio Layer)**

* Implement a **WebGL-powered background** (using Three.js or react-three-fiber) to replace the static looping video with a *lightweight interactive starfield* that:

  * Responds to cursor/touch movement (slow parallax or drift).
  * Adjusts subtly based on scroll position (as user moves through sections).
  * Has optional ambient motion, maintaining performance on mobile.
* Add **ambient background audio** (looped, subtle “space hum” or soft tone) with:

  * A mute/unmute toggle icon (persistent state).
  * Autoplay off by default for compliance, but prompt users gently to “Enter the Space” (which triggers sound).
  * Use the Web Audio API or Howler.js for handling sound layers.

---

#### **2. 4 Cs Interactive Story Section**

Create a **scroll-based storytelling sequence** that introduces each of the 4 Cs:

* As the user scrolls, fade/slide through each *C* with minimalist text and motion.
* Each section should have:

  * A symbolic visual (simple geometric or abstract representation).
  * A short quote or line that defines the *C* philosophically.
* The background starfield subtly shifts tone or brightness per section.
* (Optional) If performance allows, link the visuals to the mouse/touch position for gentle movement.

You can use **Framer Motion** or **GSAP ScrollTrigger** for transitions and timeline control.

---

#### **3. The Experience Layer**

* Implement a **“Thought Flow”** animation that occurs when users load or navigate between pages.
  Example: A line of light traveling through stars, symbolizing a “thought forming.”
* Smooth transitions between “Now Playing,” “About,” and “Episodes” pages — no harsh reloads.
* Consider a small **easter egg interaction**, like:

  * Clicking a star could show a random “thought” or quote from the podcast.
  * Or, when a user hovers over a *C*, a word cloud expands for a moment.

---

#### **4. Performance + Accessibility**

* Optimize Three.js scene and audio playback for mobile.
* Add lazy loading for all assets and prefetch routes.
* Ensure high Lighthouse scores on mobile.
* Implement accessible labels for audio and navigation.

---

#### **5. (Optional Stretch Goal)**

Build a “**Thought Capsule**” component:
A floating modal that shows short excerpts or soundbites (30 s–1 min) from different episodes, fetched from the RSS metadata or a static JSON file.

* Users can tap a star → see a “Thought Capsule.”
* Capsule includes episode title, a 1–2 sentence excerpt, and “Listen Full Episode” CTA.

---

### ⚙️ **Deliverables**

By the end of Week 6, the site should:

1. Feel like an **interactive digital cosmos**.
2. Present the 4 Cs as a narrative experience, not just text.
3. Include audio ambience, star interactivity, and soft navigation transitions.
4. Retain speed and responsiveness on mobile.

---

### 💡 **Design Guidance**

* Keep everything minimal and fluid — black background, white/light accents, faint glow.
* Typography should feel poetic yet readable (e.g., *Inter*, *Space Grotesk*, *Poppins*).
* Animation should feel *alive*, not gimmicky — each motion serves to pull the visitor inward.

