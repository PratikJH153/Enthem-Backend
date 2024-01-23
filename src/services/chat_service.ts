import { IChat } from 'src/interfaces/IChat';
import { IMessage } from 'src/interfaces/IMessage';
import { IMessageList } from 'src/interfaces/IMessageList';
import { Service, Inject } from 'typedi';

@Service()
export default class ChatService {

  constructor(
    @Inject('chatModel') private chat: Models.chatModel,
    @Inject('messageListModel') private messageList: Models.messageListModel,
    @Inject('messageModel') private message: Models.messageModel,
  ) {
  }

  public async getChats(userID: Array<string>): Promise<any> {
    try {  
      const data = await this.chat.find({
        $or: [
          { user1ID: { $eq: userID } },
          { user2ID: { $eq: userID } }
        ]
      },
      { 
        _id: 1,
        user1ID: 1,
        user2ID: 1,
        isDisabled: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1
      });
        return {
            data: data
        }
    } catch (err) {
      throw new Error(err);
    }
  }
  
  public async getMessages(chatID: string): Promise<any> {
    try {  
        const data = await this.chat.findById(chatID, {
          _id: 1,
          messages: 1
        });
        console.log(data);
        return {
            data: data["messages"]
        }
    } catch (err) {
      throw new Error(err);
    }
  }
  
  
  public async addChat(chatData: Map<String, Object>): Promise<any> {
    try {
      const data: IChat = await this.chat.create(chatData);
      if (!data) {
        throw new Error("Could not create chat!");
      }
      return { data: `Chat created successfully!` };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async addMessage(chatData: IMessage): Promise<any> {
    try {
      const message: IMessage = chatData;
      const data = await this.chat.findByIdAndUpdate(
      chatData["roomID"],
      { $push: { messages: message } }
      );
      if (!data) {
        throw new Error("Could not create chat!");
      }
      return { data: `Chat created successfully!` };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async addMessageList(): Promise<any> {
    try {
      const data = await this.messageList.create({messages: []});
      if (!data) {
        throw new Error("Could not create message List!");
      }
      return { data: data["_id"] };
    } catch (err) {
      throw new Error(err);
    }
  }

  // public async blockChat(chatID: string, userID: string): Promise<any> {
  //   try {
  //     const data: IChat = await this.chat.findByIdAndUpdate(chatID, {"isDisable": userID});
  //     if (!data) {
  //       throw new Error("Chat couldn't be blocked");
  //     }
  //     return { data: `Chat blocked successfully!` };
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }
  
  // public async unblockChat(chatID: string, userID: string): Promise<any> {
  //   try {
  //     const data: IChat = await this.chat.findByIdAndUpdate(chatID, 
  //       {"isDisable": {$eq: userID}},
  //       {"isDisable": null},
  //     );
  //     if (!data) {
  //       throw new Error("Chat couldn't be unblocked");
  //     } else{

  //     }
  //     return { data: `Chat unblocked successfully!` };
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }
}