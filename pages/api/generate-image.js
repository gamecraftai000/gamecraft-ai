// pages/api/generate-image.js - GÜNCELLENMİŞ VERSİYON
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, style = 'pixel art' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    console.log('🎨 Görsel üretimi başlıyor:', prompt);

    const hfToken = process.env.HUGGINGFACE_TOKEN;
    
    // Token kontrolü
    if (!hfToken) {
      return res.status(200).json({
        imageUrl: await generateFallbackImage(prompt, style),
        source: 'fallback_no_token',
        prompt: prompt,
        style: style
      });
    }

    // HUGGING FACE - Stable Diffusion
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
        },
        body: JSON.stringify({
          inputs: `${prompt}, ${style}, video game asset, clean background, game design`,
          parameters: {
            width: 512,
            height: 512,
            num_inference_steps: 20
          }
        }),
      }
    );

    console.log('HF Görsel Status:', hfResponse.status);

    if (hfResponse.ok) {
      const imageBuffer = await hfResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const imageUrl = `data:image/png;base64,${base64Image}`;

      console.log('✅ Görsel başarıyla üretildi');
      
      return res.status(200).json({
        imageUrl: imageUrl,
        source: 'stable_diffusion',
        prompt: prompt,
        style: style
      });
    }

    // Fallback
    throw new Error(`Stable Diffusion hatası: ${hfResponse.status}`);

  } catch (error) {
    console.error('❌ Görsel üretim hatası:', error);
    
    // FALLBACK: SVG görsel
    const fallbackImage = await generateFallbackImage(prompt, style);
    
    return res.status(200).json({
      imageUrl: fallbackImage,
      source: 'fallback',
      prompt: prompt,
      style: style,
      error: error.message
    });
  }
}

// FALLBACK GÖRSEL ÜRETİCİ
async function generateFallbackImage(prompt, style) {
  // Basit bir SVG görsel oluştur
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" font-weight="bold">
        ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}
      </text>
      <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white">
        Stil: ${style}
      </text>
      <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">
        GameCraft AI
      </text>
      <circle cx="256" cy="320" r="60" fill="none" stroke="white" stroke-width="3"/>
      <text x="50%" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">
        Görsel
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
