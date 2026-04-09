const ChatResponse = ({ messages, onTalkToPDF }) => {
    if (!messages || messages.length === 0) {
        return null;
    }

    // Helper to format text into paragraphs and basic markdown safely
    const formatParawise = (text) => {
        if (!text) return null;
        
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
        
        return paragraphs.map((para, i) => {
            const lines = para.trim().split('\n');
            return (
                <div key={i} style={{ marginBottom: '1.25rem' }}>
                    {lines.map((line, j) => {
                        // Handle Bold
                        let content = line.split(/(\*\*.*?\*\*)/g).map((part, k) => {
                           if (part.startsWith('**') && part.endsWith('**')) {
                               return <strong key={k} style={{ color: 'var(--accent-gold)' }}>{part.slice(2, -2)}</strong>;
                           }
                           return part;
                        });

                        // Handle Lists
                        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                            return (
                                <div key={j} style={{ display: 'flex', gap: '8px', paddingLeft: '1rem', marginTop: '4px' }}>
                                    <span style={{ color: 'var(--accent-orange)' }}>•</span>
                                    <span>{content.slice(1)}</span>
                                </div>
                            );
                        }
                        
                        return <div key={j} style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="chat-response-container">
            {messages.map((msg, index) => (
                <div 
                    className={`message-bubble ${msg.role === 'user' ? 'message-user' : 'message-ai'} ${msg.isSystem ? 'message-system' : ''}`} 
                    key={index}
                >
                    <div className="message-content">
                        {formatParawise(msg.text)}
                    </div>

                    {/* Inline Discovery Sections */}
                    {msg.arxiv && msg.arxiv.length > 0 && (
                        <div className="discovery-section inline-discovery">
                            <h4 className="discovery-title">arXiv Discovery</h4>
                            <div className="horizontal-scroll">
                                {msg.arxiv.map((paper, i) => (
                                    <div key={i} className="discovery-card arxiv">
                                        <h3>{paper.title}</h3>
                                        <p className="card-meta">{paper.authors}</p>
                                        <div className="card-actions">
                                            <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="pill-btn secondary">Source</a>
                                            <button onClick={() => onTalkToPDF(paper)} className="pill-btn primary">Talk with PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {msg.scholar && msg.scholar.length > 0 && (
                        <div className="discovery-section inline-discovery">
                            <h4 className="discovery-title">Deep Literature (Scholar)</h4>
                            <div className="horizontal-scroll">
                                {msg.scholar.map((paper, i) => (
                                    <div key={i} className="discovery-card scholar">
                                        <h3>{paper.title}</h3>
                                        <p className="card-meta">{paper.authors} | {paper.citations} Citations</p>
                                        <div className="card-actions">
                                            <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="pill-btn secondary">Source</a>
                                            <button onClick={() => onTalkToPDF(paper)} className="pill-btn primary">Talk with PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ChatResponse;