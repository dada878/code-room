import type { NextApiRequest } from 'next';
import type { NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { rooms } from '@/lib/store';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse & { socket: any }) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: '/api/socket/io' });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('join_room', ({ roomId }) => {
        socket.join(roomId);
        const content = rooms[roomId] || '';
        socket.emit('receive_code', { content });
      });

      socket.on('code_change', ({ roomId, content }) => {
        rooms[roomId] = content;
        socket.to(roomId).emit('receive_code', { content });
      });
    });
  }
  res.end();
}
