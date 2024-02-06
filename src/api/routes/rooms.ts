import { Router } from 'express';
import checkAuth from "../middleware/check_auth";
import Container from 'typedi';
import RoomController from '../controllers/roomController';
import TestRoomController from '../controllers/testRoomController';
import { Driver, auth, driver } from 'neo4j-driver';
import config from '../../config';

const route = Router();

export default (app: Router) => {
  app.use('/room', route);

  const roomController = Container.get(RoomController);

  const db: Driver = driver(config.testDBUrl, auth.basic(config.dbUser, config.testDBPass),
  {/* encrypted: 'ENCRYPTION_OFF' */ },);

  const testRoomController: TestRoomController = new TestRoomController(db);

  //* GET CALLS
  route.get('/test', checkAuth, roomController.test);
  route.get('/all', checkAuth, roomController.getAllRooms);
  route.get('/testrecommend', checkAuth, testRoomController.testGetAllRooms);
  route.get('/popular', checkAuth, roomController.getPopularRooms);
  route.get('/', checkAuth, roomController.getRoom);
  route.get('/owner', checkAuth, roomController.getRoomsByOwnerID);
  route.get('/search',checkAuth,roomController.searchRoom);
  route.get('/introduce',checkAuth,roomController.getIntroduceRoom);

  //* POST CALLS
  route.post('/', checkAuth, roomController.addRoom);

  //*PUT CALLS
  route.put('/addmember', checkAuth, roomController.addMember);
  route.put('/removemember', checkAuth, roomController.removeMember);

  //*DELETE CALLS
  route.delete('/', checkAuth, roomController.deleteRoom);
  route.delete('/many', checkAuth, roomController.deleteManyRooms);

};
