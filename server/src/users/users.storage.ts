import {User} from "./user";
import {sqlQuery} from "../db";
const current_time = require( 'moment' );

export class UsersStorage {
    async getUserData(email: string, password: string): Promise<User> {
        let result = await sqlQuery<User[]>(`
            SELECT * FROM casino.users
            WHERE email = ? AND password = ?;
        `, [email, password]);

        return result[0];
    }

    async getAllUserData(): Promise<User[]> {
        let result = await sqlQuery<User[]>(`
            SELECT * FROM casino.users;
        `);

        return result;
    }

    async createNewUser(data: User): Promise<User|undefined> {
        let result: [unknown, User[]] = await sqlQuery<[unknown, User[]]>(`
            INSERT INTO casino.users ( email, password, first_name, last_name, username) 
            VALUES (?, ?, ?, ?, ?);
            SELECT * FROM casino.users WHERE users_id = LAST_INSERT_ID();
        `, [data.email, data.password, data.first_name, data.last_name, data.username]);

        console.log(result)

        return result[1][0];
    }

    async changeUserData(data: User): Promise<User> {
        let result: [unknown, User[]] = await sqlQuery<[unknown, User[]]>(`
            UPDATE casino.users
            SET email = ?, password = ?, first_name = ?, last_name = ?, username = ?
            WHERE users_id = ?;
            SELECT * FROM casino.users WHERE users_id = ?;
        `, [data.email, data.password, data.first_name, data.last_name, data.username, data.users_id, data.users_id]);

        return result[1][0];
    }

    async changeActive(email: string, active: boolean) {
        await sqlQuery(`
            UPDATE casino.users
            SET deactivated = ?, deactivated_since = ?
            WHERE email = ?;
        `, [!active, !active ? current_time().format("YYYY-MM-DD") : null, email]);
    }
}