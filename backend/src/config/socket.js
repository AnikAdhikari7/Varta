import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.CORS_ORIGIN],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // io.emit will send the event to all connected clients
    io.emit('onlineUsers', Object.keys(userSocketMap))

    
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap))
    });
})

export { app, io, server };
