export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // OpenAI API Key - Vercel environment variable'dan alacak
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      error: 'OpenAI API key bulunamadı' 
    });
  }

  try {
    // OpenAI GPT-4 API çağrısı
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // GPT-4'ten daha hızlı ve ucuz
        messages: [
          {
            role: 'system',
            content: `Sen bir oyun geliştirme uzmanısın. Kullanıcıların istediği oyun kodlarını yaz.
            
            KURALLAR:
            - Sadece kod yaz, açıklama yapma
            - Kod bloğu içinde ver
            - Temiz ve anlaşılır kod yaz
            - Gereksiz yorum satırı ekleme
            - Eğer Unity kodu istiyorsa C# kullan
            - Eğer Unreal Engine kodu istiyorsa C++ veya Blueprint benzeri pseudocode kullan
            - Web oyunu için JavaScript/HTML5 kullan
            - Mobil oyun için gereken dilde yaz`
          },
          {
            role: 'user',
            content: `Aşağıdaki oyun geliştirme kodunu yaz: "${prompt}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API hatası: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0]?.message?.content;

    if (!generatedCode) {
      throw new Error('AI kod üretemedi');
    }

    res.status(200).json({ 
      success: true, 
      code: generatedCode,
      message: '🤖 AI tarafından kod oluşturuldu!'
    });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    // Fallback: Basit kod örnekleri
    const fallbackCode = getFallbackCode(prompt);
    
    res.status(200).json({ 
      success: true, 
      code: fallbackCode,
      message: '⚠️ Demo modu: ' + error.message
    });
  }
}

// Fallback kod örnekleri
function getFallbackCode(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('unity') || lowerPrompt.includes('c#')) {
    return `// Unity - ${prompt}
using UnityEngine;

public class GameController : MonoBehaviour
{
    void Start()
    {
        Debug.Log("${prompt} - GameCraft AI tarafından oluşturuldu");
    }
    
    void Update()
    {
        // Oyun mantığı buraya
    }
}`;
  }
  
  if (lowerPrompt.includes('javascript') || lowerPrompt.includes('html5') || lowerPrompt.includes('web')) {
    return `// JavaScript/HTML5 - ${prompt}
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }
    
    init() {
        console.log("${prompt} - GameCraft AI tarafından oluşturuldu");
        this.gameLoop();
    }
    
    gameLoop() {
        // Oyun döngüsü
        requestAnimationFrame(() => this.gameLoop());
    }
}`;
  }

  if (lowerPrompt.includes('unreal') || lowerPrompt.includes('c++')) {
    return `// Unreal Engine C++ - ${prompt}
#include "GameFramework/Actor.h"
#include "Components/StaticMeshComponent.h"

AYourActor::AYourActor()
{
    PrimaryActorTick.bCanEverTick = true;
    StaticMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StaticMesh"));
    RootComponent = StaticMesh;
}

void AYourActor::BeginPlay()
{
    Super::BeginPlay();
    UE_LOG(LogTemp, Warning, TEXT("${prompt} - GameCraft AI"));
}

void AYourActor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}`;
  }

  // Genel kod şablonu
  return `// ${prompt} - GameCraft AI tarafından oluşturuldu

function main() {
    // Kod buraya gelecek
    console.log("${prompt} çalışıyor!");
}

main();`;
}
