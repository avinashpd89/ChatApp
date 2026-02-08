import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://chatapp-ryiv.onrender.com",
        methods: ["GET", "POST"],
    }
})

// realtime message
export const getReceiverSocketId = (receiverId) => {
    return users[receiverId]
}

const users = {}
// Track active group calls: { roomId: [{ socketId, userId, name }] }
const groupCalls = {}

// used to listen events on server side.
io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        users[userId] = socket.id
        console.log("Hello", users)
    }
    // used to send the events to all connected users
    io.emit("getOnlineUsers", Object.keys(users));

    socket.on("callUser", (data) => {
        console.log("Server received callUser event:", data.from, "calling", data.userToCall);
        const { userToCall, signalData, from, name, callType } = data;
        if (users[userToCall]) {
            console.log("Target user found, emitting callUser to:", users[userToCall], "Type:", callType);
            io.to(users[userToCall]).emit("callUser", { signal: signalData, from, name, callType });
        } else {
            console.log("Target user NOT found in users list:", userToCall);
            console.log("Current online users:", Object.keys(users));
        }
    });

    socket.on("answerCall", (data) => {
        console.log("Server received answerCall event to:", data.to);
        // data.to is already a socket ID from the client (call.from)
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on("rejectCall", (data) => {
        console.log("Server received rejectCall event to:", data.to);
        // data.to is already a socket ID from the client (call.from)
        io.to(data.to).emit("callRejected");
    });

    socket.on("endCall", (data) => {
        console.log("Server received endCall event to:", data.to);
        let targetSocketId = data.to;
        if (users[data.to]) {
            targetSocketId = users[data.to];
        }
        io.to(targetSocketId).emit("callEnded");
    });

    // GROUP CALL EVENTS
    socket.on("start-group-call", (data) => {
        const { roomId, userId, name, callType, members } = data;
        console.log(`User ${name} starting group call in room ${roomId}, type: ${callType}`);

        // Initialize room if it doesn't exist
        if (!groupCalls[roomId]) {
            groupCalls[roomId] = [];
        }

        // Add initiator to room
        groupCalls[roomId].push({ socketId: socket.id, userId, name });
        socket.join(roomId);

        // Notify all online group members about the call
        members.forEach(memberId => {
            if (users[memberId] && memberId !== userId) {
                io.to(users[memberId]).emit("group-call-invitation", {
                    roomId,
                    callType,
                    callerName: name,
                    callerId: userId
                });
            }
        });
    });

    socket.on("join-group-call", (data) => {
        const { roomId, userId, name } = data;
        console.log(`User ${name} joining group call room ${roomId}`);

        if (!groupCalls[roomId]) {
            groupCalls[roomId] = [];
        }

        // Get existing participants
        const existingParticipants = groupCalls[roomId].map(p => ({
            socketId: p.socketId,
            userId: p.userId,
            name: p.name
        }));

        // Add new participant to room
        groupCalls[roomId].push({ socketId: socket.id, userId, name });
        socket.join(roomId);

        // Send existing participants to the new joiner
        socket.emit("existing-participants", { participants: existingParticipants });

        // Notify existing participants about new joiner
        socket.to(roomId).emit("user-joined-call", {
            socketId: socket.id,
            userId,
            name
        });
    });

    socket.on("signal-to-peer", (data) => {
        const { targetSocketId, signal, callerId, callerName } = data;
        console.log(`Relaying signal from ${socket.id} to ${targetSocketId}`);

        io.to(targetSocketId).emit("peer-signal", {
            signal,
            callerId,
            callerName,
            socketId: socket.id
        });
    });

    socket.on("leave-group-call", (data) => {
        const { roomId, userId } = data;
        console.log(`User ${userId} leaving group call room ${roomId}`);

        if (groupCalls[roomId]) {
            groupCalls[roomId] = groupCalls[roomId].filter(p => p.socketId !== socket.id);

            // If room is empty, delete it
            if (groupCalls[roomId].length === 0) {
                delete groupCalls[roomId];
            }

            // Notify others in the room
            socket.to(roomId).emit("user-left-call", { socketId: socket.id, userId });
            socket.leave(roomId);
        }
    });

    // used to listen client side events emitted by server side (server & client)
    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
        delete users[userId];

        // Remove from any active group calls
        Object.keys(groupCalls).forEach(roomId => {
            const participant = groupCalls[roomId].find(p => p.socketId === socket.id);
            if (participant) {
                groupCalls[roomId] = groupCalls[roomId].filter(p => p.socketId !== socket.id);

                if (groupCalls[roomId].length === 0) {
                    delete groupCalls[roomId];
                } else {
                    io.to(roomId).emit("user-left-call", {
                        socketId: socket.id,
                        userId: participant.userId
                    });
                }
            }
        });

        io.emit("getOnlineUsers", Object.keys(users));
    })
})

export { app, io, server }