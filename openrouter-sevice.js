// js/openrouter-service.js
class OpenRouterService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseURL = 'https://openrouter.ai/api/v1/chat/completions';
    }

    async generateGameCode(gameDescription) {
        try {
            console.log('🔄 OpenRouter: Oyun kodu üretiliyor...', gameDescription);

            // Eğer API key yoksa demo modda çalış
            if (!this.apiKey || this.apiKey === 'undefined') {
                console.warn('⚠️ API key bulunamadı, demo modda çalışıyor...');
                return this.getDemoGameCode(gameDescription);
            }

            const prompt = this.createGamePrompt(gameDescription);

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'GameCraft AI'
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Sen bir HTML5 oyun geliştirme uzmanısın. Kullanıcının istediği oyunu tek bir HTML dosyasında (HTML+CSS+JavaScript) oluştur. Kod temiz, çalışır ve mobil uyumlu olsun. SADECE HTML KODU DÖNDÜR, AÇIKLAMA YAPMA!"
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenRouter error: ${response.status}`);
            }

            const data = await response.json();
            const gameCode = data.choices[0].message.content;

            console.log('✅ OpenRouter: Kod üretimi başarılı!');
            return this.cleanCode(gameCode);

        } catch (error) {
            console.error('❌ OpenRouter Hatası:', error);
            return this.getDemoGameCode(gameDescription);
        }
    }

    createGamePrompt(description) {
        return `AŞAĞIDAKİ OYUNU TAM BİR HTML DOSYASI OLARAK OLUŞTUR:

OYUN TANIMI: ${description}

TEKNİK GEREKSİNİMLER:
- Tek HTML dosyası (inline CSS ve JavaScript)
- Mobil uyumlu responsive tasarım
- Temiz ve okunabilir kod
- Basit oyun mekanikleri
- Canvas veya DOM tabanlı olabilir

SADECE HTML KODU DÖNDÜR, AÇIKLAMA YAPMA!`;
    }

    cleanCode(code) {
        return code.replace(/```html|```/g, '').trim();
    }

    getDemoGameCode(description) {
        return `<!DOCTYPE html>
<html>
<head>
    <title>${description}</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial; text-align: center; background: #f0f0f0; }
        #gameCanvas { border: 2px solid #333; background: white; margin: 20px auto; display: block; }
        .controls { margin: 10px; }
        button { padding: 10px 20px; font-size: 16px; margin: 5px; }
    </style>
</head>
<body>
    <h1>${description}</h1>
    <div class="controls">
        <button onclick="startGame()">Oyunu Başlat</button>
        <button onclick="resetGame()">Sıfırla</button>
    </div>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <p id="score">Skor: 0</p>
    
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        let score = 0;
        let gameRunning = false;

        function startGame() {
            gameRunning = true;
            score = 0;
            updateScore();
            gameLoop();
        }

        function resetGame() {
            gameRunning = false;
            score = 0;
            updateScore();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function gameLoop() {
            if (!gameRunning) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'blue';
            ctx.fillRect(175, 175, 50, 50);
            
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText('Oyun Çalışıyor!', 150, 50);
            
            requestAnimationFrame(gameLoop);
        }

        function updateScore() {
            document.getElementById('score').textContent = 'Skor: ' + score;
        }

        canvas.addEventListener('click', function() {
            if (gameRunning) {
                score++;
                updateScore();
            }
        });

        startGame();
    </script>
</body>
</html>`;
    }
}
