import {User} from "./user";
import {singleSqlQuery} from "../db";

export class UsersStorage {
    async getUser(email: string, password: string): Promise<User> {
        let sql = `
            SELECT * FROM casino.users
            WHERE email = '${email}' AND password = '${password}';
        `

        return await singleSqlQuery<User>(sql)
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
        await singleSqlQuery<User>(sql, 1)
            .then(value => user = value)
            .catch(reason => {
                throw reason;
            })

        return user;
    }

    async changeUser(data: User, old: User) {
        let sql = "UPDATE casino.users SET "

        if (data.email) sql += "email='"+data.email+"',";
        if (data.password) sql += "password='"+data.password+"',";
        if (data.first_name) sql += "first_name='"+data.first_name+"',";
        if (data.last_name) sql += "last_name='"+data.last_name+"',";
        if (data.username) sql += "username='"+data.username+"',";
        sql = sql.substring(0, sql.length-1);
        sql += " WHERE users_id='"+old.users_id+"';";
        sql += "SELECT * FROM casino.users WHERE users_id = "+old.users_id+";"

        let user: User = await singleSqlQuery<User>(sql, 1)
            .catch(reason => {
                throw reason;
            })

        return user;
    }

    async setActive(email: string, active: boolean) {
        let sql = "UPDATE casino.users SET deactivated_since="+(active ? "null" : "(curdate())")+", deactivated="+!active+" WHERE email='"+email+"';";

        await singleSqlQuery(sql)
            .catch(reason => {
                throw reason;
            })
    }
}