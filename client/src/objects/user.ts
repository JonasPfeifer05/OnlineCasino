export class User {
    users_id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    money: number;
    entry_date: string;
    deactivated: boolean;
    deactivated_since: string|null;


    constructor(users_id: number, email: string, first_name: string, last_name: string, username: string, money: number, entry_date: string, deactivated: boolean, deactivated_since: string|null) {
        this.users_id = users_id;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.money = money;
        this.entry_date = entry_date;
        this.deactivated = deactivated;
        this.deactivated_since = deactivated_since;
    }

    static default(): User {
        return new User(0, "N.A.", "N.A.", "N.A.", "N.A.", 0, "N.A.", false, "N.A.")
    }
}
