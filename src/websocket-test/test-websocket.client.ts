import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected');

  socket.emit('joinChat', { chatSessionId: 6 });
  console.log('joinChat');

  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);
  });

  setTimeout(() => {
    socket.disconnect();
  }, 5000);
});

