export class GameHistory {
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

    static getRandom() {
        let won = Math.random() < 0.5;
        let wage = Math.round((2 + Math.random() * 5)*100)/100;
        return new GameHistory(
            0, 0, Math.floor(Math.random()*6), won, wage, won ? Math.round(wage * (1+Math.random()) * 100)/100 : 0
        );
    }

    static getDefault() {
        return new GameHistory(0,0,0,false,0,0);
    }
}
