import { Button, Input, Space } from "antd";
import { useState } from "react";
import "../App.css";

const ChatWindow = ({ sendCallback }) => {
  const [msg, setMsg] = useState("");
  const handleSend = () => {
    sendCallback(msg);
    setMsg("");
  };
  return (
    <div className="chatwindow-container">
      <Space.Compact className="chatwindow-sendBtn" style={{ width: "100%" }}>
        <Input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Enter your msg ..."
        />
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </Space.Compact>
    </div>
  );
};

export default ChatWindow;
