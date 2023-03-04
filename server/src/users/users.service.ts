import {User} from "./user";
import {db} from "../db";

export class UsersService {
    async getUser(email: string, password: string): Promise<User | undefined> {
        let sql = `
            SELECT * FROM casino.users
            WHERE email = '${email}' AND password = '${password}';
        `

        let getUsers = new Promise((resolve, reject) => {
            db.query(sql, (err: any, result: any) => {
                if (err) return reject(err);

                return resolve(result);
            })
        })

        let user: User|undefined;
        await getUsers.then(value => {
            let users = value as User[];
            if (users.length !== 1) user = undefined;
            user = users[0] as User;
        }).catch(reason => {
            console.log(reason.message)
        });

        return user;
    }

    async createUser(data: User) {
        let sql = `
            INSERT INTO casino.users ( email, password, first_name, last_name, username) 
            VALUES (N'${data.email}', N'${data.password}', N'${data.first_name}', N'${data.last_name}', N'${data.username}');
        `

        let id: number = -1;
        let insertUser = new Promise((resolve, reject) => {
            db.query(sql, async (err: any, result: any) => {
                if (err) return reject(err);

                return resolve(result.insertId);
            })
        })

        await insertUser.then(value => id = value as number)
            .catch(reason => console.log(reason.message));

        sql = `
            SELECT * FROM casino.users
            WHERE users_id = '${id}';
        `

        let getUsers = new Promise((resolve, reject) => {
            db.query(sql, (err: any, result: any) => {
                if (err) return reject(err);

                return resolve(result);
            })
        })

        let user: User|undefined;
        await getUsers.then(value => {
            let users = value as User[];
            if (users.length !== 1) user = undefined;
            user = users[0] as User;
        }).catch(reason => {
            console.log(reason.message)
        });

        return user;
    }
}

