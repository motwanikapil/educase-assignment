const mysql = require("mysql");

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to mysql as id ", db.threadId);
});

module.exports = { db };
