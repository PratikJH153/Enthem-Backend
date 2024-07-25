import {Router} from 'express';
import checkAuth from "../middleware/check_auth";
import config from '../../config/index';
import { auth } from 'neo4j-driver-core';
import { Driver, driver } from 'neo4j-driver';
import UserController from '../controllers/userController';

const route = Router();

export default (app: Router) => {
    app.use('/user', route);

    const db: Driver = driver(config.databaseURL, auth.basic(config.dbUser, config.dbPass),
      {/* encrypted: 'ENCRYPTION_OFF' */ },);
    const userController = new UserController(db);
    
    //* GET CALLS
    route.get('/test', checkAuth, userController.test);
    route.get('/all', checkAuth, userController.getAllUsers);
    route.get('/', checkAuth, userController.getUserBySessionId);
    route.get('/exists', checkAuth, userController.isUserExists);
    route.get('/usernameexists', checkAuth, userController.isUsernameExists);
    // route.get('/nearby', checkAuth, userController.nearBy);
    // route.get('/foryou',checkAuth, userController.forYou);
    route.get('/interests',checkAuth, userController.interestsUser);
    // route.get('/custom_fetch',checkAuth,userController.custom_fetch);
    route.get('/getUserByIds',checkAuth,userController.getUsersByIds);
    // route.get('/likes',checkAuth,userController.get_userLikes);
    // route.get('/get_likedIds',checkAuth,userController.get_likedIds);

    //* POST CALLS
    route.post('/', userController.createUser);
    route.post('/interests', checkAuth, userController.createInterests);
    route.post('/addRoom',checkAuth,userController.updateRoomsList_add);
    // route.post('/likes',checkAuth,userController.post_userLike);

    //* PUT CALLS
    route.put('/', checkAuth, userController.updateUser);
    route.put('/interests',checkAuth,userController.updateInterests);

    //* DELETE CALLS
    route.delete('/', checkAuth, userController.deleteUser);
    route.delete('/deleteRoom', checkAuth, userController.deleteRooms);
    // route.delete('/delete_userLike',checkAuth,userController.delete_userLike);
    route.delete('/interests', checkAuth, userController.deleteInterests);
};