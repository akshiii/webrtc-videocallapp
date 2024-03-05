import "./App.css";
import PeerService from "./connection/PeerService";

function App() {
  async function enterLobby() {
    let peer1SDP = await PeerService.createOffer();
    console.log("Peer 1 sdp generated", JSON.stringify(peer1SDP));
  }

  return (
    <div className="App">
      <input type="text" placeholder="Enter code" />
      <button onClick={enterLobby}>Enter Lobby</button>
    </div>
  );
}

export default App;
