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

  public async getAllRooms(req: Request, res: Response, next: NextFunction){
    try {
      const data = await this.roomService.getAllRoooms();
      return res.status(200).json({ status: 200, data: data });
    
    } catch (e) {
      debugError(e.toString());
      return next(e);
    }
  }
};