import { Router } from 'express';
import checkAuth from "../middleware/check_auth";
import Container from 'typedi';
import ChatController from '../controllers/chatController';

const route = Router();

export default (app: Router) => {
  app.use('/chat', route);

  const chatController = Container.get(ChatController);

  //* GET CALLS
//   route.get('/', checkAuth, chatController.getAllRooms);

  //* POST CALLS

  //*PUT CALLS

  //*DELETE CALLS

};
