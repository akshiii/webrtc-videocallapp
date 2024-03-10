# webrtcBasics-chatapp

A webRTC app with basic communication and sharing messages on ReactJs, with Signalling server on nodeJS and using Ant UI library for better UI

Steps to run this app on your local:

1. cd /frontend
2. npm install
3. npm start ( This will start client app on localhost:3000)
4. cd /backend
5. npm install
6. npm start ( This will start server on PORT(8001)

Steps to test webRTC:
1. Open app in 2 browser windows.
2. Enter name and room id and Go To Room (Peer 1)
3. Do the same in another window with same Room id(Peer 2).
4. Now you will enter this room and your video will start.
5. Peer 1 click on the below video icon to start the connection.
6. Connection starts with Peer 2 and both will be able to see each other's video.
7. Users can drop the call by clicking on red Call button.
8. Users can send chats to each other from right hand side chat panel.
