// pages/api/brain.js - BEYİN AI KOORDİNATÖR API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }

    console.log('🧠 Beyin AI başlatılıyor:', userPrompt);

    // 1. Önce oyun planını oluştur
    const gamePlan = await generateGamePlan(userPrompt);
    
    // 2. Paralel olarak tüm AI işlemlerini başlat
    const [codeResult, imageResult] = await Promise.all([
      generateGameCode(gamePlan),
      generateGameImages(gamePlan)
    ]);

    // 3. Sonuçları birleştir
    const brainResult = {
      status: 'completed',
      timestamp: new Date().toISOString(),
      plan: gamePlan,
      code: codeResult,
      images: imageResult,
      userPrompt: userPrompt
    };

    console.log('✅ Beyin AI tamamlandı');
    res.status(200).json(brainResult);

  } catch (error) {
    console.error('❌ Beyin AI hatası:', error);
    res.status(500).json({ 
      error: 'Beyin AI işlemi başarısız: ' + error.message,
      status: 'failed'
    });
  }
}

// Oyun planı oluştur
async function generateGamePlan(userPrompt) {
  try {
    const planPrompt = `
    Kullanıcı şu oyunu istiyor: "${userPrompt}"
    
    Bu oyun için detaylı bir plan oluştur:
    1. Oyun Mekaniği
    2. Gereken Görseller
    3. Kod Yapısı
    4. Oyun Elementleri
    
    JSON formatında döndür:
    {
      "gameType": "oyun türü",
      "mechanics": ["mekanik1", "mekanik2"],
      "requiredAssets": ["asset1", "asset2", "asset3"],
      "codeStructure": "açıklama",
      "targetPlatform": "web/mobile"
    }
    `;

    // OpenRouter API çağrısı
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen bir oyun tasarımcısısın. Kullanıcı isteklerini analiz edip detaylı oyun planları oluştur."
          },
          {
            role: "user",
            content: planPrompt
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const planText = data.choices[0].message.content;
    
    // JSON'ı parse et
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      gameType: "action",
      mechanics: ["movement", "collision"],
      requiredAssets: ["player", "enemy", "background"],
      codeStructure: "HTML5 Canvas game",
      targetPlatform: "web"
    };

  } catch (error) {
    console.error('Plan oluşturma hatası:', error);
    return {
      gameType: "fallback",
      mechanics: ["basic movement"],
      requiredAssets: ["basic character", "background"],
      codeStructure: "simple HTML5 game",
      targetPlatform: "web",
      error: error.message
    };
  }
}

// Oyun kodu üret
async function generateGameCode(gamePlan) {
  try {
    const codePrompt = `
    AŞAĞIDAKİ OYUN PLANINA GÖRE TAM BİR HTML5 OYUNU OLUŞTUR:

    OYUN PLANI: ${JSON.stringify(gamePlan, null, 2)}

    TEKNİK GEREKSİNİMLER:
    - Tek HTML dosyası (inline CSS ve JavaScript)
    - HTML5 Canvas kullan
    - Mobil uyumlu responsive tasarım
    - Temiz ve okunabilir kod
    - Oyun döngüsü ve temel mekanikler
    - Kullanıcı input'larını işle

    SADECE HTML KODU DÖNDÜR, AÇIKLAMA YAPMA!
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sen bir HTML5 oyun geliştirme uzmanısın. Kullanıcının istediği oyunu tek bir HTML dosyasında oluştur."
          },
          {
            role: "user",
            content: codePrompt
          }
        ],
        max_tokens: 2000
      })
    });

    const data = await response.json();
    const gameCode = data.choices[0].message.content;

    return {
      code: gameCode.replace(/```html|```/g, '').trim(),
      source: 'openrouter',
      status: 'success'
    };

  } catch (error) {
    console.error('Kod üretim hatası:', error);
    return {
      code: getFallbackGameCode(gamePlan),
      source: 'fallback',
      error: error.message,
      status: 'fallback'
    };
  }
}

// Oyun görselleri üret
async function generateGameImages(gamePlan) {
  try {
    const images = [];
    
    // Her bir asset için görsel üret
    for (const asset of gamePlan.requiredAssets.slice(0, 3)) { // İlk 3 asset
      const imagePrompt = `${asset}, ${gamePlan.gameType} game, ${gamePlan.targetPlatform}, pixel art style`;
      
      try {
        const imageUrl = await generateSingleImage(imagePrompt);
        images.push({
          prompt: imagePrompt,
          result: {
            imageUrl: imageUrl,
            source: 'stable-diffusion'
          }
        });
      } catch (imageError) {
        images.push({
          prompt: imagePrompt,
          result: {
            error: imageError.message,
            source: 'failed'
          }
        });
      }
    }

    return { images };

  } catch (error) {
    console.error('Görsel üretim hatası:', error);
    return { 
      images: [],
      error: error.message 
    };
  }
}

// Tekil görsel üret
async function generateSingleImage(prompt) {
  // Stable Diffusion API çağrısı
  const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: process.env.STABLE_DIFFUSION_API_KEY,
      prompt: `${prompt}, game asset, clean design, transparent background`,
      width: 512,
      height: 512,
      samples: 1
    })
  });

  const data = await response.json();
  
  if (data.status === 'success' && data.output && data.output[0]) {
    return data.output[0];
  } else {
    throw new Error(data.message || 'Görsel üretilemedi');
  }
}

// Fallback oyun kodu
function getFallbackGameCode(gamePlan) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <title>${gamePlan.gameType} Game</title>
      <style>
          body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial; 
              text-align: center; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
          }
          #gameCanvas { 
              border: 3px solid #333; 
              background: white; 
              margin: 20px auto; 
              display: block; 
              box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          }
          .controls { 
              margin: 20px; 
          }
          button { 
              padding: 12px 24px; 
              font-size: 16px; 
              margin: 8px; 
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
          }
          .game-info {
              background: rgba(255,255,255,0.1);
              padding: 15px;
              border-radius: 10px;
              margin: 15px auto;
              max-width: 500px;
          }
      </style>
  </head>
  <body>
      <h1>🎮 ${gamePlan.gameType} Game</h1>
      <div class="game-info">
          <p><strong>Mekanikler:</strong> ${gamePlan.mechanics.join(', ')}</p>
          <p><strong>Gerekenler:</strong> ${gamePlan.requiredAssets.join(', ')}</p>
      </div>
      
      <div class="controls">
          <button onclick="startGame()">🎮 Oyunu Başlat</button>
          <button onclick="resetGame()">🔄 Sıfırla</button>
          <button onclick="pauseGame()">⏸️ Duraklat</button>
      </div>
      
      <canvas id="gameCanvas" width="800" height="400"></canvas>
      <div class="game-stats">
          <p id="score">Skor: <span>0</span></p>
          <p id="level">Seviye: <span>1</span></p>
          <p id="lives">Can: <span>3</span></p>
      </div>

      <script>
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          let score = 0;
          let level = 1;
          let lives = 3;
          let gameRunning = false;
          let gamePaused = false;
          let animationId;

          function startGame() {
              if (gameRunning) return;
              gameRunning = true;
              gamePaused = false;
              score = 0;
              level = 1;
              lives = 3;
              updateUI();
              gameLoop();
          }

          function resetGame() {
              gameRunning = false;
              gamePaused = false;
              score = 0;
              level = 1;
              lives = 3;
              updateUI();
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              if (animationId) {
                  cancelAnimationFrame(animationId);
              }
          }

          function pauseGame() {
              gamePaused = !gamePaused;
              if (!gamePaused && gameRunning) {
                  gameLoop();
              }
          }

          function gameLoop() {
              if (!gameRunning || gamePaused) return;
              
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Arkaplan
              ctx.fillStyle = '#87CEEB';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Zemin
              ctx.fillStyle = '#8B4513';
              ctx.fillRect(0, 350, canvas.width, 50);
              
              // Oyuncu
              ctx.fillStyle = '#FF6B6B';
              ctx.fillRect(50, 300, 50, 50);
              
              // Düşman
              ctx.fillStyle = '#4ECDC4';
              ctx.fillRect(700, 300, 50, 50);
              
              // Skor bilgisi
              ctx.fillStyle = '#333';
              ctx.font = '20px Arial';
              ctx.fillText('Skor: ' + score, 20, 30);
              ctx.fillText('Seviye: ' + level, 20, 60);
              ctx.fillText('Can: ' + lives, 20, 90);
              
              // Oyun başlığı
              ctx.fillStyle = '#333';
              ctx.font = '24px Arial';
              ctx.fillText('${gamePlan.gameType} Game - AI Tarafından Oluşturuldu', 200, 30);
              
              animationId = requestAnimationFrame(gameLoop);
          }

          function updateUI() {
              document.getElementById('score').querySelector('span').textContent = score;
              document.getElementById('level').querySelector('span').textContent = level;
              document.getElementById('lives').querySelector('span').textContent = lives;
          }

          // Klavye kontrolleri
          document.addEventListener('keydown', function(e) {
              if (!gameRunning) return;
              
              if (e.key === 'ArrowUp') {
                  score += 10;
                  updateUI();
              } else if (e.key === 'ArrowDown') {
                  score = Math.max(0, score - 5);
                  updateUI();
              } else if (e.key === ' ') {
                  // Space tuşu
                  score += 5;
                  updateUI();
              }
          });

          // Otomatik skor artışı
          setInterval(() => {
              if (gameRunning && !gamePaused) {
                  score += 1;
                  if (score % 100 === 0) {
                      level++;
                  }
                  updateUI();
              }
          }, 1000);

          // Oyunu otomatik başlat
          setTimeout(startGame, 1000);
      </script>
  </body>
  </html>`;
}
