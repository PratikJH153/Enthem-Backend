import { NextFunction, Request, Response, Router} from 'express';
import checkAuth from "../middleware/check_auth";

import Container from 'typedi';
import debugError from '../../services/debug_error';
import RoomService from '../../services/room_service';

const route = Router();

export default (app: Router) => {
    app.use('/room', route);
    
    const roomService = Container.get(RoomService);

    //* GET CALLS
    route.get('/all', checkAuth, async (req: Request, res: Response, next: NextFunction)=>{
        try {
          const jsonData = await roomService.getAllRoooms();
          const data = jsonData["data"];
          return res.status(200).json({ status: 200, data: data });
        
        } catch (e) {
          debugError(e.toString());
          return next(e);
        }
      });
    // route.get('/', checkAuth, roomController.);

    //* POST CALLS
    route.post('/', checkAuth, async (req: Request, res: Response, next: NextFunction)=>{
      try {
        const jsonData = await roomService.addRoom(req.body.title);
        const data = jsonData["data"];
        return res.status(200).json({ status: 200, data: data });
      
      } catch (e) {
        debugError(e.toString());
        return next(e);
      }
    });
};
