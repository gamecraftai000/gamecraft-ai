export default async function handler(req, res) {
  const { prompt } = req.body;
  
  const codeExamples = {
    'unity': `// Unity ${prompt} kodu
using UnityEngine;

public class ${prompt.split(' ')[0]} : MonoBehaviour {
    void Start() {
        Debug.Log("${prompt} çalışıyor!");
    }
}`,
    'jump': `// Unity zıplama kodu
public float jumpForce = 5f;
void Update() {
    if (Input.GetKeyDown(KeyCode.Space)) {
        GetComponent<Rigidbody>().AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
    }
}`,
    'default': `// ${prompt} için örnek kod
function ${prompt.split(' ')[0] || 'example'}() {
    console.log("GameCraft AI tarafından oluşturuldu!");
    // Burada ${prompt} kodu yer alacak
}`
  };

  let code = codeExamples.default;
  if (prompt.toLowerCase().includes('unity')) code = codeExamples.unity;
  if (prompt.toLowerCase().includes('zıplama') || prompt.toLowerCase().includes('jump')) code = codeExamples.jump;

  res.status(200).json({ 
    success: true, 
    code: code,
    message: `💻 "${prompt}" için kod oluşturuldu`
  });
}
