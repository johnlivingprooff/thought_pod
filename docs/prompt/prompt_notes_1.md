## ✅ FULL STACK BUILD PROMPT (Next.js 15)

> **Context:**
> Build a lightweight, community-driven `/notes` system for a podcast using **Next.js 15 (App Router)** with **SQLite** as the source of truth and **JSON exports for fast reads**.

---

### 📌 Requirements

#### Tech Stack

* Next.js 15 (App Router)
* SQLite (better-sqlite3 or sqlite)
* Server Actions
* Route Handlers
* No external auth providers

---

### 📁 Pages & Routes

#### Public Pages

* `/notes`

  * List all published notes
  * Filter by episode
  * Highlight admin/editorial notes
* `/notes/episode/[slug]`

  * Episode summary
  * Editorial notes
  * Community notes
* `/notes/admin`

  * Admin login (key-based)

---

### ✍️ Writing Interface

* Single “Add a Note” form for everyone
* Fields:

  * Episode (optional)
  * Display name (optional)
  * Content (markdown supported)
* No role selection in UI

---

### 🔐 Admin Authentication

* Admin login via secret key
* Secret stored in `process.env.ADMIN_SECRET`
* On successful login:

  * Set signed HTTP-only cookie (`role=admin`)
* Admin session validated server-side only
* No admin role stored or trusted from client

---

### 🗄 Database Schema (SQLite)

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  episode_id TEXT,
  author_name TEXT,
  author_type TEXT CHECK(author_type IN ('admin','community')) NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK(status IN ('published','pending','flagged')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 🔁 Write Flow

* POST note via Server Action
* Server:

  * Verifies admin session
  * Assigns `author_type`
  * Sets status:

    * admin → published
    * community → pending or published
  * Inserts into SQLite

---

### 📤 Read Flow

* Query only `published` notes
* Export results to JSON cache
* Frontend consumes JSON

---

### 🛡 Security Constraints

* All role checks server-side
* Signed cookies only
* Rate limit write endpoints
* Parameterized SQL queries
* No localStorage auth

---

### 🧠 Philosophy

* Front-facing for all users
* Authority without hierarchy
* Moderation without hostility
* Notes as living documents

---

## Final Truth Check

You are:

* Not creating an admin dashboard
* Not trusting the client
* Not overengineering
* Not sacrificing safety for openness

This architecture is **sound**, **secure**, and **aligned** with your intent.

