import {Injectable} from '@angular/core';
import {LoggingType} from "../objects/logging-type";

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    maxLevel: number = LoggingType.DEBUGGING;

    constructor() {
    }

    setMinLevel(level: number) {
        this.maxLevel = level;
    }

    log(message: any, type: LoggingType) {

        let color: string = "#fff";

        if (type > this.maxLevel) return;

        if (type === LoggingType.EMERGENCY) {
            color = "#9b1fa6";
        } else if (type === LoggingType.ALERT) {
            color = "#d63884";
        } else if (type === LoggingType.CRITICAL) {
            color = "#d64338";
        } else if (type === LoggingType.ERROR) {
            color = "#d66f38";
        } else if (type === LoggingType.WARNING) {
            color = "#d6a438";
        } else if (type === LoggingType.NOTIFICATION) {
            color = "#d5f56e";
        } else if (type === LoggingType.INFORMATIONAL) {
        } else if (type === LoggingType.DEBUGGING) {
            color = "#9ef56c";
        }

        console.log(`%c${message}`, `color: ${color};`);
    }

}
