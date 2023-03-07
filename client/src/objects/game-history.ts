export class GameHistory {
    history_id: number;
    users_id: number;
    game_id: number;
    won: boolean;
    wager: number;
    profit: number;


    constructor(history_id: number, users_id: number, game_id: number, won: boolean, wager: number, profit: number) {
        this.history_id = history_id;
        this.users_id = users_id;
        this.game_id = game_id;
        this.won = won;
        this.wager = wager;
        this.profit = profit;
    }

    static getRandom() {
        let won = Math.random() < 0.5;
        let wager = Math.round((2 + Math.random() * 5)*100)/100;
        return new GameHistory(
            0, 0, Math.floor(Math.random()*6), won, wager, won ? Math.round(wager * (1+Math.random()) * 100)/100 : 0
        );
    }

    static getDefault() {
        return new GameHistory(0,0,0,false,0,0);
    }
}
