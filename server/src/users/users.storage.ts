import {User} from "./user";
import {sqlQuery} from "../db";
const MOMENT= require( 'moment' );

export class UsersStorage {
    async getUser(email: string, password: string): Promise<User> {
        let result = await sqlQuery<User[]>(`
            SELECT * FROM casino.users
            WHERE email = ? AND password = ?;
        `, [email, password]);

        return result[0];
    }

    async createUser(data: User): Promise<User|undefined> {
        let result: User[][] = await sqlQuery<User[][]>(`
            INSERT INTO casino.users ( email, password, first_name, last_name, username) 
            VALUES (?, ?, ?, ?, ?);
            SELECT * FROM casino.users WHERE users_id = LAST_INSERT_ID();
        `, [data.email, data.password, data.first_name, data.last_name, data.username]);

        return result[1][0];
    }

    async changeUser(data: User): Promise<User> {
        let result = await sqlQuery<User[][]>(`
            UPDATE casino.users
            SET email = ?, password = ?, first_name = ?, last_name = ?, username = ?
            WHERE users_id = ?;
            SELECT * FROM casino.users WHERE users_id = ?;
        `, [data.email, data.password, data.first_name, data.last_name, data.username, data.users_id, data.users_id]);

        return result[1][0];
    }

    async setActive(email: string, active: boolean) {
        sqlQuery(`
            UPDATE casino.users
            SET deactivated = ?, deactivated_since = ?
            WHERE email = ?;
        `, [!active, !active ? MOMENT().format("YYYY-MM-DD"):null, email]);
    }
}