import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {lastValueFrom, Observable, of} from "rxjs";
import {User} from "../objects/user";
import {GameHistory} from "../objects/game-history";

@Injectable({
    providedIn: 'root'
})
export class NetworkingService {

    api: string = "http://localhost:7000/";

    constructor(private http: HttpClient) {
    }

    getAccessToken(): string {
        let access_token = sessionStorage.getItem("access_token");
        if (!access_token) access_token = "";

        return access_token;
    }

    getRefreshToken(): string {
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
        let observable = this.http.get<{ token: string }>(this.api + "users/refresh");
        let token: string | undefined;
        this.handle(await this.evaluate(observable), (result) => {
            token = result.token;
        }, "Refresh token invalid!");

        if (token) sessionStorage.setItem("access_token", token)

        return token !== undefined;
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
            console.log(error)
            console.log(errorMessage);
        }
    }
}
