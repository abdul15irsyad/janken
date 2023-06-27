import { Server, Socket } from 'socket.io';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Room, User } from './class';

export const initSocket = (server: http.Server) => {
  const io = new Server(server);
  let userIds: string[] = [];
  let rooms: Array<Room> = [];

  io.on('connection', (socket: Socket) => {
    const user = new User(socket.id, uuidv4());
    userIds.push(user.id);
    socket.emit('connected', { userId: user.id });

    // CREATE ROOM
    socket.on('create-room', () => {
      if (rooms.filter((room) => room.hostUser.id === user.id).length > 0) {
        return socket.emit('failed-create-room', {
          message: 'already have a room',
        });
      }
      const newRoom = new Room(user);
      rooms.push(newRoom);
      socket.emit('created-room', newRoom);
    });

    // JOIN ROOM
    socket.on('join-room', ({ roomId }) => {
      const room = rooms.find((room) => room.id === roomId);
      if (!room) {
        return socket.emit('failed-join-room', {
          message: `room does't exists`,
        });
      }
      if (room.members.find((member) => member.socketId === socket.id)) {
        return socket.emit('failed-join-room', {
          message: `already in a room`,
        });
      }
      if (
        room.members.filter(
          (member) => member.socketId !== room.hostUser.socketId,
        ).length > 0
      ) {
        return socket.emit('failed-join-room', {
          message: `room has full member`,
        });
      }
      room.members.push(user);
      socket.emit('joined-room', room);
    });

    // JANKEN START
    socket.on('janken', ({ janken, roomId }) => {
      const room = rooms.find((room) => room.id === roomId);
      let user = room?.members.find((member) => member.socketId === socket.id);
      user!.janken = janken;
      socket
        .to(
          room?.members.find((member) => member.socketId !== socket.id)
            ?.socketId!,
        )
        .emit('janken-opponent', { janken });
    });
  });
};
