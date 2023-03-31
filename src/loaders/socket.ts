import { createServer } from "http";
import { Server } from "socket.io";
import { Container } from "typedi";
import SocketService from "../services/socket_service";
import config from "../config";
import RoomService from "../services/room_service";

export default (app) => {
  const server = createServer(app);
  const io = new Server(server);
  const socketService = Container.get(SocketService);
  const roomService = Container.get(RoomService);
  io.on("connection", (socket) => {
    console.log("Backend Connected");
    var roomID: string;

    socket.on('removeMember', async (data) => {
      console.log("asdasdasd" + data);
      const {roomID, memberID} = data;
      console.log(await roomService.removeMember(roomID, memberID));
      socket.leave(roomID);
      console.log("User removed");
    })

    socket.on('disconnect', async (roomID, memberID) => {
      console.log("User Disconnected");
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

    //delete chat room
    socket.on("deleteRoom", async (data) => {
      try {
        const {roomID, ownerID} = data;
        await roomService.deleteRoom(roomID, ownerID);
        socket.to(roomID).emit("groupDeleted", { message: "Group deleted by admin!" });
      } catch (error) {
        console.log(error);
      }
    });

    //add member to memberlist of chat room
    socket.on("joinRoom", async (data) => {
      try {
        const { id, memberID } = data;
        roomID = id;
        console.log(memberID);
        socket.join(roomID);
        console.log(await roomService.addMember(roomID, memberID));
        socket.to(roomID).emit("userJoinedRoom", { memberID });
      } catch (error) {
        console.log(error);
      }
    });

    //remove member from chat room by Admin(owner)
    socket.on("removeMember", async (data) => {
      try {
        const { roomID, memberID, ownerID } = data;
        await roomService.removeMember(roomID, memberID);
        socket.to(roomID).emit("user removed by Admin", { memberID });
      } catch (error) {
        console.log(error);
      }
    });
    
    
  });
  
  server.listen(config.socketPort, () => {
    console.log(`Socket listening on ${config.socketPort}`);
  })
};
