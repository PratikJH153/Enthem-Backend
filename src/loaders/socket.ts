import { createServer } from "http";
import { Server } from "socket.io";
import { Container } from "typedi";
import SocketService from "../services/socket_service";
import config from "../config";

export default (app) => {
  const server = createServer(app);
  const io = new Server(server);
  const socketService = Container.get(SocketService);
  
//   io.attach(+config.socketPort);

  io.on("connection", (socket) => {
    console.log("Backend Connected");
    var roomID: string;

    socket.on("sendRoomID", (roomID) => {
      roomID = roomID;
      socket.join(roomID);
    });

    socket.on('disconnect', () => {
      console.log("User Disconnected");
      socket.leave(roomID)
    })

    socket.on("sendMsg", (msg) => {
      console.log("Message received!", msg);
      var receiverChatID = msg.receiverChatID;
      var senderChatID = msg.senderChatID;
      var content = msg.content;
      socket.broadcast.in(receiverChatID).emit("sendMsgServer", {
        'content': content,
        'senderChatID': senderChatID,
        'receiverChatID': receiverChatID,
      });
    });
  });
  
  server.listen(config.socketPort, () => {
    console.log(`Socket listening on ${config.socketPort}`);
  })
};
