import {UsersService} from "../users/users.service";
import {UserToken} from "../users/user-token";
import {History} from "./history";
import {HistoriesStorage} from "./histories.storage";
import {User} from "../users/user";

export class HistoriesService {
    usersService: UsersService;
    historiesStorage: HistoriesStorage;

    constructor() {
        this.usersService = new UsersService();
        this.historiesStorage = new HistoriesStorage();
    }

    async getHistories(auth: string|undefined, amount: number|undefined): Promise<History[]> {
        if (!amount) throw new Error("Amount not specified!");

        let error: Error|undefined;

        let userData: UserToken = await this.usersService.authenticateJWT(auth, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
        if (error) throw error;
        let user: User = await this.usersService.getUser(userData as User).catch(reason => error = reason);

        let histories: History[] = await this.historiesStorage.getHistories(user.users_id, amount).catch(reason => error = reason);
        if (error) throw error;

        return histories;
    }

    async addHistory(auth: string | undefined, historyData: History): Promise<History> {
        let error: Error|undefined;

        if (!historyData.game_id === undefined || !historyData.won || !historyData.wage || !historyData.profit) throw new Error("Not enough data passed!");

        let userData: UserToken = await this.usersService.authenticateJWT(auth, process.env.JWT_AUTH_TOKEN).catch(reason => error = reason);
        if (error) throw error;
        let user: User = await this.usersService.getUser(userData as User).catch(reason => error = reason);

        let history: History = await this.historiesStorage.addHistory(user.users_id, historyData).catch(reason => error = reason);
        if (error) throw error;

        return history
    }
}