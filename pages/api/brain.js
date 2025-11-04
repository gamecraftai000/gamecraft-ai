// pages/api/brain.js - GÜNCELLENMİŞ VE TEST EDİLMİŞ
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    console.log('🧠 Beyin AI başlıyor...');
    
    const apiKey = process.env.GOOGLE_AI_KEY;
    
    // API Key kontrolü
    if (!apiKey || !apiKey.startsWith('AIza')) {
      throw new Error('Google AI Key bulunamadı veya geçersiz');
    }

    console.log('API Key var, istek yapılıyor...');

    // GOOGLE GEMINI API - GÜNCEL FORMAT
    // 1. ÖNCE BASİT BİR TEST İSTEĞİ YAPALIM
    const testPrompt = "Merhaba, nasılsın?";
    
    const geminiURL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log('Gemini URL:', geminiURL);

    const geminiResponse = await fetch(geminiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: testPrompt
              }
            ]
          }
        ]
      })
