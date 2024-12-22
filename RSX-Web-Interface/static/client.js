const socket = io();

const messageInput = document.querySelector('.messageInput');
const sendButton = document.querySelector('.sendButton');
const messagesContainer = document.querySelector('.messagesContainer');

socket.on('chat message', (msg) => {
    const message = document.createElement('div');
    message.classList.add('message');
    message.textContent = msg;
    messagesContainer.appendChild(message);
    window.scrollTo(0, document.body.scrollHeight);
});