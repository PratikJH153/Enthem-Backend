import { Router} from 'express';
import checkAuth from "../middleware/check_auth";

const route = Router();
const userController = require('../controllers/userController');

export default (app: Router) => {
    app.use('/user', route);

    //* GET CALLS
    route.get('/all', checkAuth, userController.getAllUsers);
    route.get('/', checkAuth, userController.getUserBySessionId);
    route.get('/exists', checkAuth, userController.isUserExists);
    route.get('/usernameexists', checkAuth, userController.isUsernameExists);
    route.get('/recommend', checkAuth, userController.recommendUser);
    route.get('/locRecommend',checkAuth,userController.locRecommend);

    //* POST CALLS
    route.post('/', checkAuth, userController.createUser);
    route.post('/createSkills', checkAuth, userController.createSkills);
    route.post('/createInterests', checkAuth, userController.createInterests);

    //* PUT CALLS
    route.put('/', checkAuth, userController.updateUser);

    //* DELETE CALLS
    route.delete('/', checkAuth, userController.deleteUser);
};
