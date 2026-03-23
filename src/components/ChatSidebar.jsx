import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../data/promptBuilder'

export default function ChatSidebar({ originalPrompt, guideContent, chatMessages, setChatMessages, onClose }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, loading])

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSend(e) {
    e.preventDefault()
    const userMessage = input.trim()
    if (!userMessage || loading) return

    const newMessages = [...chatMessages, { role: 'user', content: userMessage }]
    setChatMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await sendChatMessage({
        systemPrompt: originalPrompt,
        guideContent,
        chatHistory: chatMessages,
        userMessage,
      })
      setChatMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setChatMessages([...newMessages, { role: 'assistant', content: `**Error:** ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-sidebar">
      <div className="chat-header">
        <h3>Chat about your guide</h3>
        <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">&times;</button>
      </div>

      <div className="chat-messages">
        {chatMessages.length === 0 && !loading && (
          <div className="chat-empty">
            Ask follow-up questions about your generated guide. The full context is retained.
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <div className="chat-bubble-label">{msg.role === 'user' ? 'You' : 'Assistant'}</div>
            <div className="chat-bubble-content" dangerouslySetInnerHTML={{ __html: simpleMarkdown(msg.content) }} />
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <div className="chat-bubble-label">Assistant</div>
            <div className="chat-typing"><span /><span /><span /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Ask a follow-up question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

function simpleMarkdown(text) {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}
