import { useRef } from 'react'

export default function GeneratedGuide({ content, loading, error }) {
  const guideRef = useRef(null)

  const exportToPdf = () => {
    if (!guideRef.current) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = guideRef.current.innerHTML

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>VaultSpeed CI/CD Guide</title>
  <style>
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #1a1a1a;
      background: #ffffff;
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 40px;
    }
    h2, h3, h4 { color: #0f4c81; margin-top: 1.4em; }
    h2 { font-size: 1.5em; border-bottom: 2px solid #0f4c81; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1.1em; }
    pre {
      background: #f4f4f5;
      padding: 12px 16px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 0.9em;
      line-height: 1.5;
    }
    code {
      background: #f4f4f5;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre code { background: none; padding: 0; }
    ul, ol { padding-left: 1.5em; }
    li { margin-bottom: 0.3em; }
    strong { color: #111; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
    th { background: #f0f0f0; }
    @media print {
      body { padding: 0; margin: 0; }
    }
  </style>
</head>
<body>${html}</body>
</html>`)
    printWindow.document.close()
    // Wait for content to render, then trigger print dialog
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

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
      <div className="guide-export-bar">
        <button
          className="export-pdf-button"
          onClick={exportToPdf}
        >
          Export to PDF
        </button>
      </div>
      <div className="guide-content" ref={guideRef} dangerouslySetInnerHTML={{ __html: html }} />
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
