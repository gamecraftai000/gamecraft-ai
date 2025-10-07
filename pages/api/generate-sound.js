export default async function handler(req, res) {
  const { prompt } = req.body;
  
  const soundEffects = {
    'lazer': 'https://www.soundjay.com/mechanical/sci-fi-laser-01.wav',
    'patlama': 'https://www.soundjay.com/explosions/explosion-01.wav',
    'büyü': 'https://www.soundjay.com/magic/magic-spell-01.wav'
  };

  let audioUrl = 'https://www.soundjay.com/button/beep-01.wav';
  if (prompt.toLowerCase().includes('lazer')) audioUrl = soundEffects.lazer;
  if (prompt.toLowerCase().includes('patlama')) audioUrl = soundEffects.patlama;
  if (prompt.toLowerCase().includes('büyü')) audioUrl = soundEffects.büyü;

  res.status(200).json({ 
    success: true, 
    audioUrl: audioUrl,
    message: `🔊 "${prompt}" için ses efekti oluşturuldu`
  });
}
