import { Router } from 'express';
import user from './routes/user';
import room from './routes/rooms';
import chat from './routes/chat';

// Main App
export default () => {
	const app = Router();
	user(app);
	room(app);
	chat(app);
	return app
}
