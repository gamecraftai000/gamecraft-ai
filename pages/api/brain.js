// pages/api/brain.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('🧠 Beyin AI çalışıyor...', userPrompt);

    // 1. GOOGLE GEMİNİ İLE PLAN OLUŞTUR
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
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
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Google AI hatası: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0]) {
      throw new Error('Google AI yanıt oluşturamadı');
    }

    const planText = geminiData.candidates[0].content.parts[0].text;
    console.log('Gemini Yanıtı:', planText);

    // JSON'ı parse et
    let plan;
    try {
      // Sadece JSON kısmını al
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        plan = { raw: planText };
      }
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      plan = { 
        raw: planText,
        error: 'JSON parse edilemedi'
      };
    }

    // 2. PLANA GÖRE KOD ÜRET (mevcut API'yi kullan)
    let generatedCode = '';
    try {
      const codeResponse = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${userPrompt}. Teknoloji: ${plan.teknoloji || 'HTML5/JavaScript'}`
        }),
      });

      if (codeResponse.ok) {
        const codeData = await codeResponse.json();
        generatedCode = codeData.code || codeData.error || 'Kod üretilemedi';
      } else {
        generatedCode = 'Kod API hatası';
      }
    } catch (codeError) {
      console.error('Kod üretim hatası:', codeError);
      generatedCode = 'Kod üretiminde hata';
    }

    // 3. SONUÇLARI DÖNDÜR
    res.status(200).json({
      plan: plan,
      generatedCode: generatedCode,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🧠 Beyin AI hatası:', error);
    res.status(500).json({ 
      error: 'Beyin AI servisinde hata: ' + error.message,
      status: 'failed'
    });
  }
}
