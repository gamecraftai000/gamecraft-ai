// pages/api/brain.js - KOORDİNATÖR VERSİYON
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('🧠 Beyin AI Koordinatör çalışıyor:', userPrompt);

    // 1. ÖNCE DETAYLI PLAN OLUŞTUR
    const gamePlan = await createGamePlan(userPrompt);
    
    // 2. TÜM GÖREVLERİ PARALEL ÇALIŞTIR
    const tasks = await Promise.allSettled([
      generateGameCode(userPrompt, gamePlan),
      generateGameImages(userPrompt, gamePlan),
      // generateGameMusic(userPrompt, gamePlan), // Sonra ekleyeceğiz
      // generateGameSounds(userPrompt, gamePlan) // Sonra ekleyeceğiz
    ]);

    // 3. SONUÇLARI TOPLA
    const results = {
      plan: gamePlan,
      code: tasks[0].status === 'fulfilled' ? tasks[0].value : { error: 'Kod üretilemedi' },
      images: tasks[1].status === 'fulfilled' ? tasks[1].value : { error: 'Görsel üretilemedi' },
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    console.log('✅ Tüm görevler tamamlandı');
    res.status(200).json(results);

  } catch (error) {
    console.error('❌ Beyin AI hatası:', error);
    
    // FALLBACK: En azından kod üret
    const fallbackCode = await generateGameCode(userPrompt, {});
    
    res.status(200).json({
      plan: {
        teknoloji: "HTML5/JavaScript",
        gorselTipi: "pixel art",
        aciklama: "Beyin AI geçici olarak basit modda",
        error: error.message
      },
      code: fallbackCode,
      images: { error: 'Görsel üretimi geçici olarak devre dışı' },
      status: 'fallback',
      timestamp: new Date().toISOString()
    });
  }
}

// OYUN PLANI OLUŞTURMA
async function createGamePlan(userPrompt) {
  // Şimdilik basit plan, sonra Google AI ile geliştireceğiz
  const lowerPrompt = userPrompt.toLowerCase();
  
  let plan = {
    teknoloji: "HTML5/JavaScript",
    gorselTipi: "pixel art",
    sesGereksinimleri: ["arkaplan_muzigi", "efekt_sesleri"],
    oyunMotoru: "HTML5 Canvas",
    zorlukSeviyesi: "başlangıç",
    tahminiSure: "1-2 gün",
    aciklama: `"${userPrompt}" için AI destekli oyun planı`,
    recommendedAssets: []
  };

  // Prompt'a göre özelleştir
  if (lowerPrompt.includes('zombi') || lowerPrompt.includes('savaş')) {
    plan.gorselTipi = "pixel art horror";
    plan.recommendedAssets = ["zombi_karakteri", "kan_efekti", "karanlık_arkaplan"];
  } else if (lowerPrompt.includes('uzay') || lowerPrompt.includes('gemi')) {
    plan.gorselTipi = "vector art";
    plan.recommendedAssets = ["uzay_gemisi", "asteroid", "yıldız_arkaplan"];
  } else if (lowerPrompt.includes('araba') || lowerPrompt.includes('yarış')) {
    plan.gorselTipi = "3D model";
    plan.recommendedAssets = ["araba_modeli", "yol_arkaplan", "duman_efekti"];
  }

  return plan;
}

// KOD ÜRETİMİ
async function generateGameCode(userPrompt, plan) {
  try {
    const response = await fetch(`https://${process.env.VERCEL_URL || 'localhost:3000'}/api/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: `${userPrompt}. Teknoloji: ${plan.teknoloji}` 
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        code: data.code,
        source: data.source || 'brain_coordinated'
      };
    }
    throw new Error(`Kod API hatası: ${response.status}`);
  } catch (error) {
    console.error('Kod üretim hatası:', error);
    return {
      code: `// ${userPrompt} - Beyin AI Fallback Kodu\n// Plan: ${JSON.stringify(plan)}\nconsole.log("Koordinatör modu");`,
      source: 'fallback_coordinated',
      error: error.message
    };
  }
}

// GÖRSEL ÜRETİMİ (ÇOKLU GÖRSEL)
async function generateGameImages(userPrompt, plan) {
  try {
    const imagePrompts = createImagePrompts(userPrompt, plan);
    const imageTasks = imagePrompts.map(prompt => 
      generateSingleImage(prompt, plan.gorselTipi)
    );

    const images = await Promise.allSettled(imageTasks);
    
    return {
      images: images.map((result, index) => ({
        prompt: imagePrompts[index],
        result: result.status === 'fulfilled' ? result.value : { error: 'Görsel üretilemedi' }
      })),
      source: 'brain_coordinated_images'
    };

  } catch (error) {
    console.error('Görsel koordinasyon hatası:', error);
    return {
      images: [],
      error: error.message,
      source: 'fallback_images'
    };
  }
}

// TEKİL GÖRSEL ÜRETİMİ
async function generateSingleImage(prompt, style) {
  try {
    const response = await fetch(`https://${process.env.VERCEL_URL || 'localhost:3000'}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        style: style
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        imageUrl: data.imageUrl,
        source: data.source || 'stable_diffusion'
      };
    }
    throw new Error(`Görsel API hatası: ${response.status}`);
  } catch (error) {
    console.error('Tekil görsel hatası:', error);
    return {
      imageUrl: generateFallbackImage(prompt, style),
      source: 'fallback_single_image',
      error: error.message
    };
  }
}

// GÖRSEL PROMPT'LARI OLUŞTURMA
function createImagePrompts(userPrompt, plan) {
  const prompts = [];
  const lowerPrompt = userPrompt.toLowerCase();

  // Ana karakter
  if (lowerPrompt.includes('zombi')) {
    prompts.push('zombi karakteri, yeşil ten, kırmızı gözler, yırtık kıyafetler, pixel art');
  } else if (lowerPrompt.includes('uzay') || lowerPrompt.includes('gemi')) {
    prompts.push('uzay gemisi, futuristik, mavi ışıklar, vector art');
  } else if (lowerPrompt.includes('araba')) {
    prompts.push('yarış arabası, hızlı, spor, 3D model');
  } else {
    prompts.push(`ana karakter, ${userPrompt}, ${plan.gorselTipi}`);
  }

  // Arka plan
  if (lowerPrompt.includes('zombi')) {
    prompts.push('karanlık arka plan, terk edilmiş şehir, pixel art horror');
  } else if (lowerPrompt.includes('uzay')) {
    prompts.push('uzay arka plan, yıldızlar, nebulalar, vector art');
  } else {
    prompts.push(`oyun arka planı, ${plan.gorselTipi}`);
  }

  return prompts;
}

// FALLBACK GÖRSEL
function generateFallbackImage(prompt, style) {
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#667eea"/>
      <text x="50%" y="45%" text-anchor="middle" font-family="Arial" font-size="18" fill="white">
        ${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}
      </text>
      <text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="14" fill="white">
        ${style} • Beyin AI Koordinatör
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
