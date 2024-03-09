# webrtcBasics-chatapp

A webRTC app with basic communication and sharing messages
Flow:

1. User joins a room, lets say room id= "123", if no one else has joined that room then this user creates an offer and emits "offer-created".
2. If some other user is already there in same room, then video call will start
