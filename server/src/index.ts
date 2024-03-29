/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import express, {Express} from "express";
import cors from "cors";
import helmet from "helmet";
import {UsersRouter} from "./users/users.router";
import {HistoriesRouter} from "./histories/histories.router";
const https = require("https");
const fs = require("fs");
const path = require("path");

dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);


class Application{
    private express:Express;

    constructor() {
        this.express = express();

        this.configureExpress();
    }

    private configureExpress(){
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(express.json());

        const loggerOptions: expressWinston.LoggerOptions = {
            transports: [new winston.transports.Console()],
            msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} response after {{res.responseTime}}ms",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
                winston.format.colorize({level: true}),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            ),
        };
        this.express.use(expressWinston.logger(loggerOptions));

        this.addRoutes();

        this.express.use((req:any, res:any, next:any) => {
            res.status(404);
            res.json({error:"route not found"});
        });
        this.express.use((err:any, req:any, res:any, next:any) => {
            console.error(err);
            res.status(500);
            res.json({error:"Internal Server Error"});
        });
    }

    private addRoutes(){
        this.express.use("/users", new UsersRouter().router);
        this.express.use("/histories", new HistoriesRouter().router);
    }

    public run(){
        const sslServer = https.createServer(
            {
                key: fs.readFileSync(path.join(__dirname, "..", "cert", "key.pem")),
                cert: fs.readFileSync(path.join(__dirname, "..", "cert", "cert.pem"))
            },
            this.express
        );

        sslServer.listen(PORT, () => console.log("SSL server started"))

    }
}

new Application().run();