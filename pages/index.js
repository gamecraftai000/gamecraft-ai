// pages/index.js - BEYİN AI KOORDİNATÖR ile TAM KOD
import { useState } from 'react';

export default function Home() {
  // Ana state'ler
  const [userPrompt, setUserPrompt] = useState('');
  const [brainResult, setBrainResult] = useState(null);
  const [brainLoading, setBrainLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('brain');

  // BEYİN AI KOORDİNATÖR - Ana fonksiyon
  const handleBrainAI = async () => {
    if (!userPrompt.trim()) {
      alert('Lütfen bir oyun fikri yazın!');
      return;
    }

    setBrainLoading(true);
    setBrainResult(null);

    try {
      const response = await fetch('/api/brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userPrompt: userPrompt 
        }),
      });

      const data = await response.json();
      setBrainResult(data);
      
    } catch (error) {
      console.error('Beyin AI hatası:', error);
      setBrainResult({ 
        error: 'Beyin AI bağlantı hatası: ' + error.message,
        status: 'failed'
      });
    } finally {
      setBrainLoading(false);
    }
  };

  // Manuel görsel üretimi için state'ler
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageStyle, setImageStyle] = useState('pixel art');

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
        <p>Tüm AI araçları tek yerde! Beyin AI koordinatör aktif!</p>
      </header>

      {/* Sekmeler */}
      <div className="tabs">
        <button 
          className={activeTab === 'brain' ? 'active' : ''} 
          onClick={() => setActiveTab('brain')}
        >
          🧠 BEYİN AI Koordinatör
        </button>
        <button 
          className={activeTab === 'image' ? 'active' : ''} 
          onClick={() => setActiveTab('image')}
        >
          🎨 Manuel Görsel Üret
        </button>
      </div>

      {/* BEYİN AI KOORDİNATÖR BÖLÜMÜ */}
      {activeTab === 'brain' && (
        <section className="section">
          <h2>🚀 Beyin AI Koordinatör</h2>
          <p>Tek bir oyun fikri yaz, AI tüm süreci otomatik yönetsin!</p>
          
          <div className="input-group">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Örnek: 'Zombi savaş oyunu yap. Oyuncu zombilerden kaçsın, silah toplayabilsin, karanlık bir şehirde geçsin.'"
              rows="4"
            />
            
            <button 
              onClick={handleBrainAI} 
              disabled={brainLoading}
              className="brain-btn"
            >
              {brainLoading ? '🧠 AI Tüm Süreci Yönetiyor...' : '🚀 BEYİN AI ile Tümünü Üret'}
            </button>
          </div>

          {/* BEYİN AI SONUÇLARI - KOORDİNATÖR VERSİYON */}
          {brainResult && (
            <div className="brain-result">
              <h3>✨ AI Koordinatör Sonuçları:</h3>
              
              {/* PLAN */}
              {brainResult.plan && (
                <div className="plan-box">
                  <h4>📋 Oyun Planı:</h4>
                  <pre>{JSON.stringify(brainResult.plan, null, 2)}</pre>
                </div>
              )}

              {/* ÜRETİLEN GÖRSELER */}
              {brainResult.images && brainResult.images.images && brainResult.images.images.length > 0 && (
                <div className="images-result">
                  <h4>🎨 Üretilen Görseller:</h4>
                  <div className="images-grid">
                    {brainResult.images.images.map((image, index) => (
                      <div key={index} className="image-item">
                        {image.result && image.result.imageUrl ? (
                          <>
                            <img 
                              src={image.result.imageUrl} 
                              alt={`Generated ${index}`}
                              className="generated-image"
                            />
                            <div className="image-info">
                              <small><strong>Prompt:</strong> {image.prompt}</small>
                              <small><strong>Kaynak:</strong> {image.result.source}</small>
                            </div>
                            <div className="image-actions">
                              <a 
                                href={image.result.imageUrl} 
                                download={`gamecraft-${Date.now()}-${index}.png`}
                                className="download-btn"
                              >
                                💾 İndir
                              </a>
                            </div>
                          </>
                        ) : (
                          <div className="image-error">
                            <p>❌ Görsel üretilemedi</p>
                            <small>{image.result?.error}</small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ÜRETİLEN KOD */}
              {brainResult.code && brainResult.code.code && (
                <div className="result-box">
                  <h4>💻 Üretilen Kod:</h4>
                  <pre className="code-output">
                    {brainResult.code.code}
                  </pre>
                  <div className="code-info">
                    <small><strong>Kaynak:</strong> {brainResult.code.source}</small>
                    {brainResult.code.error && (
                      <small><strong>Not:</strong> {brainResult.code.error}</small>
                    )}
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(brainResult.code.code)}
                    className="copy-btn"
                  >
                    📋 Kodu Kopyala
                  </button>
                </div>
              )}

              {/* HATA DURUMU */}
              {brainResult.error && (
                <div className="error-box">
                  <h4>❌ Hata:</h4>
                  <p>{brainResult.error}</p>
                </div>
              )}

              {/* DURUM */}
              <div className="status-info">
                <small>
                  <strong>Durum:</strong> {brainResult.status} • 
                  <strong> Zaman:</strong> {brainResult.timestamp && new Date(brainResult.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          )}

          {/* Örnek Oyun Fikirleri */}
          <div className="example-prompts">
            <h4>💡 Örnek Oyun Fikirleri (Beyin AI ile Test Edin):</h4>
            <div className="prompt-grid">
              <button onClick={() => setUserPrompt('Zombi savaş oyunu yap. Oyuncu zombilerden kaçsın, silah toplayabilsin, karanlık bir şehirde geçsin.')}>
                🧟 Zombi Savaş Oyunu
              </button>
              <button onClick={() => setUserPrompt('Uzay gemisi ile asteroid vurma oyunu. Skor sistemi olsun, farklı asteroid türleri olsun.')}>
                🚀 Uzay Savaş Oyunu
              </button>
              <button onClick={() => setUserPrompt('Araba yarışı oyunu yap. Farklı araba modelleri, hızlanma ve drift mekanikleri olsun.')}>
                🏎️ Araba Yarışı Oyunu
              </button>
              <button onClick={() => setUserPrompt('Zıplayan top oyunu. Top duvarlardan seksin, skor tutulsun, giderek hızlansın.')}>
                🎯 Zıplayan Top Oyunu
              </button>
              <button onClick={() => setUserPrompt('Labirentten kaçış oyunu. Karanlık labirent, düşmanlar, hazineler olsun.')}>
                🗺️ Labirent Oyunu
              </button>
              <button onClick={() => setUserPrompt('Fantastik RPG oyunu. Büyücü karakter, ejderha düşmanlar, büyü sistem olsun.')}>
                🐉 Fantazi RPG Oyunu
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MANUEL GÖRSEL ÜRETİM BÖLÜMÜ */}
      {activeTab === 'image' && (
        <section className="section">
          <h2>🎨 Manuel Görsel Üretim</h2>
          <p>Sadece görsel üretmek isterseniz bu sekmeyi kullanın</p>
          
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
              <button onClick={() => setImagePrompt('savaşçı zombi karakteri, yeşil ten, kırmızı gözler, yırtık kıyafetler, pixel art')}>
                🧟 Zombi Karakteri
              </button>
              <button onClick={() => setImagePrompt('uzay gemisi, mavi ışıklar, futuristik tasarım, 3D model')}>
                🚀 Uzay Gemisi
              </button>
              <button onClick={() => setImagePrompt('fantastik kale, ortaçağ mimarisi, büyük kapılar, kuleler, cartoon style')}>
                🏰 Fantazi Kalesi
              </button>
              <button onClick={() => setImagePrompt('sport araba, kırmızı, hızlı, aerodinamik, realistic')}>
                🏎️ Spor Araba
              </button>
              <button onClick={() => setImagePrompt('büyücü karakter, uzun pelerin, asa, sihirli efektler, fantasy art')}>
                🧙 Büyücü Karakter
              </button>
              <button onClick={() => setImagePrompt('uzaylı karakteri, yeşil ten, büyük gözler, futuristik, vector art')}>
                👽 Uzaylı Karakter
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Alt Bilgi */}
      <footer className="footer">
        <p>🎯 GameCraft AI - Beyin AI Koordinatör Aktif! Tüm süreç otomatik!</p>
        <div className="feature-status">
          <span className="status-active">✅ Beyin AI Koordinatör: AKTİF</span>
          <span className="status-active">✅ Kod Üretimi: AKTİF</span>
          <span className="status-active">✅ Görsel Üretimi: AKTİF</span>
          <span className="status-coming">🔜 Ses Üretimi: Yakında</span>
          <span className="status-coming">🔜 Müzik Üretimi: Yakında</span>
          <span className="status-coming">🔜 Hikaye Üretimi: Yakında</span>
        </div>
      </footer>

      <style jsx>{`
        .container {
          max-width: 1200px;
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
          font-size: 2.8rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
          font-size: 1.3rem;
          opacity: 0.9;
        }

        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          gap: 15px;
        }

        .tabs button {
          padding: 15px 30px;
          border: none;
          border-radius: 25px;
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tabs button.active {
          background: white;
          color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .tabs button:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.3);
        }

        .section {
          background: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .section h2 {
          color: #333;
          margin-bottom: 15px;
          font-size: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .style-selection {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .style-selection label {
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }

        .style-select {
          padding: 15px;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 16px;
          background: white;
        }

        textarea {
          width: 100%;
          padding: 20px;
          border: 2px solid #e1e5e9;
          border-radius: 15px;
          font-size: 16px;
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }

        textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .brain-btn {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 20px 40px;
          border: none;
          border-radius: 15px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
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
        }

        .image-btn {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }

        .brain-btn:hover:not(:disabled),
        .generate-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .brain-btn:disabled,
        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .result-box {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #667eea;
          margin-top: 25px;
        }

        .brain-result {
          background: #fff3cd;
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #ffc107;
          margin-top: 25px;
        }

        .plan-box {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-top: 15px;
          overflow-x: auto;
          border: 1px solid #e1e5e9;
        }

        .plan-box h4 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.3rem;
        }

        .error-box {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 10px;
          margin-top: 15px;
          border-left: 4px solid #dc3545;
        }

        .code-info {
          margin-top: 15px;
          color: #666;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .code-output {
          background: #2d3748;
          color: #e2e8f0;
          padding: 25px;
          border-radius: 10px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          white-space: pre-wrap;
          max-height: 500px;
          overflow-y: auto;
          line-height: 1.5;
        }

        .copy-btn {
          background: #48bb78;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 15px;
          margin-right: 10px;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .download-btn {
          background: #4299e1;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-top: 15px;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .copy-btn:hover {
          background: #38a169;
        }

        .download-btn:hover {
          background: #3182ce;
        }

        .image-result {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #4ecdc4;
          margin-top: 25px;
          text-align: center;
        }

        .generated-image {
          max-width: 100%;
          max-height: 500px;
          border-radius: 10px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          margin: 20px 0;
        }

        .image-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .images-result {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #4ecdc4;
          margin-top: 25px;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .image-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .image-item:hover {
          transform: translateY(-5px);
        }

        .image-info {
          margin-top: 15px;
          font-size: 13px;
          color: #666;
          text-align: left;
        }

        .image-info small {
          display: block;
          margin: 5px 0;
          line-height: 1.4;
        }

        .image-error {
          padding: 25px;
          background: #f8d7da;
          border-radius: 10px;
          color: #721c24;
          text-align: center;
        }

        .status-info {
          margin-top: 20px;
          padding: 15px;
          background: #e9ecef;
          border-radius: 10px;
          text-align: center;
          color: #666;
        }

        .example-prompts {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 2px solid #e1e5e9;
        }

        .example-prompts h4 {
          color: #333;
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .prompt-grid button {
          background: #e9ecef;
          border: 2px solid #dee2e6;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-size: 14px;
        }

        .prompt-grid button:hover {
          background: #dee2e6;
          transform: translateY(-3px);
          border-color: #667eea;
        }

        .footer {
          text-align: center;
          color: white;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid rgba(255,255,255,0.3);
        }

        .feature-status {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .status-active {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          border: 1px solid #4caf50;
        }

        .status-coming {
          background: rgba(158, 158, 158, 0.2);
          color: #9e9e9e;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          border: 1px solid #9e9e9e;
        }

        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          
          .tabs {
            flex-direction: column;
          }
          
          .tabs button {
            width: 100%;
            margin-bottom: 10px;
          }
          
          .feature-status {
            flex-direction: column;
            gap: 10px;
          }
          
          .images-grid {
            grid-template-columns: 1fr;
          }
          
          .prompt-grid {
            grid-template-columns: 1fr;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .section h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
