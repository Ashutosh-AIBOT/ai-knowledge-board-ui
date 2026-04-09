const WikiPointModal = ({ point, onClose }) => {
    if (!point) return null;

    // Helper to format text into paragraphs
    const formatContent = (text) => {
        if (!text) return null;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
        return paragraphs.map((para, i) => (
            <p key={i} style={{ marginBottom: '1.25rem', lineHeight: '1.6', color: '#ccc' }}>
                {para.trim()}
            </p>
        ));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{point.title}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>
                <section className="modal-body">
                    {formatContent(point.content)}
                </section>
                <footer className="modal-footer">
                    <span style={{ fontSize: '0.65rem', color: '#444' }}>Atomic Knowledge Node · Compiled Source</span>
                </footer>
            </div>
        </div>
    );
};

export default WikiPointModal;
