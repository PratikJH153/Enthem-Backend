import { Container, Service } from 'typedi';
import ChatService from '../../services/chat_service';
import { NextFunction, Request, Response } from 'express';
import debugError from '../../services/debug_error';
import { kProductionMode } from '../../constants/production_mode';
import { IMessage } from 'src/interfaces/IMessage';

//! This is needed for the MVP 

@Service()
export default class ChatController {
  chatService: ChatService;
  constructor() {
    this.chatService = Container.get(ChatService);
  } 

  public getChats = async (req: Request, res: Response, next:NextFunction) => {
    try{
      const data = await this.chatService.getChats(req.body.userID);
      if (data["data"]){
        return res.status(200).json({ status: 200, data: data["data"] });
      }
      return res.status(404).json({ status: 404, data: [] });
    } catch(err){
      debugError(err.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: err.toString() });
    }
  }

  public getMessages = async (req: Request, res: Response, next:NextFunction) => {
    try{
      const data = await this.chatService.getMessages(req.body.chatID);
      if (data["data"]){
        return res.status(200).json({ status: 200, data: data["data"] });
      }
      return res.status(404).json({ status: 404, data: [] });
    } catch(err){
      debugError(err.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: err.toString() });
    }
  }

  public addChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateOps: Map<String, Object> = new Map<String, Object>;
      for (const [key, value] of Object.entries(req.body)) {
          updateOps[key] = value;
      } 

      const data = await this.chatService.addChat(updateOps);
      return res.status(200).json({ status: 200, data: data.data });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString() });
    }
  };

  public addMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {      
      const {roomID, message, senderID} = req.body;
      const mes: IMessage = {
        "roomID":roomID,
        "message": message,
        "senderID": senderID,
        "timestamp": new Date(),
      };
  
      const data = await this.chatService.addMessage(mes);
      return res.status(200).json({ status: 200, data: data.data });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString() });
    }
  };

  public deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString()});
    }
  };

  // public blockChat = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const {chatID, userID} = req.body;
  //     const data = await this.chatService.blockChat(chatID, userID);
  //     return res.status(data["status"]).json({ status: data["status"], data: data["data"] });
  //   } catch (error) {
  //     debugError(error.toString());
  //     return res.status(500).json({ status: 500, data: error.toString() });
  //   }
  // };

  // public unblockChat = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const {chatID, userID} = req.body;
  //     const data = await this.chatService.unblockChat(chatID, userID);
  //     return res.status(data["status"]).json({ status: data["status"], data: data["data"] });
  //   } catch (error) {
  //     debugError(error.toString());
  //     return res.status(500).json({ status: 500, data: error.toString() });
  //   }
  // };
};
