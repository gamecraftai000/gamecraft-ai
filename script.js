// script.js - Ana uygulama mantığı
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    console.log('🚀 GameCraft AI başlatıldı!');
});

let openRouterService;

function initializeChat() {
    openRouterService = new OpenRouterService();
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Kullanıcı mesajını ekrana ekle
        addMessage(userMessage, 'user');
        userInput.value = '';

        // AI yanıtını göster
        addMessage('Oyununuz oluşturuluyor...', 'ai');

        try {
            // OpenRouter ile oyun kodu üret
            const gameCode = await openRouterService.generateGameCode(userMessage);
            
            // Önceki AI mesajını kaldır
            removeLastAIMessage();
            
            // Başarı mesajını göster
            addMessage('Oyununuz başarıyla oluşturuldu! Aşağıdaki önizleme alanından oynayabilir veya indirebilirsiniz.', 'ai');
            
            // Oyunu önizleme alanında göster
            displayGamePreview(gameCode);
            
            // İndirme butonunu ayarla
            setupDownloadButton(gameCode, userMessage);
            
        } catch (error) {
            removeLastAIMessage();
            addMessage('Üzgünüm, oyun oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', 'ai');
            console.error('Oyun oluşturma hatası:', error);
        }
    });
}

function addMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLastAIMessage() {
    const chatMessages = document.getElementById('chat-messages');
    const messages = chatMessages.getElementsByClassName('ai-message');
    if (messages.length > 0) {
        chatMessages.removeChild(messages[messages.length - 1]);
    }
}

function displayGamePreview(gameCode) {
    const gamePreview = document.getElementById('game-preview');
    const placeholder = gamePreview.querySelector('.placeholder');
    
    if (placeholder) {
        placeholder.remove();
    }

    // Eski iframe'i temizle
    const oldFrame = gamePreview.querySelector('iframe');
    if (oldFrame) {
        oldFrame.remove();
    }

    // Yeni iframe oluştur
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = '1px solid #ccc';
    iframe.style.borderRadius = '8px';
    iframe.srcdoc = gameCode;
    
    gamePreview.appendChild(iframe);
}

function setupDownloadButton(gameCode, gameName) {
    const downloadBtn = document.getElementById('download-game');
    
    const blob = new Blob([gameCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    downloadBtn.href = url;
    downloadBtn.download = `gamecraft-${gameName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    downloadBtn.style.display = 'block';
}

// Blockly entegrasyonu için yardımcı fonksiyonlar
function generateCode() {
    alert('Blockly kod üretimi henüz entegre edilmedi. Önce chat ile oyun oluşturmayı deneyin!');
}

function showCode() {
    alert('Blockly kod görüntüleme henüz hazır değil.');
}
