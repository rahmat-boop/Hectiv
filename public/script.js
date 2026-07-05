const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

let conversationHistory = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  conversationHistory.push({ role: 'user', text: userMessage });

  const loadingId = appendMessage('bot', 'Gemini sedang berpikir...');

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation: conversationHistory })
    });

    const data = await response.json();

    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();


    if (response.ok) {
      appendMessage('bot', data.result);
      conversationHistory.push({ role: 'model', text: data.result });
    } else {
      appendMessage('bot', `Error: ${data.error || 'Gagal mendapatkan respons.'}`);
    }
  } catch (error) {
    console.error(error);
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();
    appendMessage('bot', 'Terjadi kesalahan koneksi ke server.');
  }
}); 


function formatMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  const uniqueId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  
  msg.id = uniqueId;
  msg.classList.add('message', sender);
  
  msg.innerHTML = formatMarkdown(text);
  
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  return uniqueId;
}