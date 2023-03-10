import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {lastValueFrom, Observable, of} from "rxjs";
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

    async login(email: string, password: string): Promise<boolean> {
        let observable = this.http.post<{access_token: string, refresh_token: string}>(this.api+"users/login", {email, password});

        let loggedIn = false;
        this.handle(await this.evaluate(observable), result => {
            loggedIn = true;
            sessionStorage.setItem("access_token", result.access_token);
            sessionStorage.setItem("refresh_token", result.refresh_token);
        }, "Failed to log user in!");

        return loggedIn;
    }

    static cleatTokens() {
        sessionStorage.setItem("access_token", "");
        sessionStorage.setItem("refresh_token", "");
    }

    async signUp(username: string, first_name: string, last_name: string, email: string, password: string): Promise<boolean> {
        let observable = this.http.post<{access_token: string, refresh_token: string}>(this.api+"users/create", {username, first_name, last_name, email, password});

        let signedUp = false;
        await this.handle(await this.evaluate(observable), async result => {
                signedUp = true;
                await this.login(email, password)
            },
            "Failed to create user!");

        return signedUp;
    }
    async getUserData(): Promise<Observable<User>> {
        if (!await this.checkTokens()) throw new Error("Couldnt authorize User! Must log in again!");

        return this.http.post<User>(this.api+"users/get", {});
    }

    async getUserHistory(amount: number): Promise<Observable<GameHistory[]>> {
        if (!await this.checkTokens()) throw new Error("Couldnt authorize User! Must log in again!");

        return this.http.post<GameHistory[]>(this.api+"histories/get", {amount});
    }

    getTestUser(): Observable<User> {
        return of(new User(0, "jonaspfeifer@drei.at", "Jonas", "Pfeifer", "02c9cfda531c4464d1204547d744849c0642a0f622872c9504575a3ee51c9560", 27.99, "2022-01-01", false, null))
    }

    getTestLastNGames(n: number): Observable<GameHistory[]> {
        let histories = [];
        for (let i = 0; i < n; i++) {
            histories.push(GameHistory.getRandom())
        }

        return of(histories);
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
}
