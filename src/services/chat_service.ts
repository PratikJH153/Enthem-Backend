import { IChat } from 'src/interfaces/IChat';
import { Service, Inject } from 'typedi';

@Service()
export default class ChatService {

  constructor(
    @Inject('chatModel') private chat: Models.chatModel,
    @Inject('messageModel') private message: Models.messageModel,
  ) {
  }

  public async getChats(chatsId: Array<string>): Promise<any> {
    try {  
        const data = await this.chat.find({ _id: {$in: chatsId} });
        return {
            data: data
        }
    } catch (err) {
      throw new Error(err);
    }
  }
  
  public async getMessages(messagesID: string): Promise<any> {
    try {  
        const data = await this.message.findById(messagesID);
        return {
            data: data
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

  public async blockChat(chatID: string, userID: string): Promise<any> {
    try {
      const data: IChat = await this.chat.findByIdAndUpdate(chatID, {"isDisable": userID});
      if (!data) {
        throw new Error("Chat couldn't be blocked");
      }
      return { data: `Chat blocked successfully!` };
    } catch (err) {
      throw new Error(err);
    }
  }
  
  public async unblockChat(chatID: string, userID: string): Promise<any> {
    try {
      const data: IChat = await this.chat.findByIdAndUpdate(chatID, 
        {"isDisable": {$eq: userID}},
        {"isDisable": null},
      );
      if (!data) {
        throw new Error("Chat couldn't be unblocked");
      } else{

      }
      return { data: `Chat unblocked successfully!` };
    } catch (err) {
      throw new Error(err);
    }
  }
}