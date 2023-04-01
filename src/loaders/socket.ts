import { createServer } from "http";
import { Server } from "socket.io";
import { Container } from "typedi";
import SocketService from "../services/socket_service";
import config from "../config";
import RoomService from "../services/room_service";
import { encrypt,decrypt } from "../services/encrypt";


export default (app) => {
  const server = createServer(app);
  const io = new Server(server);
  const socketService = Container.get(SocketService);
  const roomService = Container.get(RoomService);
  io.on("connection", (socket) => {
    console.log("Backend Connected");
    var roomID: string;
    var memberID:string;

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

    //encryption and decryption in messages
    socket.on("sendMsg", (msg) => {
      console.log("Message received!", msg);
      const receiverChatID = encrypt(msg.receiverChatID, config.secretKEY);
      const senderChatID = encrypt(msg.senderChatID, config.secretKEY);
      const content = encrypt(msg.content, config.secretKEY); // Encrypt the message content using the secret key
      const encryptedMsg = {
        content: content,
        senderChatID: senderChatID,
        receiverChatID: receiverChatID,
      };
      socket.broadcast.in(receiverChatID).emit("sendMsgServer", encryptedMsg);
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
    socket.on('disconnect', async () => {
      console.log("User removed");
      try {
        const data = await roomService.removeMember(roomID, socket.id);
        socket.to(roomID).emit("user removed", { memberID: socket.id });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("removeMember", async (data) => {
      try {
        const { roomID, memberID} = data;
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
