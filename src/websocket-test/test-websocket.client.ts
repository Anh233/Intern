import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected');

  socket.emit('message', { message: 'Hello, World!' });
  socket.on('message', (data) => {
    console.log('Nhận được tin nhắn từ server', data);
  });

  setTimeout(() => {
    socket.disconnect();
  }, 5000);
});
