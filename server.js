const db = require('./config/db');

db.query("SELECT 1", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log(" Connected to MySQL database!");
    }
});
