export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // YENİ TOKEN BURAYA
  const REPLICATE_TOKEN = 'r8_bUzX3i6qoN5SUlvwTM0SvHdxyaNrtWI2CK619';

  try {
    // Replicate API - Görsel oluşturma başlat
    const startResponse = await fetch(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          input: {
            prompt: prompt,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 20
          }
        }),
      }
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      throw new Error(`Replicate API hatası: ${errorText}`);
    }

    const prediction = await startResponse.json();
    
    // Hızlı test için hemen başarılı mesajı dönelim
    res.status(200).json({ 
      success: true, 
      message: '✅ REPLICATE AI bağlantısı başarılı! Görsel oluşturuluyor...',
      testImage: 'https://via.placeholder.com/512x512/0088ff/000000?text=Replicate+AI+Çalışıyor',
      predictionId: prediction.id
    });
    
  } catch (error) {
    console.error('Replicate error:', error);
    res.status(200).json({ 
      success: true, 
      message: '⚠️ Replicate bağlantı hatası: ' + error.message,
      testImage: 'https://via.placeholder.com/512x512/ff8800/000000?text=Bağlantı+Test+Ediliyor'
    });
  }
}
