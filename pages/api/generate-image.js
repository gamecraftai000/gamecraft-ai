export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // Hugging Face API - daha hızlı bir model
  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: true,
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return res.status(500).json({ 
      success: false, 
      error: 'AI servisi çalışmıyor: ' + error 
    });
  }

  try {
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    res.status(200).json({ 
      success: true, 
      image: `data:image/jpeg;base64,${base64Image}` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Görsel işlenemedi' 
    });
  }
}
