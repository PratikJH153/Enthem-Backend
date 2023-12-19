import { Request, Response, NextFunction } from 'express';
import RoomService from '../../services/room_service';
import { Container, Service } from 'typedi';
import debugError from '../../services/debug_error';
import {kProductionMode} from "../../constants/production_mode";

@Service()
export default class RoomController {
  roomService: RoomService;
  constructor() {
    this.roomService = Container.get(RoomService);
  }


  public test = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ status: 200, data: "Rooms Routes Working!" });
  };


  public getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const miles = req.body.miles || 5;
      const coordinates = req.body.coordinates;
      const data = await this.roomService.getAllRooms(page, miles, coordinates);
      if (data){
        return res.status(200).json({ status: 200, data: data["data"] });
      } else{
        return res.status(404).json({ status: 200, data: [] });
      }
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: error.toString() });
    }
  };

  public getPopularRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const data = await this.roomService.getPopularRooms(page);
      if (data){
        return res.status(200).json({ status: 200, data: data["data"] });
      } else{
        return res.status(404).json({ status: 200, data: [] });
      }
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: error.toString() });
    }
  };


  public getRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.roomService.getRoom(req.body.id);
      if (data["data"]){
        return res.status(200).json({ status: 200, data: data["data"] });
      }
      return res.status(404).json({ status: 404, data: "Room not found!" });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: error.toString() });
    }
  };

  public getIntroduceRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.roomService.getIntroduceRoom();
      if (data["data"]){
        return res.status(200).json({ status: 200, data: data["data"] });
      }
      return res.status(404).json({ status: 404, data: "Room not found!" });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: error.toString()});
    }
  };

  public getRoomsByOwnerID = async (req: Request, res: Response, next:NextFunction) => {
    try{
      const data = await this.roomService.getRoomsByOwnerID(req.body.ownerID);
      if (data["data"]){
        return res.status(200).json({ status: 200, data: data["data"] });
      }
      return res.status(404).json({ status: 404, data: [] });
    } catch(err){
      debugError(err.toString());
      return res.status(500).json({ status: 500, data: kProductionMode?[]: err.toString() });
    }
  }

  public addRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateOps: Map<String, Object> = new Map<String, Object>;
      for (const [key, value] of Object.entries(req.body)) {
        if (key == "coordinates"){
          updateOps["location"] = {
            type: 'Point',
            coordinates: value
          }
        } else{
          updateOps[key] = value;
        }
      } 
      const data = await this.roomService.addRoom(updateOps)
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString() });
    }
  };

  public deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {roomID, ownerID} = req.body;
      const data = await this.roomService.deleteRoom(roomID, ownerID);
      return res.status(data["status"]).json({ status: data["status"], data: data["data"] });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString()});
    }
  };

  public addMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {roomID, memberID} = req.body;
      const data = await this.roomService.addMember(roomID, memberID);
      return res.status(data["status"]).json({ status: data["status"], data: data["data"] });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString() });
    }
  };

  public removeMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roomID, memberID } = req.body;
      const data = await this.roomService.removeMember(roomID, memberID);
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString() });
    }
  };

  public searchRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const title = req.body.title;
      if (!title) {
        return res.status(400).json({ status: 400, data: "Title query parameter is required" });
      }
      const data = await this.roomService.searchRoom(title);
      return res.status(200).json({ status: 200, data: data["data"] });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: "Server error" });
    }
  }; 

  public deleteManyRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.roomService.deleteManyRooms(req.body.createdAt);
      return res.status(data["status"]).json({ status: data["status"], data: data["data"] });
    } catch (error) {
      debugError(error.toString());
      return res.status(500).json({ status: 500, data: error.toString()});
    }
  };
};
