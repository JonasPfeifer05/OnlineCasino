import {Router} from "express";
import {UsersService} from "./users.service";
import {User} from "./user";
import {UserToken} from "./user-token";

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

            let userData: UserToken = await this.service.authenticateJWT(req.headers.authorization, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message});

            let user: User = await this.service.getUser(userData as User).catch(reason => error = reason);
            res.status(200).json(user);
        })

        this.router.post("/change", async (req, res) => {
            let error: Error|undefined;

            let userData: UserToken = await this.service.authenticateJWT(req.headers.authorization, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message});

            let user: User = await this.service.changeUser(userData, req.body).catch(reason => error = reason);
            if (error) return res.status(400).json({message: (error as Error).message});

            res.status(200).json(user);
        });

        this.router.post("/deactivate", async (req, res) => {
            let error: Error | undefined;

            let userData: UserToken = await this.service.authenticateJWT(req.headers.authorization, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message});

            await this.service.changeActive(userData, false);

            res.status(200).json({message: "success"})
        });

        this.router.post("/activate", async (req, res) => {
            let error: Error | undefined;

            let userData: UserToken = await this.service.authenticateJWT(req.headers.authorization, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message});

            await this.service.changeActive(userData, true);

            res.status(200).json({message: "success"})
        });

        this.router.post("/login", async (req, res) => {
            let error: Error | undefined;

            let tokens = await this.service.login(req.body as UserToken).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message});
            let [access_token, refresh_token] = tokens;

            res.status(200).json({access_token, refresh_token});
        })

        this.router.post("/refresh", async (req, res) => {
            let error: Error | unknown;

            let token: string = await this.service.refreshToken(req.body.refresh_token).catch(reason => error = reason);
            if (error) return res.status(400).json({message: (error as Error).message});

            res.status(200).json({token: token});
        })

        this.router.get("/validate", async (req, res) => {
            let error: Error|undefined;

            await this.service.authenticateJWT(req.headers.authorization, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
            if (error) return res.status(400).json({valid: false});

            res.status(200).json({valid: true});
        })
    }
}