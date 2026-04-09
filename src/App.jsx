import { useState, useEffect, useRef } from 'react'
import { askQuestion, searchLiterature, synthesizeText } from './services/api'
import ChatInput from './components/ChatInput'
import ChatResponse from './components/ChatResponse'
import WikiPointModal from './components/WikiPointModal'

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wikiPoints, setWikiPoints] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedModel, setSelectedModel] = useState("nvidia/llama-3.1-nemotron-nano-8b-v1");
  
  const [arxivPapers, setArxivPapers] = useState([]);
  const [scholarPapers, setScholarPapers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }
  useEffect(() => { scrollToBottom(); }, [messages, loading, searchLoading]);

  const handleQuestionSubmit = async (question) => {
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);
    
    try {
      const data = await askQuestion({ 
        question, 
        mindMap: wikiPoints.map(p => p.title + ": " + p.content).join("\n\n"), 
        model: selectedModel 
      });

      const rawText = data.candidates[0].content.parts[0].text;
      const cleanText = rawText.replace(/[#*()\-_>[\]]/g, '');
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: cleanText
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Reasoning core disconnected. Verify backend." }]);
    } finally { setLoading(false); }
  }

  const handleLitSearch = async (query, source) => {
    setSearchLoading(true);
    try {
      const data = await searchLiterature({ query, source });
      // Add as a separate system-style message in the flow
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Literature search results for: "${query}"`,
        isSystem: true,
        arxiv: data.arxiv || [],
        scholar: data.scholar || []
      }]);
    } catch (error) {
      alert("Literature search failed.");
    } finally { 
      setSearchLoading(false);
    }
  }

  const handleChatWithPaper = async (paper) => {
    setProcessingStatus("synthesizing");
    setArxivPapers([]);
    setScholarPapers([]);
    try {
      const data = await synthesizeText({
        text: paper.summary || paper.title, model: selectedModel
      });
      const rawJson = data.candidates[0].content.parts[0].text;
      
      let parsed;
      try { parsed = JSON.parse(rawJson); } catch { parsed = null; }
      
      if (parsed && parsed.wiki_points) {
        setWikiPoints(parsed.wiki_points);
        setCurrentFile(paper.title.substring(0, 30) + "...");
        setMessages(prev => [...prev, { role: 'ai', text: `Synthesis complete for: ${paper.title}. Wiki contains ${parsed.wiki_points.length} nodes.`, isSystem: true }]);
      } else {
        setWikiPoints([{ title: paper.title, content: rawJson }]);
        setCurrentFile(paper.title);
      }
    } catch (error) {
      alert("Error synthesizing paper knowledge.");
    } finally { setProcessingStatus(null); }
  }

  return (
    <div className='app-container'>
      {selectedPoint && (
        <WikiPointModal point={selectedPoint} onClose={() => setSelectedPoint(null)} />
      )}

      <aside className="sidebar">
        <div className="credits-section">
           <h2 className="sidebar-subtitle">VISIONARY FOUNDATION</h2>
           <div className="credit-block">
             <p className="credit-name main-gold">Andrej Karpathy</p>
             <a href="https://github.com/karpathy" className="credit-link">github.com/karpathy</a>
             <div className="wiki-concept-box glow-card">
               <p className="concept-title">THE LLM-WIKI PHILOSOPHY</p>
               <p className="concept-text">Atomic knowledge compilation for precise AI reasoning.</p>
             </div>
           </div>
           
           <div className="credit-block dev-divider">
             <p className="credit-name dev-orange">Ashutosh</p>
             <a href="https://github.com/Ashutosh-AIBOT" className="credit-link">github.com/Ashutosh-AIBOT</a>
             <div className="dev-tag">Gen AI Developer | Searching Mode</div>
           </div>
        </div>

        <div className="sidebar-index">
          <h3 className="section-title">WIKI NODES</h3>
          {currentFile && <div className="active-file-badge">{currentFile}</div>}
          <div className="node-list">
             {wikiPoints.length > 0 ? (
               wikiPoints.map((p, i) => (
                 <button key={i} onClick={() => setSelectedPoint(p)} className="node-item">
                   {p.title}
                 </button>
               ))
             ) : (
               <span className="empty-state">No nodes synthesized</span>
             )}
          </div>
        </div>
      </aside>

      <main className="chat-area">
        <header className="chat-header">
           <div className="header-status">
              <span className="status-dot"></span> 
              <h1>Spring AI Knowledge Base</h1>
           </div>
        </header>

        <section className="chat-history">
          {/* Wiki Knowledge Board (Global for current session) */}
          {wikiPoints.length > 0 && (
            <div className="knowledge-board">
              <h2 className="board-title">KNOWLEDGE SYNTHESIS: {currentFile}</h2>
              <div className="wiki-grid">
                {wikiPoints.map((p, i) => (
                  <div key={i} className="wiki-card premium">
                    <h3>{p.title}</h3>
                    <button onClick={() => setSelectedPoint(p)} className="btn-inside">View Inside</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ChatResponse messages={messages} onTalkToPDF={handleChatWithPaper} />


          {(loading || processingStatus) && !searchLoading && (
            <div className="thinking-animation">
              <div className="thinking-pulse"></div><div className="thinking-pulse"></div><div className="thinking-pulse"></div>
              <span className="thinking-text">
                 {processingStatus ? "Compiling Wiki..." : "AI Reasoning Core Active..."}
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </section>

        <ChatInput
          onSubmit={handleQuestionSubmit}
          onProcessed={(json, name) => { setProcessingStatus("synthesizing"); handleMindMapProcessed(json, name); }}
          onLitSearch={handleLitSearch}
          disabled={loading || processingStatus || searchLoading}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel} />
      </main>
    </div>
  )
}

export default App