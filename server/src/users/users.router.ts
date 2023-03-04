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
            let data: User = req.body;

            if (!data.first_name || !data.last_name || !data.email || !data.password || !data.username) return res.status(400).json({reason: "Not enough data passed!"})

            let user = await this.service.createUser(data);

            if (!user) return res.status(400).json({reason: "Email already in use or data is invalid!"})

            res.status(200).json(user);
        })

        this.router.post("/get", async (req, res) => {
            let email = req.body.email;
            let password = req.body.password;
            let user = await this.service.getUser(email, password);

            if (!user) return res.status(400).json({reason: "Invalid user data!"})

            res.status(200).json(user);
        })
    }
}