document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');

    const sendMessage = async () => {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user-message');
        userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            const data = await response.json();

            if (!response.ok) {
                // The server returned an error. 'data.error' should contain the message.
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            appendMessage(data.response, 'bot-message');
        } catch (error) {
            console.error('Error sending message:', error);
            // Display the specific error message from the server or the network error.
            appendMessage(error.message, 'bot-message');
        }
    };

    const appendMessage = (text, className) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
