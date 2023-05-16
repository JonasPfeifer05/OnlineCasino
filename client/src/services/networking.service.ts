import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {User} from "../objects/user";
import {GameHistory} from "../objects/game-history";
import {LoggerService} from "./logger.service";
import {LoggingType} from "../objects/logging-type";

@Injectable({
    providedIn: 'root'
})
export class NetworkingService {

    api: string = "http://localhost:7000/";

    constructor(private http: HttpClient, private logger: LoggerService) {}

    static getAccessToken(): string {
        let access_token = sessionStorage.getItem("access_token");
        if (!access_token) access_token = "";

        return access_token;
    }

    static getRefreshToken(): string {
        let refresh_token = sessionStorage.getItem("refresh_token");
        if (!refresh_token) refresh_token = "";

        return refresh_token;
    }

    async validateAccessToken(): Promise<boolean> {
        let observable = this.http.get<{ valid: boolean }>(this.api + "users/validate");
        let authorized = false;

        this.handle(await this.evaluate(observable), (result) => {
            authorized = result.valid;
        }, "AccessToken invalid!");

        return authorized;
    }

    async refreshToken(): Promise<boolean> {
        let observable = this.http.post<{ token: string }>(this.api + "users/refresh", {refresh_token: NetworkingService.getRefreshToken()});
        let token: string | undefined;
        this.handle(await this.evaluate(observable), (result) => {
            token = result.token;
        }, "Refresh token invalid!");

        if (token) sessionStorage.setItem("access_token", token)

        return token !== undefined;
    }

    async checkTokens(): Promise<boolean> {
        let valid = await this.validateAccessToken();
        if (!valid) valid = await this.refreshToken();
        return valid;
    }

    async login(email: string, password: string): Promise<[boolean, string]> {
        let observable = this.http.post<{access_token: string, refresh_token: string}>(this.api+"users/login", {email, password});

        let loggedIn = false;
        let result = await this.evaluate(observable);
        this.handle(result, result => {
            loggedIn = true;
            sessionStorage.setItem("access_token", result.access_token);
            sessionStorage.setItem("refresh_token", result.refresh_token);
        }, "Failed to log user in!");

        let error = result[1]?.error["message"];

        return [loggedIn, error];
    }

    static cleatTokens() {
        sessionStorage.setItem("access_token", "");
        sessionStorage.setItem("refresh_token", "");
    }

    async signUp(username: string, first_name: string, last_name: string, email: string, password: string): Promise<[boolean, string]> {
        let observable = this.http.post<User>(this.api+"users/", {username, first_name, last_name, email, password});

        let signedUp = false;
        let result = await this.evaluate(observable);
        await this.handle(result, () => {
                signedUp = true;

            },
            "Failed to create user!");

        let error = result[1]?.error["message"];

        return [signedUp, error];
    }
    async getUserData(): Promise<Observable<User>> {
        if (!await this.checkTokens()) throw new Error("Couldnt authorize User! Must log in again!");

        return this.http.get<User>(this.api+"users/", {});
    }

    async getUserHistory(amount: number): Promise<Observable<GameHistory[]>> {
        if (!await this.checkTokens()) throw new Error("Couldnt authorize User! Must log in again!");

        return this.http.post<GameHistory[]>(this.api+"histories/", {amount});
    }

    async evaluate<T>(observable: Observable<T>): Promise<[T | undefined, HttpErrorResponse | undefined]> {
        let result;
        let error;

        await lastValueFrom(observable)
            .then(requestResult => {
                result = requestResult as T
            })
            .catch(requestError => {
                error = requestError
            });

        return [result, error];
    }

    handle<T>(data: [T | undefined, HttpErrorResponse | undefined], success: (result: T) => any, errorMessage: string) {
        let [result, error] = data;
        if (result) {
            success(result);
        } else {
            this.logger.log(error, LoggingType.ERROR);
            this.logger.log(errorMessage, LoggingType.ERROR);
        }
    }

    async change(username: string, first_name: string, last_name: string, email: string): Promise<boolean>{
        let observable = this.http.post<{access_token: string, refresh_token: string}>(this.api+"users/change", {username, first_name, last_name, email});

        let changed = false;
        await this.handle(await this.evaluate(observable), async result => {
                changed = true;
            },
            "Failed to change user!");

        return changed;
    }
}
