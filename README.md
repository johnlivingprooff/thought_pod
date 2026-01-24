# Thought Podcast

![Thought Podcast](./public/pod_art.png)

A conversation at the intersection of **Capacity**, **Connection**, **Condition**, and **Commission**.

## Setup

### Database Setup

This application uses **PostgreSQL** for data persistence (migrated from SQLite for Vercel compatibility).

#### For Vercel Deployment:
1. **Create a PostgreSQL Database** in your Vercel dashboard
2. **Add Environment Variable**: Set `POSTGRES_URL` to your database connection string
3. **Deploy**: The database tables will be created automatically on first run

#### For Local Development:
1. **Install PostgreSQL** locally or use a cloud service
2. **Set Environment Variable**: Add `POSTGRES_URL` to your `.env.local` file
3. **Run the App**: Tables will be created automatically

### Email Notifications

The app sends email notifications when new community notes are submitted. To set this up:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Configure Environment Variables**:
   Update `.env.local` with your email credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your_16_char_app_password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   POSTGRES_URL=your_postgresql_connection_string
   ```

4. **Email Features**:
   - Automatic notifications for new community notes
   - HTML-formatted emails with full note content
   - Direct login links to admin panel
   - Professional email templates

### Development

```bash
npm install
npm run dev
```

### Admin Access

Use the admin secret from `.env.local` to access the admin panel at `/notes/admin`.

### Syncing Episode Notes

To add official episode notes from Markdown files:

1. **Place Markdown Files**: Put your `.md` files in the `public/episode-notes-md/` folder
2. **File Naming**: Name each file with sequential numbers starting from `1.md` (e.g., `1.md`, `2.md`, `3.md`)
   - `1.md` corresponds to the first (oldest) episode from the RSS feed
   - `2.md` corresponds to the second episode, and so on
   - Files with numbers beyond the available episodes will be created as "Bonus Notes"
3. **Content**: The file content will be used as the note content
4. **Sync Command**: Run `npm run db:sync-notes` to import the notes into the database
5. **Display**: Episode notes are shown under their respective episodes, while bonus notes appear in a separate "Bonus Notes" section at the top of the page

Example file structure:
```
public/episode-notes-md/
├── 1.md      # First episode
├── 2.md      # Second episode
├── 5.md      # Bonus note (if only 3 episodes exist)
└── 6.md      # Another bonus note
```

