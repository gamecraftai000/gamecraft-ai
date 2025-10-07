{/* Kod Yazma - BASİT VERSİYON */}
<div style={{ background: '#2d3748', padding: '25px', borderRadius: '10px' }}>
  <h3>🎮 Oyun Tasarla</h3>
  <p style={{ color: '#a0aec0', marginBottom: '15px' }}>Oyun fikrini yaz, tüm kodları AI yazsın!</p>
  
  <textarea 
    value={codePrompt}
    onChange={(e) => setCodePrompt(e.target.value)}
    placeholder="Örnek: 'Uzaylılarla savaşan bir astronot oyunu. Astronot zıplayabilsin, ateş edebilsin. Skor sistemi olsun.'
    
Veya: 'Zombi saldırısından kaçan bir karakter. Silah toplayabilsin, canı azalsın.'
    
Veya: 'Bulmaca çözen bir kahraman. Farklı seviyeler olsun.'"
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
