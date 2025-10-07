export default async function handler(req, res) {
  const { prompt } = req.body;
  
  // Test sesleri (gerçek API entegrasyonu için hazır)
  const demoAudios = {
    'epik': 'https://www.soundjay.com/button/beep-07.wav',
    'retro': 'https://www.soundjay.com/button/beep-08.wav',
    'savaş': 'https://www.soundjay.com/button/beep-09.wav'
  };

  let audioUrl = 'https://www.soundjay.com/button/beep-07.wav';
  if (prompt.toLowerCase().includes('retro')) audioUrl = demoAudios.retro;
  if (prompt.toLowerCase().includes('savaş')) audioUrl = demoAudios.savaş;

  res.status(200).json({ 
    success: true, 
    audioUrl: audioUrl,
    message: `🎵 "${prompt}" için müzik oluşturuldu`
  });
}
