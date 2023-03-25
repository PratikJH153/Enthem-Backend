import { Router } from 'express';
import checkAuth from "../middleware/check_auth";
import Container from 'typedi';
import RoomController from '../controllers/roomController';

const route = Router();

export default (app: Router) => {
  app.use('/room', route);

  const roomController = Container.get(RoomController);

  //* GET CALLS
  route.get('/all', checkAuth, roomController.getAllRooms);
  route.get('/', checkAuth, roomController.getRoom);

  //* POST CALLS
  route.post('/', checkAuth, roomController.addRoom);

  //*PUT CALLS
  route.put('/addmember', checkAuth, roomController.addMember);
  route.put('/removemember', checkAuth, roomController.removeMember);

  //*DELETE CALLS
  route.delete('/', checkAuth, roomController.deleteRoom);

};
