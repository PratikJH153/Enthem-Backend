import { Router} from 'express';
import checkAuth from "../middleware/check_auth";

const route = Router();
const roomController = require('../controllers/roomController');

export default (app: Router) => {
    app.use('/room', route);

    //* GET CALLS
    route.get('/all', checkAuth, roomController.getAllRooms);
    route.get('/', checkAuth, roomController.getAllRooms);

    //* POST CALLS
    route.post('', checkAuth, roomController.addRoom)
};
