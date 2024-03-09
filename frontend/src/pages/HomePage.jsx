import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/SocketProvider";

const HomePage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(123);
  const [name, setName] = useState("Akshi");
  const { socket } = useSocket();

  function joinRoom() {
    socket.emit("join-room", { name, roomId });
    navigate(`/room/${roomId}`, roomId);
  }

  return (
    <div className="homepage-container">
      <h3>Create or Join room</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Enter your display name.."
      />
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        type="text"
        placeholder="Enter room name.."
      />
      <button onClick={joinRoom}>Go to Room</button>
    </div>
  );
};

export default HomePage;
