import { Server } from "socket.io";

const io = new Server({
  cors: true,
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, roomId }) => {
    console.log("User joined = ", name, roomId);
    io.to(roomId).emit("user:joined", { id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("room:join", { name, roomId });
  });
  socket.on("offer-created", ({ to, offer }) => {
    console.log("offer-created, SDP1 recieved");
    io.to(to).emit("incoming-call", { from: socket.id, offer });
  });
  socket.on("call:accepted", ({ to, answer }) => {
    console.log("call-accepted, SDP2 recieved", to);
    io.to(to).emit("answer:sent", { from: socket.id, answer });
  });
  socket.on("handle:ice", ({ to, candidate }) => {
    io.to(to).emit("handle:ice:resp", { from: socket.id, candidate });
  });
});

io.listen(8001);
