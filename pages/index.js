// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [gamePrompt, setGamePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');

  const generateGameCode = async () => {
    if (!gamePrompt.trim()) {
      alert('Lütfen bir oyun fikri yazın!');
      return;
    }

    setLoading(true);
    setGeneratedCode('');

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: gamePrompt }),
      });

      if (!response.ok) {
        throw new Error('API hatası: ' + response.status);
      }

      const data = await response.json();
      setGeneratedCode(data.code || 'Kod üretilemedi');
    } catch (error) {
      console.error('Hata:', error);
      setGeneratedCode('API bağlantı hatası. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎮 GameCraft AI</h1>
        <p>Tüm AI araçları tek yerde!</p>
      </header>

      <div className="tabs">
        <button 
          className={activeTab === 'code' ? 'active' : ''} 
          onClick={() => setActiveTab('code')}
        >
          🎯 Oyun Tasarla
        </button>
        <button 
          className={activeTab === 'image' ? 'active' : ''} 
          onClick={() => setActiveTab('image')}
        >
          🎨 Görsel Üret
        </button>
      </div>

      {activeTab === 'code' && (
        <section className="section">
          <h2>🚀 Oyun Tasarla</h2>
          <p>Oyun fikrini yaz, tüm kodları AI yazsın!</p>
          
          <div className="input-group">
            <textarea
              value={gamePrompt}
              onChange={(e) => setGamePrompt(e.target.value)}
              placeholder="Örnek: 'Zıplayan top oyunu, top ekran kenarlarından seksin, skor tutulsun'"
              rows="4"
            />
            
            <button 
              onClick={generateGameCode} 
              disabled={loading}
              className="generate-btn"
            >
              {loading ? '🔄 AI Kod Yazıyor...' : '🎮 Oyun Kodunu Üret'}
            </button>
          </div>

          {generatedCode && (
            <div className="result-box">
              <h3>✨ AI Tarafından Üretilen Kod:</h3>
              <pre className="code-output">
                {generatedCode}
              </pre>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="copy-btn"
              >
                📋 Kodu Kopyala
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === 'image' && (
        <section className="section">
          <h2>🎨 Görsel Üret</h2>
          <p>Oyun assetleri ve karakterler oluştur</p>
          <div className="coming-soon">
            <p>🚧 Bu özellik yakında eklenecek!</p>
          </div>
        </section>
      )}

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          gap: 10px;
        }

        .tabs button {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tabs button.active {
          background: white;
          color: #667eea;
          font-weight: bold;
        }

        .tabs button:hover {
          transform: translateY(-2px);
        }

        .section {
          background: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .section h2 {
          color: #333;
          margin-bottom: 15px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 16px;
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .generate-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #667eea;
          margin-top: 20px;
        }

        .code-output {
          background: #2d3748;
          color: #e2e8f0;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          white-space: pre-wrap;
          max-height: 400px;
          overflow-y: auto;
        }

        .copy-btn {
          background: #48bb78;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }

        .copy-btn:hover {
          background: #38a169;
        }

        .coming-soon {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
