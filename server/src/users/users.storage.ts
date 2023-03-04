import {User} from "./user";
import {sqlQuery} from "../db";

export class UsersStorage {
    async getUser(email: string, password: string): Promise<User> {
        let sql = `
            SELECT * FROM casino.users
            WHERE email = '${email}' AND password = '${password}';
        `

        return await sqlQuery<User>(sql)
            .catch(reason => {
                throw reason;
            });
    }

    async createUser(data: User): Promise<User|undefined> {
        let sql = `
            INSERT INTO casino.users ( email, password, first_name, last_name, username) 
            VALUES (N'${data.email}', N'${data.password}', N'${data.first_name}', N'${data.last_name}', N'${data.username}');
        `
        sql += `
            SELECT * FROM casino.users WHERE users_id = LAST_INSERT_ID();
        `

        let user: User|undefined;
        await sqlQuery<User>(sql, 1)
            .then(value => user = value)
            .catch(reason => {
                throw reason;
            })

        return user;
    }
}