const mysql = require("mysql2");

const pool = mysql.createPool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
});

exports.db = pool;
