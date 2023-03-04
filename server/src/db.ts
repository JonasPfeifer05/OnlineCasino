import * as dotenv from "dotenv";

const mysql = require("mysql");

dotenv.config();
export const db = mysql.createConnection({
    host: process.env.SERVER_IP,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
})

db.connect((err: any) => {
    if (err) throw(err);

    console.log("MySQL connected!");
})

export async function sqlQuery<T>(sql: string, index = 0): Promise<T> {
    let promise = new Promise((resolve, reject) => {
        db.query(sql, async (err: any, result: any) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })

    let value: T[] = [];
    let error: Error | undefined;
    await promise
        .then(values => {
            value = values as T[]
        })
        .catch(reason => error = reason);


    if (error) throw error;

    return value[index];
}