// pages/api/generate-code.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `HTML5 Canvas ve JavaScript kullanarak şu oyunu yaz: ${prompt}. 
          Kod sadece JavaScript ve HTML olmalı, Unity kullanma. 
          Tam çalışan bir oyun kodu üret:`,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Hugging Face API error: ' + response.status);
    }

    const data = await response.json();
    
    // Eğer model yükleniyorsa, beklememiz gerekebilir
    if (data.error && data.estimated_time) {
      return res.status(503).json({ 
        error: 'Model yükleniyor, lütfen 30 saniye sonra tekrar deneyin.' 
      });
    }

    res.status(200).json({ code: data[0]?.generated_text || 'Kod üretilemedi' });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'AI servisinde hata oluştu.' });
  }
}
