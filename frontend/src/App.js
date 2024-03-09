import "./App.css";
import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./providers/SocketProvider";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
