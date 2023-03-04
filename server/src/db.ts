import * as dotenv from "dotenv";
const mysql = require("mysql");

dotenv.config();
export const db = mysql.createConnection({
    host: process.env.SERVER_IP,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

db.connect((err: any) => {
    if (err) throw(err);

    console.log("MySQL connected!");
})