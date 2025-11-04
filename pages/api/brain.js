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
    });

    console.log('Gemini Response Status:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Google AI test hatası:', geminiResponse.status, errorText);
      
      // Eğer test başarısız olursa, fallback kullan
      return await handleFallback(userPrompt, res, `Google AI test hatası: ${geminiResponse.status}`);
    }

    // Test başarılı, şimdi gerçek planlama yapalım
    const planResponse = await fetch(geminiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Kullanıcı şu oyunu yapmak istiyor: "${userPrompt}"

Bu oyun için DETAYLI geliştirme planı oluştur:

TEKNİK ANALİZ:
- KOD DİLİ: HTML5/JavaScript, Unity C#, Python?
- GÖRSEL TÜRÜ: 2D pixel art, 3D model, vektörel?
- SES İHTİYACI: Müzik türü, ses efektleri?
- OYUN MOTORU: Hangisi uygun?
- ZORLUK SEVİYESİ: Başlangıç/Orta/İleri
- TAHMİNİ GELİŞTİRME SÜRESİ

Lütfen SADECE JSON formatında dönüş yap:

{
  "teknoloji": "HTML5/JavaScript",
  "gorselTipi": "pixel art",
  "sesGereksinimleri": ["arkaplan_muzigi", "efekt_sesleri"],
  "oyunMotoru": "HTML5 Canvas",
  "zorlukSeviyesi": "başlangıç",
  "tahminiSure": "2-3 gün",
  "aciklama": "Kısa oyun açıklaması"
}`
              }
            ]
          }
        ]
      })
    });

    if (!planResponse.ok) {
      throw new Error(`Plan oluşturma hatası: ${planResponse.status}`);
    }

    const planData = await planResponse.json();
    
    if (!planData.candidates || !planData.candidates[0]) {
      throw new Error('Google AI plan oluşturamadı');
    }

    const planText = planData.candidates[0].content.parts[0].text;
    console.log('Plan Text alındı:', planText.substring(0, 100) + '...');

    // JSON'ı parse et
    let plan;
    try {
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        plan = { 
          raw: planText,
          aciklama: "JSON parse edilemedi, ham yanıt gösteriliyor"
        };
      }
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      plan = { 
        raw: planText,
        error: 'JSON parse edilemedi'
      };
    }

    // KOD ÜRET
    const generatedCode = await generateGameCode(userPrompt);

    // BAŞARILI SONUÇ
    res.status(200).json({
      plan: plan,
      generatedCode: generatedCode,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🧠 Beyin AI hatası:', error);
    await handleFallback(userPrompt, res, error.message);
  }
}

// KOD ÜRETİM FONKSİYONU
async function generateGameCode(userPrompt) {
  try {
    const baseURL = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const codeResponse = await fetch(`${baseURL}/api/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userPrompt
      }),
    });

    if (codeResponse.ok) {
      const codeData = await codeResponse.json();
      return codeData.code || codeData.error || 'Kod üretilemedi';
    }
    return 'Kod API hatası - basit kod kullanılıyor';
  } catch (error) {
    console.error('Kod üretim hatası:', error);
    return '// Basit oyun kodu\nconsole.log("Oyun başladı");';
  }
}

// FALLBACK FONKSİYONU
async function handleFallback(userPrompt, res, errorMessage) {
  try {
    const generatedCode = await generateGameCode(userPrompt);
    
    // Basit bir plan oluştur (Google AI olmadan)
    const simplePlan = {
      teknoloji: "HTML5/JavaScript",
      gorselTipi: "pixel art",
      sesGereksinimleri: ["arkaplan_muzigi", "efekt_sesleri"],
      oyunMotoru: "HTML5 Canvas",
      zorlukSeviyesi: "başlangıç",
      tahminiSure: "1-2 gün",
      aciklama: `"${userPrompt}" oyunu için basit plan`,
      not: "Google AI çalışmadı, basit plan kullanılıyor",
      error: errorMessage
    };
    
    res.status(200).json({
      plan: simplePlan,
      generatedCode: generatedCode,
      status: 'fallback',
      timestamp: new Date().toISOString()
    });
  } catch (fallbackError) {
    res.status(500).json({ 
      error: 'Beyin AI hatası: ' + errorMessage,
      status: 'failed'
    });
  }
}
