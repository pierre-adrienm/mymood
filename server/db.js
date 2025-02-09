const {Pool} = require("pg");

const pool = new Pool({
    user: "mymood",
    host: "localhost",
    database: "mymood",
    password: ":Ok_hand:",
    port: 5432
});

module.exports = pool;