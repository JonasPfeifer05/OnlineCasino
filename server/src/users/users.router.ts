import {Router} from "express";
import {UsersService} from "./users.service";
import {User} from "./user";

export class UsersRouter {
    router: Router
    service: UsersService

    constructor() {
        this.router = Router();
        this.service = new UsersService();

        this.router.post("/create", async (req, res) => {
            let error: Error|undefined;
            let user: User = await this.service.createUser(req.body).catch(reason => error = reason);

            if (error) return res.status(400).json({message: error.message});

            res.status(200).json(user);
        })

        this.router.post("/get", async (req, res) => {
            let error: Error|undefined;
            let user: User = await this.service.getUser(req.body).catch(reason => error = reason);

            if (error) return res.status(400).json({message: error.message});

            res.status(200).json(user);
        })
    }
}