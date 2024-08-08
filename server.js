const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('New user connected');

    // Store the username associated with this socket
    let userName = '';

    // Handle new user joining
    socket.on('new-user-joined', (user) => {
        userName = user;
        console.log(`New user joined: ${user}`);
        socket.broadcast.emit('user-joined', user);
    });

    // Handle sending messages
    socket.on('sendMessage', (msg) => {
        console.log('Message received:', msg);
        socket.broadcast.emit('receiveMessage', msg);
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        console.log(`${userName} left the chat`);
        socket.broadcast.emit('user-disconnect', userName);
    });
});
