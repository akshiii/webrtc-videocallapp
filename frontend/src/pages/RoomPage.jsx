import peerService from "../connection/PeerService";
import "../App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";

const RoomPage = ({ roomId }) => {
  let localStream = null;
  let remoteSocketId = "";
  let user1Ref = useRef();
  let user2Ref = useRef();
  let { socket } = useSocket();

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
    let peer1SDP = await peerService.createOffer();
    console.log("Peer 1 sdp generated");
    socket.emit("offer-created", { to: remoteSocketId, offer: peer1SDP });
  }, []);

  const handleUserJoined = useCallback(async ({ id }) => {
    console.log("handleUserJoined called id=", id);
    remoteSocketId = id;
  }, []);

  const handleRoomJoin = useCallback(async ({ name, roomId }) => {
    console.log("handleRoomJoin called name,roomid=", name, roomId);
  }, []);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    console.log("handleIncomingCall from = ", from);
    remoteSocketId = from;
    let answerSDP = await peerService.createAnswer(offer);
    socket.emit("call:accepted", { to: from, answer: answerSDP });
  }, []);

  const handleCallAccepted = useCallback(async ({ from, answer }) => {
    console.log("handleCallAccepted from =", from);
    await peerService.setRemoteDescription(answer);
  }, []);

  return (
    <>
      <div id="videos">
        <video
          ref={user1Ref}
          className="video-player"
          id="user-1"
          autoPlay
          playsInline
        ></video>
        <video
          ref={user2Ref}
          className="video-player"
          id="user-2"
          autoPlay
          playsInline
        ></video>
        <button onClick={createOffer}>Create offer</button>
      </div>
    </>
  );
};

export default RoomPage;
