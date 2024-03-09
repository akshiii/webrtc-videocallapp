import peerService from "../connection/PeerService";
import "../App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import {
  MessageTwoTone,
  VideoCameraTwoTone,
  PhoneTwoTone,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import ChatWindow from "../components/ChatWindow";

const RoomPage = () => {
  let localStream = null;
  let remoteSocketId = "";
  let user1Ref = useRef();
  let user2Ref = useRef();
  let { socket } = useSocket();
  const [dataChannel, setDataChannel] = useState(null);
  const [isAnotherUser, setIsAnotherUser] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("room:join", handleRoomJoin);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("answer:sent", handleCallAccepted);
    socket.on("handle:ice:resp", handleIceResponse);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("room:join", handleRoomJoin);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("answer:sent", handleCallAccepted);
      socket.off("handle:ice:resp", handleIceResponse);
    };
  }, []);

  useEffect(() => {
    const loadLocalStream = async () => {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      localStream = stream;
      user1Ref.current.srcObject = stream;
      peerService.peer.addEventListener("track", gotRemoteStream);
      localStream
        .getTracks()
        .forEach((track) => peerService.peer.addTrack(track, localStream));
    };
    loadLocalStream();
    peerService.peer.addEventListener("icecandidate", handleIceCandidate);
  }, []);

  const handleIceCandidate = useCallback((event) => {
    console.log("Got ice candidate", remoteSocketId);
    if (event.candidate) {
      socket.emit("handle:ice", {
        to: remoteSocketId,
        candidate: event.candidate,
      });
    }
  }, []);

  const handleIceResponse = useCallback(({ from, candidate }) => {
    console.log("Got ice resp", from, candidate);
    peerService.peer.addIceCandidate(candidate);
  }, []);

  const gotRemoteStream = (event) => {
    const stream = event.streams[0];
    if (user2Ref.current.srcObject !== stream) {
      user2Ref.current.srcObject = stream;
    }
  };

  const createOffer = useCallback(async () => {
    let dc = peerService.peer.createDataChannel("channel");
    console.log("CREATED DATA CHANNEL");
    dc.addEventListener("message", handlePeerMessages);
    setDataChannel(dc);
    let peer1SDP = await peerService.createOffer();
    console.log("Peer 1 sdp generated");
    socket.emit("offer-created", { to: remoteSocketId, offer: peer1SDP });
  }, []);

  const handleUserJoined = useCallback(async ({ id }) => {
    console.log("handleUserJoined called id=", id);
    remoteSocketId = id;
    setIsAnotherUser(true);
  }, []);

  const handleRoomJoin = useCallback(async ({ name, roomId }) => {
    console.log("handleRoomJoin called name,roomid=", name, roomId);
  }, []);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    console.log("handleIncomingCall from = ", from);
    peerService.peer.addEventListener("datachannel", (e) => {
      console.log("GOT DATA CHANNEL");
      let dc = e.channel;
      dc.addEventListener("message", handlePeerMessages);
      setDataChannel(dc);
    });
    remoteSocketId = from;
    let answerSDP = await peerService.createAnswer(offer);
    socket.emit("call:accepted", { to: from, answer: answerSDP });
  }, []);

  const handleCallAccepted = useCallback(async ({ from, answer }) => {
    console.log("handleCallAccepted from =", from);
    await peerService.setRemoteDescription(answer);
  }, []);

  const handlePeerMessages = useCallback((message) => {
    console.log("NEW MESSAGE==", message.data);
  }, []);

  const sendMessage = (msg) => {
    dataChannel.send(msg);
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <video
            ref={user1Ref}
            className="video-player"
            id="user-1"
            autoPlay
            playsInline
          ></video>
        </Col>
        <Col span={8}>
          <video
            ref={user2Ref}
            className="video-player"
            id="user-2"
            autoPlay
            playsInline
          ></video>
        </Col>
        <Col span={8}>
          <ChatWindow sendCallback={sendMessage} />
        </Col>
      </Row>

      {/* {isAnotherUser && <button onClick={createOffer}>Start Call</button>}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Enter msg here.."
        />
        <button onClick={sendMessage}>Send in chat</button> */}
      <div id="controls">
        {!isAnotherUser ? (
          <VideoCameraAddOutlined
            style={{
              fontSize: "50px",
              margin: "20px",
            }}
          />
        ) : (
          <VideoCameraTwoTone
            onClick={createOffer}
            style={{
              fontSize: "50px",
              margin: "20px",
            }}
          />
        )}
        <MessageTwoTone
          twoToneColor="#eb2f96"
          height="30px"
          style={{
            fontSize: "50px",
            margin: "20px",
          }}
        />
        <PhoneTwoTone
          twoToneColor="darkred"
          rotate={225}
          style={{
            fontSize: "50px",
            margin: "20px",
          }}
        />
      </div>
    </>
  );
};

export default RoomPage;
