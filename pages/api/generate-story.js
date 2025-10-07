export default async function handler(req, res) {
  const { prompt } = req.body;
  
  const storyTemplates = {
    'fantastik': `Fantastik Hikaye: "${prompt}"\n\nKahramanımız cesur bir savaşçıydı. ${prompt} macerasında...`,
    'karakter': `Karakter Diyaloğu: "${prompt}"\n\n- Merhaba, ben ${prompt.split(' ')[0]}!\n- Hoş geldin!`,
    'görev': `Görev Metni: "${prompt}"\n\nYeni görev: ${prompt}\nÖdül: 100 altın\nZorluk: Orta`
  };

  let text = `"${prompt}" için özel içerik:\n\nGameCraft AI tarafından ${new Date().toLocaleDateString()} tarihinde oluşturuldu.`;
  
  if (prompt.toLowerCase().includes('fantastik')) text = storyTemplates.fantastik;
  if (prompt.toLowerCase().includes('karakter')) text = storyTemplates.karakter;
  if (prompt.toLowerCase().includes('görev')) text = storyTemplates.görev;

  res.status(200).json({ 
    success: true, 
    text: text,
    message: `📖 "${prompt}" için metin oluşturuldu`
  });
}
