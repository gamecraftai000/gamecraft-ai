export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    // Basit ve her zaman çalışan demo kodları
    let generatedCode = '';
    
    if (prompt.includes('uzaylı') || prompt.includes('astronot')) {
      generatedCode = `// Uzaylı Savaş Oyunu - Unity C#
using UnityEngine;

public class AstronautController : MonoBehaviour {
    public float speed = 5f;
    public float jumpForce = 7f;
    public GameObject bullet;
    public int score = 0;
    
    private Rigidbody2D rb;
    private bool isGrounded;
    
    void Start() {
        rb = GetComponent<Rigidbody2D>();
    }
    
    void Update() {
        // Hareket
        float move = Input.GetAxis("Horizontal");
        rb.velocity = new Vector2(move * speed, rb.velocity.y);
        
        // Zıplama
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded) {
            rb.AddForce(Vector2.up * jumpForce, ForceMode.Impulse);
        }
        
        // Ateş etme
        if (Input.GetKeyDown(KeyCode.F)) {
            Instantiate(bullet, transform.position, Quaternion.identity);
        }
    }
    
    void OnCollisionEnter2D(Collision2D collision) {
        if (collision.gameObject.CompareTag("Ground")) {
            isGrounded = true;
        }
        
        if (collision.gameObject.CompareTag("Alien")) {
            score += 100;
            Destroy(collision.gameObject);
        }
    }
}`;
    }
    else if (prompt.includes('zombi') || prompt.includes('silah')) {
      generatedCode = `// Zombi Savunma Oyunu - JavaScript
class ZombieGame {
    constructor() {
        this.player = { x: 50, y: 50, health: 100, ammo: 30 };
        this.zombies = [];
        this.score = 0;
        this.gameOver = false;
    }
    
    movePlayer(direction) {
        if (this.gameOver) return;
        
        switch(direction) {
            case 'left': this.player.x -= 10; break;
            case 'right': this.player.x += 10; break;
            case 'up': this.player.y -= 10; break;
            case 'down': this.player.y += 10; break;
        }
    }
    
    shoot() {
        if (this.player.ammo > 0) {
            this.player.ammo--;
            // Zombi vurma mantığı
            this.zombies = this.zombies.filter(zombie => {
                const hit = Math.abs(zombie.x - this.player.x) < 20;
                if (hit) this.score += 50;
                return !hit;
            });
        }
    }
    
    spawnZombie() {
        this.zombies.push({ x: Math.random() * 400, y: Math.random() * 400 });
    }
}`;
    }
    else {
      // Genel oyun şablonu
      generatedCode = `// ${prompt} - Oyun Kodu
// GameCraft AI tarafından oluşturdu

using UnityEngine;

public class GameController : MonoBehaviour {
    public int score = 0;
    public int health = 100;
    
    void Start() {
        Debug.Log("${prompt} oyunu başladı!");
    }
    
    void Update() {
        // Oyun mantığı buraya gelecek
        if (health <= 0) {
            GameOver();
        }
    }
    
    void GameOver() {
        Debug.Log("Oyun Bitti! Skor: " + score);
    }
}`;
    }

    res.status(200).json({ 
      success: true, 
      code: generatedCode,
      message: '🎮 Oyun kodunuz hazır!'
    });
    
  } catch (error) {
    res.status(200).json({ 
      success: true, 
      code: '// Hata oluştu, lütfen tekrar deneyin',
      message: '⚠️ Demo modu aktif'
    });
  }
}
