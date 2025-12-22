# Thought Podcast

![Thought Podcast](./public/pod_art.png)

A conversation at the intersection of **Capacity**, **Connection**, **Condition**, and **Commission**.

## Setup

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

