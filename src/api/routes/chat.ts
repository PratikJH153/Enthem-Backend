import { Router } from 'express';
import checkAuth from "../middleware/check_auth";
import Container from 'typedi';
import ChatController from '../controllers/chatController';

const route = Router();

export default (app: Router) => {
  app.use('/chat', route);

  const chatController = Container.get(ChatController);

  //* GET CALLS
  route.get('/', checkAuth, chatController.getChats);
  route.get('/messages', checkAuth, chatController.getMessages);

  //* POST CALLS
  route.post('/', checkAuth, chatController.addChat);
  // route.post('/messages', checkAuth, chatController.addMessageRoom);
  // route.post('/message', checkAuth, chatController.addMessage);

  //*PUT CALLS
  route.put('/block', checkAuth, chatController.blockChat);
  route.put('/unblock', checkAuth, chatController.unblockChat);

  //*DELETE CALLS
  route.delete('/', checkAuth, chatController.deleteChat)

};
