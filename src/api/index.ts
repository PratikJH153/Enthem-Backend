import { Router } from 'express';
import user from './routes/user';
import room from './routes/rooms';

export default () => {
	const app = Router();
	user(app);
	room(app)
	return app
}