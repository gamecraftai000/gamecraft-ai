// pages/api/generate-code.js - GÜNCELLENMİŞ
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Hugging Face API çağrısı
    const response = await fetch(
      'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `HTML5 Canvas ve JavaScript kullanarak şu oyunu yaz: ${prompt}. 
          Tam çalışan bir oyun kodu üret:`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7
          }
        }),
      }
    );

    if (!response.ok) {
      // Eğer model yükleniyorsa
      if (response.status === 503) {
        return res.status(200).json({ 
          code: '// Model şu anda yükleniyor, lütfen 30 saniye sonra tekrar deneyin.\n// Basit oyun kodu:\nconst canvas = document.createElement("canvas");\ndocument.body.appendChild(canvas);\nconst ctx = canvas.getContext("2d");\ncanvas.width = 800;\ncanvas.height = 600;\n\nfunction gameLoop() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  ctx.fillStyle = "red";\n  ctx.fillRect(100, 100, 50, 50);\n  requestAnimationFrame(gameLoop);\n}\n\ngameLoop();'
        });
      }
      throw new Error('Hugging Face API hatası: ' + response.status);
    }

    const data = await response.json();
    
    if (data.error) {
      return res.status(200).json({ 
        code: '// AI modeli yükleniyor... Basit kod:\nconsole.log("Oyun başladı!");\n// Lütfen birkaç dakika sonra tekrar deneyin.' 
      });
    }

    res.status(200).json({ 
      code: data[0]?.generated_text || '// Kod üretilemedi' 
    });
    
  } catch (error) {
    console.error('Kod üretim hatası:', error);
    // Hata durumunda basit bir fallback kod döndür
    res.status(200).json({
      code: `// ${prompt} için basit oyun kodu:
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let x = 100;
let y = 100;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Oyun nesnesi
  ctx.fillStyle = 'blue';
  ctx.fillRect(x, y, 50, 50);
  
  // Basit hareket
  x += 2;
  if (x > canvas.width) x = 0;
  
  requestAnimationFrame(gameLoop);
}

gameLoop();
console.log("${prompt} oyunu çalışıyor!");`
    });
  }
}
