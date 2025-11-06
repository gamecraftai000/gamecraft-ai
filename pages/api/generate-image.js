// pages/api/generate-image.js - MANUEL GÖRSEL ÜRETİM API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style = 'pixel art' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🎨 Görsel üretiliyor:', { prompt, style });

    const enhancedPrompt = `${prompt}, ${style}, game asset, clean design, high quality`;

    // Stable Diffusion API
    const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: process.env.STABLE_DIFFUSION_API_KEY,
        prompt: enhancedPrompt,
        width: 512,
        height: 512,
        samples: 1,
        num_inference_steps: 20,
        guidance_scale: 7.5
      })
    });

    const data = await response.json();

    if (data.status === 'success' && data.output && data.output[0]) {
      res.status(200).json({ 
        imageUrl: data.output[0],
        prompt: enhancedPrompt,
        style: style
      });
    } else {
      throw new Error(data.message || 'Görsel üretilemedi');
    }

  } catch (error) {
    console.error('❌ Görsel üretim hatası:', error);
    res.status(500).json({ 
      error: 'Görsel üretilemedi: ' + error.message
    });
  }
}
