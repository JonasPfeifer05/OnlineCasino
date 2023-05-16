import {History} from "./history";
import {sqlQuery} from "../db";

export class HistoriesStorage {

    async getHistories(users_id: number, amount: number): Promise<History[]> {
        let sql = `
            SELECT * FROM casino.game_history WHERE users_id = ${users_id} ORDER BY history_id DESC LIMIT ${amount};
        `

        let histories = await sqlQuery<History[]>(sql);

        if (!histories) throw new Error("Couldnt get histories!");

        return histories;
    }

    async addHistory(users_id: number, historyData: History): Promise<History> {
        let sql = `
            INSERT INTO casino.game_history (users_id, game_id, won, wager, profit)
            VALUES (${users_id}, ${historyData.game_id}, ${historyData.won}, ${historyData.wage}, ${historyData.profit});
        `
        sql += `
            SELECT * FROM casino.game_history WHERE history_id = LAST_INSERT_ID();
        `

        let history: History = await sqlQuery<History>(sql);

        if (!history) throw new Error("Couldnt create History")

        return history;
    }
}