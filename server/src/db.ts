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

export async function sqlQuery<T>(sql: string, args: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err: any, res: any) => {
            if (err) reject(err)
            else resolve(res)
        })
    })
}