export default async function handler(req, res) {
  const { prompt } = req.body;
  
  // Akıllı tema seçimi
  const themes = {
    'dragon': { color: 'FF6B6B', emoji: '🐉' },
    'knight': { color: '4ECDC4', emoji: '⚔️' },
    'castle': { color: '45B7D1', emoji: '🏰' },
    'spaceship': { color: '96CEB4', emoji: '🚀' },
    'robot': { color: 'FECA57', emoji: '🤖' }
  };

  let theme = { color: '00FF88', emoji: '🎮' };
  for (const [key, value] of Object.entries(themes)) {
    if (prompt.toLowerCase().includes(key)) {
      theme = value;
      break;
    }
  }

  const testImage = `https://via.placeholder.com/512x512/${theme.color}/000000?text=${encodeURIComponent(theme.emoji + ' ' + prompt)}`;

  res.status(200).json({ 
    success: true, 
    testImage: testImage,
    message: `🎨 "${prompt}" için görsel oluşturuldu`
  });
}
