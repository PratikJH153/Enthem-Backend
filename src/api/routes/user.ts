import { NextFunction, Request, Response, Router} from 'express';
import checkAuth from "../middleware/check_auth";
import debugError from '../../services/debug_error';
import config from '../../config/index';
import { auth } from 'neo4j-driver-core';
import { Driver, driver } from 'neo4j-driver';
import UserController from '../controllers/userController';
import Container from 'typedi';

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
    route.get('/recommend', checkAuth, userController.recommendUser);
    route.get('/locRecommend',checkAuth, userController.locRecommend);
    route.get('/compatibleUsers',checkAuth, userController.compatibleUsers);
    route.get('/interests',checkAuth, userController.interestsUser);
    route.get('/custom_fetch',checkAuth,userController.custom_fetch);

    //* POST CALLS
    route.post('/', checkAuth, userController.createUser);
    // route.post('/createSkills', checkAuth, userController.createSkills);
    route.post('/createInterests', checkAuth, userController.createInterests);

    //* PUT CALLS
    route.put('/', checkAuth, userController.updateUser);
    route.put('/updateInterests',checkAuth,userController.updateInterests);

    //* DELETE CALLS
    route.delete('/', checkAuth, userController.deleteUser);
};