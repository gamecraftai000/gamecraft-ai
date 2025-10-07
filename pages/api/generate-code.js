export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // OpenAI API Key - Vercel environment variable'dan
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // Eğer OpenAI key yoksa, demo moda geç
  if (!OPENAI_API_KEY) {
    const demoCode = getDemoCode(prompt);
    return res.status(200).json({ 
      success: true, 
      code: demoCode,
      message: '🎮 Demo Modu - OpenAI key bekleniyor'
    });
  }

  try {
    // GERÇEK OpenAI API çağrısı
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Sen bir oyun geliştirme uzmanısın. Kullanıcının istediği oyunu TAM olarak kodla.

ÖNEMLİ KURALLAR:
1. SADECE kod yaz, açıklama yapma
2. Tüm gerekli sınıfları ve metodları yaz
3. Unity için C#, JavaScript için ES6+ kullan
4. Kodu temiz ve kullanılabilir yap
5. En az 50-100 satır detaylı kod yaz
6. Oyun motorunu otomatik seç (Unity/JavaScript)
7. Hareket, çarpışma, skor sistemlerini ekle

ÖRNEK ÇIKTI:
- Karakter kontrol kodu
- Düşman/Engel sistemi
- Skor/Can yönetimi
- Oyun döngüsü`
          },
          {
            role: 'user',
            content: `Şu oyunu TAM olarak kodla: "${prompt}"`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API hatası: ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0]?.message?.content;

    if (!generatedCode) {
      throw new Error('AI kod üretemedi');
    }

    res.status(200).json({ 
      success: true, 
      code: generatedCode,
      message: '🤖 GERÇEK AI ile oyun kodu oluşturuldu!'
    });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    // Hata durumunda demo moda geç
    const demoCode = getDemoCode(prompt);
    
    res.status(200).json({ 
      success: true, 
      code: demoCode,
      message: '⚠️ Demo Modu: ' + error.message
    });
  }
}

// Demo mod kodu (fallback)
function getDemoCode(prompt) {
  if (prompt.includes('uzaylı') || prompt.includes('astronot')) {
    return `// Uzaylı Savaş Oyunu - Unity C# (Demo)
using UnityEngine;

public class AstronautController : MonoBehaviour {
    public float speed = 5f;
    public float jumpForce = 7f;
    public GameObject bullet;
    public int score = 0;
    public int health = 100;
    
    private Rigidbody2D rb;
    private bool isGrounded;
    
    void Start() {
        rb = GetComponent<Rigidbody2D>();
    }
    
    void Update() {
        float move = Input.GetAxis("Horizontal");
        rb.velocity = new Vector2(move * speed, rb.velocity.y);
        
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded) {
            rb.AddForce(Vector2.up * jumpForce, ForceMode.Impulse);
        }
        
        if (Input.GetKeyDown(KeyCode.F)) {
            Shoot();
        }
    }
    
    void Shoot() {
        Instantiate(bullet, transform.position, Quaternion.identity);
    }
    
    void OnCollisionEnter2D(Collision2D collision) {
        if (collision.gameObject.CompareTag("Ground")) {
            isGrounded = true;
        }
        if (collision.gameObject.CompareTag("Alien")) {
            score += 100;
            Destroy(collision.gameObject);
        }
        if (collision.gameObject.CompareTag("EnemyBullet")) {
            health -= 10;
            if (health <= 0) GameOver();
        }
    }
    
    void GameOver() {
        Debug.Log("Oyun Bitti! Skor: " + score);
    }
}`;
  }
  else {
    return `// ${prompt} - Oyun Kodu (Demo)
// GameCraft AI Demo Modu

using UnityEngine;

public class GameController : MonoBehaviour {
    public int score = 0;
    public int health = 100;
    public bool gameRunning = true;
    
    void Start() {
        Debug.Log("${prompt} oyunu başladı!");
        InitializeGame();
    }
    
    void InitializeGame() {
        score = 0;
        health = 100;
    }
    
    void Update() {
        if (!gameRunning) return;
        
        if (health <= 0) {
            GameOver();
        }
    }
    
    void GameOver() {
        gameRunning = false;
        Debug.Log("Oyun Bitti! Final Skor: " + score);
    }
}`;
  }
}
