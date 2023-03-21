import { NextFunction, Request, Response, Router } from 'express';
import checkAuth from "../middleware/check_auth";
import Container from 'typedi';
import debugError from '../../services/debug_error';
import RoomController from '../controllers/roomController';

const route = Router();

export default (app: Router) => {
  app.use('/room', route);

  const roomController = Container.get(RoomController);

  //* GET CALLS
  route.get('/all', checkAuth, roomController.getAllRooms);


  //* POST CALLS
  route.post('/addroom',checkAuth,roomController.addRoom);

  //*DELETE CALLS
  route.delete('/deleteroom',checkAuth,roomController.deleteRoom);

  //*PUT CALLS
  route.put('/addMember',checkAuth,roomController.addMember);
  route.put('/removeMember',checkAuth,roomController.removeMember);
  
};
