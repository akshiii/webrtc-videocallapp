class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  addTrack(track, stream) {
    this.peer.addTrack(track, stream);
  }

  /**
   * Creates an offer and sets it as local description
   * @returns sdp object
   */
  async createOffer() {
    this.dataChannel = this.peer.createDataChannel("channel");
    this.dataChannel.onmessage = (e) =>
      console.log("Just got a msg = ", e.data);
    this.dataChannel.onopen = (e) => console.log("Connection opened");
    let offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));

    return offer;
  }

  /**
   * Creates an answer and sets it as remote description
   * @returns sdp object
   */
  async createAnswer(offer) {
    this.peer.ondatachannel = (e) => {
      this.dataChannel = e.channel;
      this.dataChannel.onmessage = (e) =>
        console.log("New msg from client = ", e.data);
      this.dataChannel.onopen = (e) => console.log("Connection open");
    };
    await this.peer.setRemoteDescription(offer);
    let answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  }

  async setRemoteDescription(answer) {
    await this.peer.setRemoteDescription(answer);
  }

  sendMessage(message) {
    this.dataChannel.send(message);
  }
}

export default new PeerService();
