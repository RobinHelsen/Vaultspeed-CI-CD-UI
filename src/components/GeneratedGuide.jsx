export default function GeneratedGuide({ content, loading, error }) {
  if (loading) {
    return (
      <div className="result-panel loading">
        <div className="loading-spinner" />
        <p>Generating your CI/CD guide...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-panel error-panel">
        <p><strong>Error:</strong> {error}</p>
      </div>
    )
  }

  if (!content) {
    return null
  }

  // Simple markdown-to-HTML (handles headers, bold, code blocks, lists)
  const html = markdownToHtml(content)

  return (
    <div className="result-panel generated-guide">
      <div className="guide-content" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function markdownToHtml(md) {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Unordered lists
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ol> or <ul> (simplified)
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines
    .replace(/\n/g, '<br/>')

  return `<p>${html}</p>`
}
