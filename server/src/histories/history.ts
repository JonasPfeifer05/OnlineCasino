export class History {
    history_id: number;
    users_id: number;
    game_id: number;
    won: boolean;
    wage: number;
    profit: number;

    constructor(history_id: number, users_id: number, game_id: number, won: boolean, wage: number, profit: number) {
        this.history_id = history_id;
        this.users_id = users_id;
        this.game_id = game_id;
        this.won = won;
        this.wage = wage;
        this.profit = profit;
    }
}