import { io } from 'socket.io-client';
export const socket = io('https://api.richie.club', {
  retries: 3,
  autoConnect: false
});
