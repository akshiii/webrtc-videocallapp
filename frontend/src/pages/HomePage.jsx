import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/SocketProvider";
import { Input, Button } from "antd";

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
      <h3 className="heading">Create or Join room</h3>
      <Input
        className="nameInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Enter your display name.."
      />
      <Input
        value={roomId}
        className="nameInput"
        onChange={(e) => setRoomId(e.target.value)}
        type="text"
        placeholder="Enter room id..Eg: 123"
      />
      <Button type="primary" className="joinBtn" onClick={joinRoom}>
        Go to Room
      </Button>
    </div>
  );
};

export default HomePage;
