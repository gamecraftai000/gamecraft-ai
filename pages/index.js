import { useState } from 'react'

export default function Home() {
  const [imagePrompt, setImagePrompt] = useState('')
  const [codePrompt, setCodePrompt] = useState('')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [soundPrompt, setSoundPrompt] = useState('')
  const [storyPrompt, setStoryPrompt] = useState('')
  
  const [loading, setLoading] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [generatedMusic, setGeneratedMusic] = useState('')
  const [generatedSound, setGeneratedSound] = useState('')
  const [generatedStory, setGeneratedStory] = useState('')

  // Görsel Üretme (Test Modu)
  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('image')
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedImage(data.testImage)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Kod Yazma - YENİ SİSTEM
  const generateCode = async () => {
    if (!codePrompt.trim()) {
      alert('Lütfen oyun fikrini yazın!')
      return
    }
    setLoading('code')
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: codePrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedCode(data.code)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Müzik Oluşturma
  const generateMusic = async () => {
    if (!musicPrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('music')
    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedMusic(data.audioUrl)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Ses Efekti
  const generateSound = async () => {
    if (!soundPrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('sound')
    try {
      const response = await fetch('/api/generate-sound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: soundPrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedSound(data.audioUrl)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  // Hikaye/Diyalog
  const generateStory = async () => {
    if (!storyPrompt.trim()) {
      alert('Lütfen bir şeyler yazın!')
      return
    }
    setLoading('story')
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: storyPrompt }),
      })
      const data = await response.json()
      if (data.success) setGeneratedStory(data.text)
    } catch (error) {
      alert('Hata: ' + error.message)
    }
    setLoading('')
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1f2e, #0d1117)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', color: '#00ff88' }}>🎮 GameCraft AI</h1>
          <p style={{ color: '#8899aa' }}>Tüm AI araçları tek yerde!</p>
        </header>

        {/* AI Araçları Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          
          {/* Görsel Üretme */}
          <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
            <h3>🎨 Görsel Üret</h3>
            <p style={{ color: '#a0aec0', marginBottom: '15px' }}>Oyun asset'leri oluştur</p>
            <input 
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Örnek: pixel art karakter, fantastik ejderha..."
              style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#4a5568', border: '1px solid #718096', borderRadius: '5px', color: 'white' }}
            />
            <button 
              onClick={generateImage}
              disabled={loading === 'image'}
              style={{ width: '100%', background: loading === 'image' ? '#4a5568' : '#00ff88', color: loading === 'image' ? '#a0aec0' : 'black', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              {loading === 'image' ? 'Oluşturuluyor...' : 'Görsel Oluştur'}
            </button>
            {generatedImage && <img src={generatedImage} alt="Generated" style={{ width: '100%', marginTop: '15px', borderRadius: '5px' }} />}
          </div>

          {/* Kod Yazma - YENİ SİSTEM */}
          <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
            <h3>🎮 Oyun Tasarla</h3>
            <p style={{ color: '#a0aec0', marginBottom: '15px' }}>Oyun fikrini yaz, tüm kodları AI yazsın!</p>
            
            <textarea 
              value={codePrompt}
              onChange={(e) => setCodePrompt(e.target.value)}
              placeholder="Örnek: 'Uzaylılarla savaşan bir astronot oyunu. Astronot zıplayabilsin, ateş edebilsin. Skor sistemi olsun.'
              
Veya: 'Zombi saldırısından kaçan bir karakter. Silah toplayabilsin, canı azalsın.'"
              style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', background: '#4a5568', border: '1px solid #718096', borderRadius: '5px', color: 'white' }}
            />

            <button 
              onClick={generateCode}
              disabled={loading === 'code'}
              style={{ width: '100%', background: loading === 'code' ? '#4a5568' : '#007bff', color: loading === 'code' ? '#a0aec0' : 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              {loading === 'code' ? '🔄 Oyun Kodu Yazılıyor...' : '🚀 Oyun Kodunu Üret'}
            </button>

            {generatedCode && (
              <pre style={{ background: '#1a202c', padding: '15px', borderRadius: '5px', marginTop: '15px', overflowX: 'auto', color: '#00ff88', maxHeight: '300px', overflowY: 'auto' }}>
                {generatedCode}
              </pre>
            )}
          </div>

          {/* Müzik Oluşturma */}
          <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
            <h3>🎵 Müzik Oluştur</h3>
            <p style={{ color: '#a0aec0', marginBottom: '15px' }}>Oyun müziği bestele</p>
            <input 
              value={musicPrompt}
              onChange={(e) => setMusicPrompt(e.target.value)}
              placeholder="Örnek: epik savaş müziği, retro oyun müziği..."
              style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#4a5568', border: '1px solid #718096', borderRadius: '5px', color: 'white' }}
            />
            <button 
              onClick={generateMusic}
              disabled={loading === 'music'}
              style={{ width: '100%', background: loading === 'music' ? '#4a5568' : '#ff6b6b', color: loading === 'music' ? '#a0aec0' : 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              {loading === 'music' ? 'Besteleniyor...' : 'Müzik Oluştur'}
            </button>
            {generatedMusic && (
              <div style={{ marginTop: '15px' }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={generatedMusic} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>

          {/* Ses Efekti */}
          <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
            <h3>🔊 Ses Efekti</h3>
            <p style={{ color: '#a0aec0', marginBottom: '15px' }}>Ses efekti oluştur</p>
            <input 
              value={soundPrompt}
              onChange={(e) => setSoundPrompt(e.target.value)}
              placeholder="Örnek: lazer sesi, patlama efekti, büyü sesi..."
              style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#4a5568', border: '1px solid #718096', borderRadius: '5px', color: 'white' }}
            />
            <button 
              onClick={generateSound}
              disabled={loading === 'sound'}
              style={{ width: '100%', background: loading === 'sound' ? '#4a5568' : '#9b59b6', color: loading === 'sound' ? '#a0aec0' : 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              {loading === 'sound' ? 'Oluşturuluyor...' : 'Ses Oluştur'}
            </button>
            {generatedSound && (
              <div style={{ marginTop: '15px' }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={generatedSound} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>

          {/* Hikaye/Diyalog */}
          <div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
            <h3>📖 Hikaye & Diyalog</h3>
            <p style={{ color: '#a0aec0', marginBottom: '15px' }}>Hikaye ve diyalog yaz</p>
            <textarea 
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              placeholder="Örnek: fantastik hikaye, karakter diyaloğu, görev metni..."
              style={{ width: '100%', height: '80px', padding: '10px', marginBottom: '10px', background: '#4a5568', border: '1px solid #718096', borderRadius: '5px', color: 'white' }}
            />
            <button 
              onClick={generateStory}
              disabled={loading === 'story'}
              style={{ width: '100%', background: loading === 'story' ? '#4a5568' : '#f39c12', color: loading === 'story' ? '#a0aec0' : 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              {loading === 'story' ? 'Yazılıyor...' : 'Hikaye Oluştur'}
            </button>
            {generatedStory && (
              <div style={{ background: '#1a202c', padding: '15px', borderRadius: '5px', marginTop: '15px', color: '#e0e0e0' }}>
                {generatedStory}
              </div>
            )}
          </div>

        </div>

        {/* Sistem Durumu */}
        <div style={{ background: '#2d3748', padding: '20px', borderRadius: '10px', border: '1px solid #00ff88' }}>
          <strong style={{ color: '#00ff88' }}>✅ GameCraft AI - Tüm Araçlar Aktif</strong><br/>
          <div style={{ color: '#a0aec0', marginTop: '10px' }}>
            • 🎨 Görsel Üretme: Test Modu<br/>
            • 🎮 Oyun Tasarla: AKILLI MOD<br/>
            • 🎵 Müzik Oluşturma: Hazır<br/>
            • 🔊 Ses Efekti: Hazır<br/>
            • 📖 Hikaye & Diyalog: Hazır
          </div>
        </div>
      </div>
    </div>
  )
}
