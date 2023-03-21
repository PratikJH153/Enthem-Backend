import mongoose, { Types } from "mongoose";
import { Router, Request, Response, NextFunction } from 'express';
import RoomService from '../../services/room_service';
import {Container, Service} from 'typedi';
import debugError from '../../services/debug_error';

@Service()
export default class RoomController{
  roomService: RoomService;
  constructor(){
    this.roomService = Container.get(RoomService);
  }

  
  public getAllRooms=async (req: Request, res: Response, next: NextFunction)=> {
      try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          const maxPages = parseInt(req.query.maxPages as string) || 10;
          const data = await this.roomService.getAllRooms(page, limit, maxPages);
          return res.status(200).json({ status: 200, data: data["data"] });
      } catch (e) {
          debugError(e.toString());
          return next(e);
      }
  };


  public addRoom = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const data=await this.roomService.addRoom(req.body.ownerID, req.body.latitude, req.body.longitude, req.body.title)
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, data: "Server Issue" });
    }
  };
  
  public deleteRoom = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const data=await this.roomService.deleteRoom(req.body.roomID)
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  public addMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.roomService.addMember(req.body.roomID, req.body.memberID);
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  public removeMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomID, ownerID, memberID } = req.body;
      const data = await this.roomService.removeMember(roomID, ownerID, memberID);
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  

  
};
