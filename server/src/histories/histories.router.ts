import {Router} from "express";
import {HistoriesService} from "./histories.service";
import {History} from "./history";

export class HistoriesRouter {
    router: Router;
    historiesService: HistoriesService;

    constructor() {
        this.router = Router();
        this.historiesService = new HistoriesService();

        this.router.post("/get", async (req, res) => {
            let error: Error | undefined;

            let histories: History[] = await this.historiesService.getHistories(req.headers.authorization, req.body.amount).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message})

            res.status(200).json(histories);
        })

        this.router.post("/add", async (req, res) => {
            let error: Error|undefined;

            let history: History = await this.historiesService.addHistory(req.headers.authorization, req.body).catch(reason => error = reason);
            if (error) return res.status(400).json({message: error.message});

            res.status(200).json(history);
        })
    }
}