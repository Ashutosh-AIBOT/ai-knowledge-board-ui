import { useState } from "react";
import FileUpload from "./FileUpload";

const MODELS = [
    { id: "nvidia/llama-3.1-nemotron-nano-8b-v1", name: "Nemotron Nano 8B", speed: "Ultra", tier: "Core", desc: "Best for fast analysis" },
    { id: "meta/llama-3.1-8b-instruct", name: "Llama 3.1 8B", speed: "Fast", tier: "Mid", desc: "General purpose reasoning" },
    { id: "meta/llama-3.2-3b-instruct", name: "Llama 3.2 3B", speed: "Ultra", tier: "Core", desc: "Lightweight & efficient" },
    { id: "mistralai/mistral-7b-instruct-v0.3", name: "Mistral 7B", speed: "Fast", tier: "Mid", desc: "Precise instruction logic" },
    { id: "google/gemma-2-9b-it", name: "Gemma 2 9B", speed: "Mid", tier: "High", desc: "Deep creative synthesis" },
    { id: "deepseek-ai/deepseek-r1-distill-llama-8b", name: "DeepSeek R1 8B", speed: "Mid", tier: "High", desc: "Complex research math" },
    { id: "meta/llama-3.1-70b-instruct", name: "Llama 3.1 70B", speed: "Balanced", tier: "Elite", desc: "Elite research capability" },
];

const ChatInput = ({ onSubmit, onProcessed, onLitSearch, disabled, selectedModel, onModelChange }) => {
    const [question, setQuestion] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [activeSource, setActiveSource] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim() && !disabled) {
            onSubmit(question);
            setQuestion("");
        }
    }

    const handleSearch = (source) => {
        if (question.trim() && !disabled) {
            onLitSearch(question, source);
            setActiveSource(source);
            // Don't clear question immediately so user sees what they searched
        }
    }

    const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

    return (
        <div className="input-fixed-container">
            <div className="input-bar expanded-bar glass-effect">
                
                {/* 1. Model Selection */}
                <div className="model-selector-wrapper">
                    <button type="button" className="model-selector-btn premium-btn"
                        onClick={() => setShowPicker(!showPicker)}>
                        <div className={`btn-indicator ${selectedModel ? 'active-pulse' : ''}`}></div>
                        <span>🧠 {currentModel.name.split('/')[1] || currentModel.name}</span>
                    </button>
                    
                    {showPicker && (
                        <>
                            <div className="picker-modal-backdrop" onClick={() => setShowPicker(false)}></div>
                            <div className="model-popover">
                                <div className="picker-header">
                                    <h3>🧠 Intelligence Core</h3>
                                    <p>Select a reasoning model for this session</p>
                                </div>
                                <div className="model-list-scrollable">
                                    {MODELS.map(m => (
                                        <button key={m.id}
                                            className={`model-row-card ${m.id === selectedModel ? 'active' : ''}`}
                                            onClick={() => { onModelChange(m.id); setShowPicker(false); }}>
                                            <div className="row-content">
                                                <div className="row-main">
                                                    <span className="m-name">{m.name.split('/')[1] || m.name}</span>
                                                    <span className={`m-speed speed-${m.speed.toLowerCase()}`}>{m.speed}</span>
                                                </div>
                                                <p className="m-desc">{m.desc}</p>
                                            </div>
                                            <div className="row-check">
                                                {m.id === selectedModel && <div className="check-dot"></div>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* 2 & 3. Literature Discovery + PDF */}
                <div className="discovery-buttons">
                    <button type="button" 
                        className={`lit-search-btn deep-lit ${activeSource === 'scholar' ? 'active-glow' : ''}`}
                        onClick={() => handleSearch('scholar')}
                        disabled={disabled || !question.trim()}>
                        🌐 Deep Lit
                    </button>
                    <button type="button" 
                        className={`lit-search-btn arxiv-btn ${activeSource === 'arxiv' ? 'active-glow' : ''}`}
                        onClick={() => handleSearch('arxiv')}
                        disabled={disabled || !question.trim()}>
                        📚 arXiv
                    </button>
                    <button type="button" 
                        className={`lit-search-btn both-btn ${activeSource === 'both' ? 'active-glow' : ''}`}
                        onClick={() => handleSearch('both')}
                        disabled={disabled || !question.trim()}>
                        ⚡ Dual
                    </button>
                    
                    <FileUpload onProcessed={onProcessed} />
                </div>

                {/* 4. Input Bar */}
                <form onSubmit={handleSubmit} className="premium-search-form">
                    <input type="text" 
                        placeholder="Search papers or ask AI reasoning core..." 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)} 
                        disabled={disabled} />
                    <button type="submit" className="send-btn" disabled={disabled || !question.trim()}>
                        🚀 Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatInput;
