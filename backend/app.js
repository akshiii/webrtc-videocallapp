import express from "express";
import { Server } from "socket.io";

const io = new Server({
  cors: true,
});
const allSocketIdInRoom = new Map();
let connectedIds = [];

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, roomId }) => {
    console.log("User name=", name);

    if (io.sockets.adapter.rooms.get(roomId) != undefined) {
      console.log("NEW USER JOINED ");
      socket.join(roomId);
      io.to(roomId).emit("new-user-joined");
    } else {
      socket.join(roomId);
    }
  });
  socket.on("offer-created", ({ sdp }) => {
    console.log("offer-created, SDP1 recieved");
  });
});

io.listen(8001);
