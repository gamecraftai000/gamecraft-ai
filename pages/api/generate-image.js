export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // YENİ HUGGING FACE TOKEN
  const HF_TOKEN = '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';

  try {
    // DAHA HIZLI ve KARARLI bir model kullanalım
    const response = await fetch(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt + ", high quality, detailed", // Prompt'u iyileştir
          options: {
            wait_for_model: true,
            use_cache: true
          }
        }),
      }
    );

    // Response durumunu kontrol et
    if (response.status === 503) {
      // Model yükleniyor - bekle ve test moduna geç
      return res.status(200).json({ 
        success: true, 
        message: '🔄 Model hazırlanıyor... 1 dakika sonra tekrar dene!',
        testImage: 'https://via.placeholder.com/512x512/FFA500/000000?text=Model+Yükleniyor'
      });
    }

    if (response.status === 401) {
      throw new Error('Token geçersiz - lütfen tokenı kontrol et');
    }

    if (response.status === 429) {
      throw new Error('Rate limit - biraz bekleyip tekrar dene');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face hatası: ${response.status} - ${errorText}`);
    }

    // Başarılı - gerçek görseli dön
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    res.status(200).json({ 
      success: true, 
      image: `data:image/jpeg;base64,${base64Image}`,
      message: '🎉 GERÇEK AI GÖRSEL OLUŞTU!'
    });
    
  } catch (error) {
    console.error('AI Hatası:', error);
    
    // Kullanıcı dostu hata mesajı
    let userMessage = 'AI servisi geçici olarak kullanılamıyor. ';
    
    if (error.message.includes('401')) {
      userMessage = 'Token hatası - lütfen tokenı kontrol edin.';
    } else if (error.message.includes('429')) {
      userMessage = 'Çok fazla istek - lütfen 1 dakika bekleyin.';
    } else if (error.message.includes('503')) {
      userMessage = 'AI modeli hazırlanıyor - lütfen 1 dakika sonra tekrar deneyin.';
    }
    
    res.status(200).json({ 
      success: true, 
      message: userMessage,
      testImage: 'https://via.placeholder.com/512x512/FF6B6B/000000?text=Tekrar+Deneyin'
    });
  }
}
