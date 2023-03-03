/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import express, {Express} from "express";
import cors from "cors";
import helmet from "helmet";

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
        /** Add new Main-Routes here (i.e. 'api/blog', 'api/student', 'ws/message', ...) */

    }

    public run(){

        /** change port in .env-file, not here! */

        this.express.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    }
}

new Application().run();