import { Router, Request, Response, NextFunction } from 'express';
import RoomService from '../../services/room_service';
import { models, Models } from 'mongoose';
import Container from 'typedi';
import debugError from '../../services/debug_error';

// const roomService = Container.get(RoomService);
const roomModel = models.roomModel;

const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = roomModel.find();
    return res.status(200).json({ status: 200, data: data });
  
  } catch (e) {
    debugError(e.toString());
    return next(e);
  }
};

module.exports = {
getAllRooms,
}; 