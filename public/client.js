const socket = io(); // Connect to the server

// HTML Elements
const textarea = document.querySelector('#text-area');
const messageArea = document.querySelector('.message__area');

let userName;
const maxLength = 8;
do {
    userName = prompt(`Enter your username (max ${maxLength} characters):`);

    if (!userName) {
        alert('You canceled the prompt.');
        continue;
    }
    if (userName.length <= maxLength) {
        alert('You logged in successfully.');
        break;
    } else {
        alert(`Please enter a username with ${maxLength} or fewer characters.`);
    }
} while (true);


// Emit event to notify server about a new user
socket.emit('new-user-joined', userName);

// Listen for keyup events on the textarea
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const messageContent = e.target.value.trim();
        if (messageContent) {
            sendMsg(messageContent);
            textarea.value = ''; // Clear the textarea
        }
    }
});

// Send message function
function sendMsg(message) {
    const msg = {
        user: userName,
        message: message
    };
    appendMsg(msg, 'outgoing');
    scrollIntoBottom();

    // Emit sendMessage event to the server
    socket.emit('sendMessage', msg);
}

// Append message to the chat area
function appendMsg(msg, type) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    const markUp = `
        <h4>${msg.user.toLowerCase()}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markUp;

    messageArea.appendChild(mainDiv);
    scrollIntoBottom();
}

// Receive message from the server
socket.on('receiveMessage', (msg) => {
    appendMsg(msg, 'incoming');
    scrollIntoBottom();
});

// Notify when a new user joins
socket.on('user-joined', (user) => {
    const newUserMsg = {
        user: 'System',
        message: `${user.toUpperCase()} has joined the chat`
    };
    appendMsg(newUserMsg, 'incoming');
    scrollIntoBottom();
});

// Notify when a user leaves
socket.on('user-disconnect', (user) => {
    const disconnectedUserMsg = {
        user: 'System',
        message: `${user.toUpperCase()} has left the chat`
    };
    appendMsg(disconnectedUserMsg, 'incoming');
    scrollIntoBottom();
});

// Scroll to the bottom of the chat area
function scrollIntoBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
