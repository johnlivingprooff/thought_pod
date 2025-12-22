import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendNoteNotification({
  contributorName,
  content,
  episodeId,
  noteId,
}: {
  contributorName?: string;
  content: string;
  episodeId?: string;
  noteId: string;
}) {
  const displayName = contributorName || 'Anonymous';
  const subject = contributorName
    ? `@${contributorName} has added a Thought Note`
    : 'A contributor has added a Thought Note';

  const episodeText = episodeId ? ` (Episode: ${episodeId})` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
          }
          .title {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 10px 0;
          }
          .subtitle {
            color: #718096;
            font-size: 16px;
            margin: 0;
          }
          .note-content {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            white-space: pre-wrap;
            line-height: 1.5;
            color: #2d3748;
          }
          .meta-info {
            background: #edf2f7;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 14px;
            color: #4a5568;
          }
          .action-button {
            display: inline-block;
            background: #3182ce;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
            transition: background-color 0.2s;
          }
          .action-button:hover {
            background: #2c5282;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #a0aec0;
            font-size: 14px;
          }
          .note-preview {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
            font-size: 14px;
            color: #4a5568;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">${subject}</h1>
            <p class="subtitle">New community contribution${episodeText}</p>
          </div>

          <div class="meta-info">
            <strong>Contributor:</strong> ${displayName}<br>
            <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
            ${episodeId ? `<strong>Episode:</strong> ${episodeId}<br>` : ''}
            <strong>Note ID:</strong> ${noteId}
          </div>

          <h3 style="color: #2d3748; margin: 25px 0 15px 0;">Note Content:</h3>
          <div class="note-content">${content.replace(/\n/g, '<br>')}</div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/notes/admin" class="action-button">
              Login & Publish Note
            </a>
          </div>

          <div class="note-preview">
            <strong>Preview:</strong><br>
            This note is currently pending review. Please log in to the admin panel to review and publish it.
          </div>

          <div class="footer">
            <p>This is an automated notification from Thought Pod community notes.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Thought Pod" <${process.env.EMAIL_USER}>`,
      to: 'johnlivingprooff@gmail.com',
      subject,
      html,
    });
    console.log('Note notification email sent successfully');
  } catch (error) {
    console.error('Failed to send note notification email:', error);
    // Don't throw error to avoid breaking the note submission
  }
}