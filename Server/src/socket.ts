import http from "http";
import { Server, Socket } from "socket.io";
import app from './app';


export const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    // Join a room
    socket.on("joinRoom", (roomId: string) => {
        // Join the specified room
        socket.join(roomId);
    
        console.log(`User joined room ${roomId}`);
    });


    socket.on("leaveAllRooms", () => {
        console.log("leaveAllRooms")

        // Get all the room
        const rooms = [...socket.rooms];

        // Leave all the specified room
        rooms.forEach((room) => {
            socket.leave(room);
            console.log(`User left room ${room}`);
        });
    })


    // Leave a room
    socket.on("leaveRoom", (roomId: string) => {
        // Leave the specified room
        socket.leave(roomId);
    
        console.log(`User left room ${roomId}`);
    });
});



export default io;