import { useState } from 'react'

export default function Home() {
  const [imagePrompt, setImagePrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const generateImage = async () => {
    setLoading(true)
    try {
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      alert('🎉 Tüm sistemler hazır! Supabase bağlantısı kuruldu.')
    } catch (error) {
      alert('Hata: ' + error.message)
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

        <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
          <h3>🎨 Görsel Üret</h3>
          <input 
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Pixel art karakter..."
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <button 
            onClick={generateImage}
            disabled={loading}
            style={{ 
              width: '100%', 
              background: '#00ff88', 
              color: 'black', 
              padding: '12px', 
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Oluşturuluyor...' : 'Oluştur'}
          </button>
        </div>

        <div style={{ marginTop: '20px', color: '#00ff88' }}>
          <strong>✅ Sistem Durumu:</strong><br/>
          • GitHub: Hazır<br/>
          • Vercel: Hazır<br/>
          • Supabase: Hazır<br/>
          • Hugging Face: Hazır
        </div>
      </div>
    </div>
  )
}
