// pages/index.js - TAMAMEN GÜNCELLENMİŞ
import { useState } from 'react';

export default function Home() {
  // Oyun Kodlama State'leri
  const [gamePrompt, setGamePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Beyin AI State'leri
  const [brainLoading, setBrainLoading] = useState(false);
  const [brainResult, setBrainResult] = useState(null);
  
  // Görsel Üretim State'leri
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageStyle, setImageStyle] = useState('pixel art');
  
  // Diğer State'ler
  const [activeTab, setActiveTab] = useState('code');

  // NORMAL KOD ÜRETME
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

  // BEYİN AI İLE ÜRETME
  const handleBrainAI = async () => {
    if (!gamePrompt.trim()) {
      alert('Lütfen bir oyun fikri yazın!');
      return;
    }

    setBrainLoading(true);
    setBrainResult(null);
    setGeneratedCode('');

    try {
      const response = await fetch('/api/brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userPrompt: gamePrompt 
        }),
      });

      const data = await response.json();
      setBrainResult(data);
      
      if (data.generatedCode) {
        setGeneratedCode(data.generatedCode);
      }
      
    } catch (error) {
      console.error('Beyin AI hatası:', error);
      setBrainResult({ 
        error: 'Beyin AI bağlantı hatası: ' + error.message 
      });
    } finally {
      setBrainLoading(false);
    }
  };

  // GÖRSEL ÜRETME
  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Lütfen görsel için bir açıklama yazın!');
      return;
    }

    setImageLoading(true);
    setGeneratedImage('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: imagePrompt,
          style: imageStyle
        }),
      });

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
    } catch (error) {
      console.error('Görsel üretim hatası:', error);
      alert('Görsel üretilirken hata oluştu: ' + error.message);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎮 GameCraft AI</h1>
        <p>Tüm AI araçları tek yerde!</p>
      </header>

      {/* Sekmeler */}
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

      {/* Oyun Kodlama Bölümü */}
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
            
            <div className="button-group">
              <button 
                onClick={generateGameCode} 
                disabled={loading}
                className="generate-btn"
              >
                {loading ? '🔄 AI Kod Yazıyor...' : '🎮 Oyun Kodunu Üret'}
              </button>
              
              <button 
                onClick={handleBrainAI} 
                disabled={brainLoading}
                className="brain-btn"
              >
                {brainLoading ? '🧠 AI Planlıyor...' : '🧠 BEYİN AI ile Üret'}
              </button>
            </div>
          </div>

          {/* BEYİN AI SONUÇLARI */}
          {brainResult && (
            <div className="brain-result">
              <h3>✨ AI Analiz Sonucu:</h3>
              <div className="plan-box">
                <pre>{JSON.stringify(brainResult.plan, null, 2)}</pre>
              </div>
              {brainResult.source && (
                <div className="code-info">
                  <small>Kaynak: {brainResult.source}</small>
                </div>
              )}
              {brainResult.error && (
                <div className="error-box">
                  <strong>Not:</strong> {brainResult.error}
                </div>
              )}
            </div>
          )}

          {/* ÜRETİLEN KOD */}
          {generatedCode && (
            <div className="result-box">
              <h3>💻 Üretilen Kod:</h3>
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

          {/* Örnek Oyun Fikirleri */}
          <div className="example-prompts">
            <h4>💡 Örnek Oyun Fikirleri:</h4>
            <div className="prompt-grid">
              <button onClick={() => setGamePrompt('Zombi savaş oyunu yap. Oyuncu zombilerden kaçsın, silah toplayabilsin.')}>
                🧟 Zombi Oyunu
              </button>
              <button onClick={() => setGamePrompt('Uzay gemisi ile asteroid vurma oyunu. Skor sistemi olsun.')}>
                🚀 Uzay Oyunu
              </button>
              <button onClick={() => setGamePrompt('Zıplayan top oyunu. Top duvarlardan seksin, skor tutulsun.')}>
                🎯 Top Oyunu
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Görsel Üretim Bölümü */}
      {activeTab === 'image' && (
        <section className="section">
          <h2>🎨 Görsel Üret</h2>
          <p>Oyun karakterleri, asset'ler ve arka planlar oluştur</p>
          
          <div className="input-group">
            <div className="style-selection">
              <label>Görsel Stili:</label>
              <select 
                value={imageStyle} 
                onChange={(e) => setImageStyle(e.target.value)}
                className="style-select"
              >
                <option value="pixel art">🎮 Pixel Art</option>
                <option value="3D model">🔄 3D Model</option>
                <option value="vector art">🎯 Vektör Sanat</option>
                <option value="cartoon style">📺 Çizgi Film</option>
                <option value="realistic">📸 Realistik</option>
                <option value="fantasy art">🐉 Fantazi Sanat</option>
              </select>
            </div>
            
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Örnek: 'savaşçı zombi karakteri, yeşil ten, yırtık kıyafetler, pixel art stili'"
              rows="3"
            />
            
            <button 
              onClick={generateImage} 
              disabled={imageLoading}
              className="generate-btn image-btn"
            >
              {imageLoading ? '🎨 AI Çiziyor...' : '🖼️ Görsel Üret'}
            </button>
          </div>

          {generatedImage && (
            <div className="image-result">
              <h3>✨ Üretilen Görsel:</h3>
              <img 
                src={generatedImage} 
                alt="AI generated" 
                className="generated-image" 
              />
              <div className="image-actions">
                <button 
                  onClick={() => navigator.clipboard.writeText(imagePrompt)}
                  className="copy-btn"
                >
                  📋 Prompt'u Kopyala
                </button>
                <a 
                  href={generatedImage} 
                  download={`gamecraft-${Date.now()}.png`}
                  className="download-btn"
                >
                  💾 İndir
                </a>
              </div>
            </div>
          )}

          {/* Örnek Görsel Prompt'ları */}
          <div className="example-prompts">
            <h4>💡 Örnek Görsel Prompt'ları:</h4>
            <div className="prompt-grid">
              <button onClick={() => setImagePrompt('savaşçı zombi karakteri, yeşil ten, kırmızı gözler, pixel art')}>
                🧟 Zombi Karakteri
              </button>
              <button onClick={() => setImagePrompt('uzay gemisi, mavi ışıklar, futuristik, 3D model')}>
                🚀 Uzay Gemisi
              </button>
              <button onClick={() => setImagePrompt('fantastik kale, ortaçağ, büyük kapılar, cartoon style')}>
                🏰 Fantazi Kalesi
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Alt Bilgi */}
      <footer className="footer">
        <p>🎯 GameCraft AI - Tüm oyun geliştirme araçları tek platformda!</p>
        <div className="feature-status">
          <span className="status-active">✅ Oyun Kodlama: Aktif</span>
          <span className="status-active">✅ Beyin AI: Aktif</span>
          <span className="status-active">✅ Görsel Üretim: Aktif</span>
          <span className="status-coming">🔜 Ses Üretimi: Yakında</span>
          <span className="status-coming">🔜 Müzik Üretimi: Yakında</span>
        </div>
      </footer>

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

        .button-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .style-selection {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .style-selection label {
          font-weight: bold;
          color: #333;
        }

        .style-select {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          background: white;
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
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .brain-btn {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .image-btn {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }

        .generate-btn:hover:not(:disabled),
        .brain-btn:hover:not(:disabled),
        .image-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .generate-btn:disabled,
        .brain-btn:disabled,
        .image-btn:disabled {
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

        .brain-result {
          background: #fff3cd;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #ffc107;
          margin-top: 20px;
        }

        .plan-box {
          background: white;
          padding: 15px;
          border-radius: 5px;
          margin-top: 10px;
          overflow-x: auto;
        }

        .error-box {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
        }

        .code-info {
          margin-top: 10px;
          color: #666;
          font-size: 14px;
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
          margin-right: 10px;
        }

        .download-btn {
          background: #4299e1;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
        }

        .copy-btn:hover {
          background: #38a169;
        }

        .download-btn:hover {
          background: #3182ce;
        }

        .image-result {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #4ecdc4;
          margin-top: 20px;
          text-align: center;
        }

        .generated-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin: 15px 0;
        }

        .image-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .example-prompts {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .example-prompts h4 {
          color: #333;
          margin-bottom: 15px;
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .prompt-grid button {
          background: #e9ecef;
          border: 1px solid #dee2e6;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .prompt-grid button:hover {
          background: #dee2e6;
          transform: translateY(-1px);
        }

        .footer {
          text-align: center;
          color: white;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        .feature-status {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .status-active {
          background: rgba(255,255,255,0.2);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
        }

        .status-coming {
          background: rgba(255,255,255,0.1);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          
          .button-group {
            flex-direction: column;
          }
          
          .tabs {
            flex-direction: column;
          }
          
          .feature-status {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
