import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {lastValueFrom, Observable, of} from "rxjs";
import {User} from "../objects/user";
import {GameHistory} from "../objects/game-history";

@Injectable({
    providedIn: 'root'
})
export class NetworkingService {

    constructor(private http: HttpClient) {
    }

    getTestUser(): Observable<User> {
        return of(new User(0, "jonaspfeifer@drei.at", "Jonas", "Pfeifer", "02c9cfda531c4464d1204547d744849c0642a0f622872c9504575a3ee51c9560", 27.99, "2022-01-01"))
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
