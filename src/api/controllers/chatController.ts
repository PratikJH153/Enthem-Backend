import { Request, Response, NextFunction } from 'express';
import RoomService from '../../services/room_service';
import { Container, Service } from 'typedi';
import debugError from '../../services/debug_error';
import {kProductionMode} from "../../constants/production_mode";

@Service()
export default class ChatController {
  roomService: RoomService;
  constructor() {
    this.roomService = Container.get(RoomService);
  }

};
