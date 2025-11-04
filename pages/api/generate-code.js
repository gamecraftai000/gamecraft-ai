// pages/api/generate-code.js - KESİN ÇÖZÜM
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('🔄 Kod üretimi başlıyor:', prompt);

    // 1. ÖNCE HUGGING FACE DENEYELİM
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `HTML5 Canvas ve JavaScript ile şu oyunu yaz: ${prompt}. Kod:`,
          parameters: {
            max_new_tokens: 500
          }
        }),
      }
    );

    if (hfResponse.ok) {
      const hfData = await hfResponse.json();
      if (hfData[0]?.generated_text) {
        console.log('✅ Hugging Face kod üretti');
        return res.status(200).json({ 
          code: hfData[0].generated_text,
          source: 'hugging_face'
        });
      }
    }

    // 2. HUGGING FACE ÇALIŞMAZSA, FALLBACK KOD ÜRET
    console.log('🔄 Fallback kod üretiliyor');
    const fallbackCode = generateSmartFallbackCode(prompt);
    
    return res.status(200).json({
      code: fallbackCode,
      source: 'fallback_smart'
    });

  } catch (error) {
    console.error('❌ Kod üretim hatası:', error);
    
    // 3. SON ÇARE: BASİT FALLBACK
    const finalFallback = generateSimpleFallbackCode(prompt);
    return res.status(200).json({
      code: finalFallback,
      source: 'fallback_simple',
      error: error.message
    });
  }
}

// AKILLI FALLBACK KOD ÜRETİCİ
function generateSmartFallbackCode(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('zombi') || lowerPrompt.includes('savaş')) {
    return `// Zombi Savaş Oyunu - ${prompt}
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

// Oyun değişkenleri
let player = { x: 400, y: 300, width: 40, height: 40, speed: 5, health: 100 };
let zombies = [];
let bullets = [];
let score = 0;
let gameOver = false;

// Zombi oluştur
function createZombie() {
  zombies.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 35,
    height: 35,
    speed: 1 + Math.random() * 2,
    health: 3
  });
}

// Oyun döngüsü
function gameLoop() {
  if (gameOver) return;
  
  // Ekranı temizle
  ctx.fillStyle = '#2d5a27';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Oyuncuyu çiz
  ctx.fillStyle = '#3498db';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Zombileri çiz ve hareket ettir
  ctx.fillStyle = '#27ae60';
  zombies.forEach((zombie, index) => {
    ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    
    // Zombiyi oyuncuya doğru hareket ettir
    const dx = player.x - zombie.x;
    const dy = player.y - zombie.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    zombie.x += (dx / distance) * zombie.speed;
    zombie.y += (dy / distance) * zombie.speed;
    
    // Çarpışma kontrolü
    if (Math.abs(player.x - zombie.x) < 40 && Math.abs(player.y - zombie.y) < 40) {
      player.health -= 0.5;
      if (player.health <= 0) gameOver = true;
    }
  });
  
  // Mermileri çiz ve hareket ettir
  ctx.fillStyle = '#f1c40f';
  bullets.forEach((bullet, index) => {
    ctx.fillRect(bullet.x, bullet.y, 5, 5);
    bullet.y -= bullet.speed;
    
    // Mermi ekran dışına çıkarsa sil
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
  
  // UI çiz
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Skor: ' + score, 20, 30);
  ctx.fillText('Can: ' + Math.max(0, player.health), 20, 60);
  
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('OYUN BİTTİ', 300, 300);
    ctx.font = '20px Arial';
    ctx.fillText('Skorun: ' + score, 350, 340);
  }
  
  requestAnimationFrame(gameLoop);
}

// Kontroller
document.addEventListener('keydown', (e) => {
  if (gameOver) return;
  
  if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
  if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
  if (e.key === 'ArrowUp' && player.y > 0) player.y -= player.speed;
  if (e.key === 'ArrowDown' && player.y < canvas.height - player.height) player.y += player.speed;
  if (e.key === ' ') {
    // Ateş et
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      speed: 8
    });
  }
});

// Zombi üretimi
setInterval(createZombie, 2000);

// Oyunu başlat
gameLoop();
console.log('🧟 Zombi savaş oyunu başladı! Hayatta kal!');`;
  }
  
  else if (lowerPrompt.includes('uzay') || lowerPrompt.includes('gemi')) {
    return `// Uzay Gemisi Oyunu - ${prompt}
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let ship = { x: 400, y: 500, width: 40, height: 60, speed: 6 };
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;

function createAsteroid() {
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 40 + Math.random() * 30,
    height: 40 + Math.random() * 30,
    speed: 2 + Math.random() * 3
  });
}

function gameLoop() {
  // Arkaplan
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Yıldızlar
  ctx.fillStyle = 'white';
  for(let i = 0; i < 50; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }
  
  // Gemiyi çiz
  ctx.fillStyle = '#3498db';
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y);
  ctx.lineTo(ship.x - ship.width/2, ship.y + ship.height);
  ctx.lineTo(ship.x + ship.width/2, ship.y + ship.height);
  ctx.closePath();
  ctx.fill();
  
  // Mermiler
  ctx.fillStyle = '#f1c40f';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, 3, 10);
    bullet.y -= bullet.speed;
  });
  
  // Asteroidler
  ctx.fillStyle = '#7f8c8d';
  asteroids.forEach(asteroid => {
    ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    asteroid.y += asteroid.speed;
  });
  
  // UI
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.fillText('Skor: ' + score, 20, 30);
  ctx.fillText('Can: ' + lives, 20, 60);
  
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') ship.x = Math.max(ship.width/2, ship.x - ship.speed);
  if (e.key === 'ArrowRight') ship.x = Math.min(canvas.width - ship.width/2, ship.x + ship.speed);
  if (e.key === ' ') {
    bullets.push({ x: ship.x - 1, y: ship.y, speed: 10 });
  }
});

setInterval(createAsteroid, 1000);
gameLoop();
console.log('🚀 Uzay gemisi oyunu başladı! Asteroidleri vur!');`;
  }
  
  else {
    return generateSimpleFallbackCode(prompt);
  }
}

// BASİT FALLBACK KOD
function generateSimpleFallbackCode(prompt) {
  return `// ${prompt} - Oyun Kodu
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

// Oyun değişkenleri
let player = { x: 100, y: 100, width: 50, height: 50, speed: 5 };
let score = 0;

// Oyun döngüsü
function gameLoop() {
  // Ekranı temizle
  ctx.fillStyle = '#ecf0f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Oyuncuyu çiz
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Skor ve bilgiler
  ctx.fillStyle = '#2c3e50';
  ctx.font = '18px Arial';
  ctx.fillText('Skor: ' + score, 20, 30);
  ctx.fillText('Oyun: ${prompt}', 20, 60);
  ctx.fillText('Kontroller: Yön tuşları ile hareket, Space ile skor artır', 20, 90);
  
  requestAnimationFrame(gameLoop);
}

// Kontroller
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
  if (e.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + player.speed);
  if (e.key === 'ArrowUp') player.y = Math.max(0, player.y - player.speed);
  if (e.key === 'ArrowDown') player.y = Math.min(canvas.height - player.height, player.y + player.speed);
  if (e.key === ' ') score++;
});

// Oyunu başlat
gameLoop();
console.log('🎮 "${prompt}" oyunu başladı! İyi eğlenceler!');`;
}
