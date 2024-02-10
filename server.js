const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
});
const home = require("./routes/home");

app.use(cors());

app.use("/home", home);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('draw', (msg) => {
    socket.to(msg.roomUuid).emit('draw', msg);
    console.log(`User ${msg.senderId} draw in room: ${msg.roomUuid}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});