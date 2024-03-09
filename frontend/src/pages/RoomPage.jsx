import peerService from "../connection/PeerService";
import "../App.css";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";

const RoomPage = ({ roomId }) => {
  let localStream = null;
  let remoteStream = null;
  let user1Ref = useRef();
  const { socket } = useSocket();
  const [someoneJoined, setSomeoneJoined] = useState(false);

  async function enterLobby() {
    let peer1SDP = await peerService.createOffer();
    console.log("Peer 1 sdp generated", JSON.stringify(peer1SDP));
    localStream?.getTracks().forEach((tracks) => {
      peerService.addTrack(tracks, localStream);
    });
    socket.emit("offer-created", { sdp: peer1SDP });
  }

  async function loadStream() {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localStream = stream;
    user1Ref.current.srcObject = stream;
    remoteStream = new MediaStream();
    return stream;
  }

  const handleNewUserJoined = () => {
    console.log("New user joined");
    setSomeoneJoined(true);
  };

  useEffect(() => {
    socket.on("new-user-joined", handleNewUserJoined);
    return () => {
      socket.off("new-user-joined", handleNewUserJoined);
    };
  });

  useEffect(() => {
    // loadStream();
    // enterLobby();
    // peerService.ontrack = (e) => {
    //   e.streams[0].getTracks().forEach((track) => {
    //     remoteStream.addTrack();
    //   });
    // };
  }, []);

  return (
    <>
      {someoneJoined ? (
        <div id="videos">
          <video ref={user1Ref} className="video-player" id="user-1" autoPlay playsInline></video>
          <video className="video-player" id="user-2" autoPlay playsInline></video>
        </div>
      ) : (
        <div>Waiting...</div>
      )}
    </>
  );
};

export default RoomPage;
