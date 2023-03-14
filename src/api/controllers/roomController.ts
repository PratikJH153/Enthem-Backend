import { Router, Request, Response, NextFunction } from 'express';
import RoomService from '../../services/room_service';
import { models, Models } from 'mongoose';
import {Container} from 'typedi';
import debugError from '../../services/debug_error';

const roomService = Container.get(RoomService);

const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = roomService.getAllRoooms();
    return res.status(200).json({ status: 200, data: data });
  
  } catch (e) {
    debugError(e.toString());
    return next(e);
  }
};

const getRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = roomService.getRoom();
    return res.status(200).json({ status: 200, data: data });
  
  } catch (e) {
    debugError(e.toString());
    return next(e);
  }
};

const addRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = roomService.addRoom(req.body.title);
    return res.status(200).json({ status: 200, data: data });
  
  } catch (e) {
    debugError(e.toString());
    return next(e);
  }
};

module.exports = {
getAllRooms,
getRoom,
addRoom,
}; 