import { useState } from 'react'

export default function Home() {
  const [imagePrompt, setImagePrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      })

      const data = await response.json()
      
      if (data.success) {
        if (data.image) {
          setGeneratedImage(data.image)
        } else if (data.testImage) {
          setGeneratedImage(data.testImage)
          alert(data.message || 'Test modu: Gerçek AI bağlantısı hazır!')
        }
      } else {
        alert('Görsel oluşturulamadı: ' + data.error)
      }
    } catch (error) {
      alert('Hata oluştu: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1f2e, #0d1117)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', color: '#00ff88' }}>🎮 GameCraft AI</h1>
          <p style={{ color: '#8899aa' }}>Tüm AI araçları tek yerde!</p>
        </header>

        {/* Görsel Üretme Kartı */}
        <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>🎨 Görsel Üret</h3>
          <p style={{ color: '#a0aec0', marginBottom: '15px' }}>AI ile oyun asset'leri oluştur</p>
          
          <input 
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Örnek: pixel art karakter, fantastik ejderha, sci-fi spaceship..."
            style={{ 
              width: '100%', 
              background: '#4a5568',
              border: '1px solid #718096',
              borderRadius: '5px',
              padding: '12px',
              color: 'white',
              marginBottom: '15px',
              fontSize: '16px'
            }}
          />
          
          <button 
            onClick={generateImage}
            disabled={loading}
            style={{ 
              width: '100%', 
              background: loading ? '#4a5568' : '#00ff88', 
              color: loading ? '#a0aec0' : 'black', 
              padding: '15px', 
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 AI Görsel Oluşturuyor... (30-60 saniye)' : '✨ Görsel Oluştur'}
          </button>
        </div>

        {/* Oluşturulan Görsel */}
        {generatedImage && (
          <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3>🖼️ Oluşturulan Görsel</h3>
            <img 
              src={generatedImage} 
              alt="AI generated" 
              style={{ 
                maxWidth: '100%', 
                borderRadius: '10px',
                border: '2px solid #00ff88'
              }}
            />
            <button 
              onClick={() => setGeneratedImage('')}
              style={{
                marginTop: '15px',
                background: '#718096',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Temizle
            </button>
          </div>
        )}

        {/* Sistem Durumu */}
        <div style={{ 
          background: '#2d3748', 
          padding: '20px', 
          borderRadius: '10px',
          border: '1px solid #00ff88'
        }}>
          <strong style={{ color: '#00ff88' }}>✅ Sistem Durumu:</strong><br/>
          <div style={{ color: '#a0aec0', marginTop: '10px' }}>
            • GitHub: Hazır<br/>
            • Vercel: Hazır<br/>
            • Hugging Face AI: {loading ? 'Çalışıyor...' : 'Hazır'}<br/>
            • Supabase: Hazır
          </div>
        </div>
      </div>
    </div>
  )
}
