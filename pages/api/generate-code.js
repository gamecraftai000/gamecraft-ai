// pages/api/generate-code.js - TAMAMEN YENİ KOD
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    console.log('Kod üretimi başlıyor:', prompt.substring(0, 50) + '...');

    // HUGGING FACE API - CodeLlama ile kod üret
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `HTML5 ve JavaScript kullanarak şu oyunu yaz: ${prompt}. 
          Tam çalışan bir oyun kodu üret. Sadece JavaScript ve HTML kodu döndür:`,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            top_p: 0.9
          }
        }),
      }
    );

    console.log('HF Response Status:', hfResponse.status);

    if (hfResponse.ok) {
      const hfData = await hfResponse.json();
      console.log('HF Data alındı');
      
      if (hfData.error) {
        // Model yükleniyor hatası
        if (hfData.error.includes('loading')) {
          throw new Error('AI modeli yükleniyor, lütfen 30 saniye sonra tekrar deneyin');
        }
        throw new Error(hfData.error);
      }

      const generatedCode = hfData[0]?.generated_text || '// Kod üretilemedi';
      
      res.status(200).json({ 
        code: generatedCode,
        source: 'hugging_face'
      });
      return;
    }

    // Eğer Hugging Face çalışmazsa, fallback kod üret
    throw new Error(`Hugging Face hatası: ${hfResponse.status}`);

  } catch (error) {
    console.error('Kod üretim hatası:', error);
    
    // FALLBACK: Kullanıcının prompt'una göre özelleştirilmiş kod üret
    const fallbackCode = generateFallbackCode(prompt);
    
    res.status(200).json({
      code: fallbackCode,
      source: 'fallback',
      error: error.message
    });
  }
}

// AKILLI FALLBACK KOD ÜRETİCİ
function generateFallbackCode(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Prompt analizi
  let gameType = 'basic';
  let description = 'basit bir oyun';
  
  if (lowerPrompt.includes('uzay') || lowerPrompt.includes('gemi') || lowerPrompt.includes('asteroid')) {
    gameType = 'space';
    description = 'uzay gemisi oyunu';
  } else if (lowerPrompt.includes('zıpl') || lowerPrompt.includes('top') || lowerPrompt.includes('sıçra')) {
    gameType = 'platform';
    description = 'zıplayan top oyunu';
  } else if (lowerPrompt.includes('zombi') || lowerPrompt.includes('savaş') || lowerPrompt.includes('düşman')) {
    gameType = 'shooter';
    description = 'zombi savaş oyunu';
  } else if (lowerPrompt.includes('araba') || lowerPrompt.includes('yarış')) {
    gameType = 'racing';
    description = 'araba yarışı oyunu';
  } else if (lowerPrompt.includes('labirent') || lowerPrompt.includes('puzzle')) {
    gameType = 'puzzle';
    description = 'labirent oyunu';
  }

  // Oyun türüne göre özelleştirilmiş kod
  const gameTemplates = {
    space: `
// Uzay Gemisi Oyunu
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let ship = { x: 400, y: 500, width: 50, height: 30, speed: 5 };
let bullets = [];
let asteroids = [];
let score = 0;

// Asteroid oluştur
function createAsteroid() {
  asteroids.push({
    x: Math.random() * canvas.width,
    y: 0,
    width: 30,
    height: 30,
    speed: 2 + Math.random() * 3
  });
}

// Oyun döngüsü
function gameLoop() {
  // Ekranı temizle
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Gemiyi çiz
  ctx.fillStyle = 'white';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
  
  // Skoru göster
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Skor: ' + score, 10, 30);
  
  requestAnimationFrame(gameLoop);
}

// Kontroller
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') ship.x -= ship.speed;
  if (e.key === 'ArrowRight') ship.x += ship.speed;
  if (e.key === ' ') {
    bullets.push({ x: ship.x + ship.width/2, y: ship.y, speed: 7 });
  }
});

// Asteroid üretimi
setInterval(createAsteroid, 1000);
gameLoop();
console.log('Uzay gemisi oyunu başladı!');
`,

    platform: `
// Zıplayan Top Oyunu
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let ball = { x: 400, y: 300, radius: 20, speedX: 5, speedY: 5 };
let score = 0;

function gameLoop() {
  // Ekranı temizle
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Topu hareket ettir
  ball.x += ball.speedX;
  ball.y += ball.speedY;
  
  // Duvarlardan sektir
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.speedX = -ball.speedX;
    score++;
  }
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.speedY = -ball.speedY;
    score++;
  }
  
  // Topu çiz
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
  
  // Skoru göster
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Skor: ' + score, 10, 30);
  
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log('Zıplayan top oyunu başladı!');
`,

    shooter: `
// Zombi Savaş Oyunu
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let player = { x: 400, y: 300, width: 40, height: 40, speed: 5 };
let zombies = [];
let bullets = [];
let score = 0;

function createZombie() {
  zombies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 30,
    height: 30,
    speed: 1
  });
}

function gameLoop() {
  // Ekranı temizle
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Oyuncuyu çiz
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Zombileri çiz ve hareket ettir
  ctx.fillStyle = 'green';
  zombies.forEach(zombie => {
    ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
  });
  
  // Skoru göster
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Skor: ' + score, 10, 30);
  
  requestAnimationFrame(gameLoop);
}

// Kontroller
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.x -= player.speed;
  if (e.key === 'ArrowRight') player.x += player.speed;
  if (e.key === 'ArrowUp') player.y -= player.speed;
  if (e.key === 'ArrowDown') player.y += player.speed;
});

// Zombi üretimi
setInterval(createZombie, 2000);
gameLoop();
console.log('Zombi savaş oyunu başladı!');
`,

    basic: `
// Basit Oyun Şablonu
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let player = { x: 100, y: 100, width: 50, height: 50 };
let score = 0;

function gameLoop() {
  // Ekranı temizle
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Oyuncuyu çiz
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Skoru göster
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Skor: ' + score, 10, 30);
  ctx.fillText('Oyun: ${prompt}', 10, 60);
  
  requestAnimationFrame(gameLoop);
}

// Kontroller
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.x -= 5;
  if (e.key === 'ArrowRight') player.x += 5;
  if (e.key === 'ArrowUp') player.y -= 5;
  if (e.key === 'ArrowDown') player.y += 5;
  if (e.key === ' ') score++; // Space tuşu ile skor artır
});

gameLoop();
console.log('${description} başladı!');
`
  };

  return gameTemplates[gameType] || gameTemplates.basic;
}
