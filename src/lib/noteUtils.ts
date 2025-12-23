/**
 * Truncate note content to show only the first paragraph or up to 4 lines
 * @param content - The markdown content to truncate
 * @returns Truncated content with ellipsis if needed
 */
export function truncateNoteContent(content: string): string {
  if (!content) return '';

  // Split by paragraphs (double newlines)
  const paragraphs = content.split(/\n\s*\n/);

  // If there's only one paragraph, truncate it to approximately 4 lines
  if (paragraphs.length === 1) {
    const lines = content.split('\n');
    if (lines.length <= 4) {
      return content;
    }

    // Take first 4 lines and add ellipsis
    const truncated = lines.slice(0, 4).join('\n');
    return truncated + (lines.length > 4 ? '\n...' : '');
  }

  // If multiple paragraphs, show only the first one
  return paragraphs[0] + '\n...';
}