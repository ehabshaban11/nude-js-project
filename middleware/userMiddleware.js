
const db = require('../config/db');

async function AddUser(req, res, next) {
    let name = req.body.name;
    
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "שם המשתמש חובה" });
    }

    let Query = "INSERT INTO `users` (`name`) VALUES (?);";
    const promisePool = db.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query, [name]);
        req.insertId = rows.insertId;
        req.success = true;
    } catch (err) {
        req.success = false;
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
    next();
}


async function GetUsers(req, res, next) {
    let Query = "SELECT * FROM users;";
    const promisePool = db.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query);
        req.success = true;
        req.users = rows;
    } catch (err) {
        req.success = false;
        console.log(err);
    }
    next();
}

module.exports = { AddUser, GetUsers };
