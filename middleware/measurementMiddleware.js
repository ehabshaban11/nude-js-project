const db = require('../config/db');

async function AddMeasurement(req, res, next) {
    let { user_id, systolic, diastolic, pulse } = req.body;

    if (!user_id || !systolic || !diastolic || !pulse) {
        return res.status(400).json({ message: "חובה לספק מזהה משתמש, ערכים סיסטוליים ודיאסטוליים, ודופק" });
    }

    let Query = `INSERT INTO measurements (user_id, systolic, diastolic, pulse) VALUES (?, ?, ?, ?);`;
    const promisePool = db.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query, [user_id, systolic, diastolic, pulse]);
        req.insertId = rows.insertId;
        req.success = true;
    } catch (err) {
        req.success = false;
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
    next();
}

async function GetMeasurements(req, res, next) {
    let user_id = req.params.user_id;
    if (!user_id) {
        return res.status(400).json({ message: "חובה לספק מזהה משתמש" });
    }

    let Query = "SELECT * FROM measurements WHERE user_id = ? ORDER BY date DESC;";
    const promisePool = db.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query, [user_id]);
        req.success = true;
        req.measurements = rows;
    } catch (err) {
        req.success = false;
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
    next();
}

async function GetMeasurementHistory(req, res, next) {
  
    let { user_id, start_date, end_date } = req.query;

    if (!user_id || !start_date || !end_date) {
        return res.status(400).json({ message: "חובה לספק מזהה משתמש, תאריך התחלה ותאריך סיום" });
    }

    let Query = "SELECT * FROM measurements WHERE user_id = ? AND DATE(date) BETWEEN ? AND ? ORDER BY date DESC;";
    console.log("Running Query:", Query, [user_id, start_date, end_date]);

    const promisePool = db.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query, [user_id, start_date, end_date]);

        let totalSystolic = 0, totalDiastolic = 0, count = rows.length;
        rows.forEach(m => {
            totalSystolic += m.systolic;
            totalDiastolic += m.diastolic;
        });

        if (count === 0) {
            req.success = true;
            req.measurements = [];
            return next();
        }

        let avgSystolic = totalSystolic / count;
        let avgDiastolic = totalDiastolic / count;
        rows = rows.map(m => {
            m.is_abnormal = (m.systolic > avgSystolic * 1.2 || m.diastolic > avgDiastolic * 1.2);
            return m;
        });

        req.success = true;
        req.measurements = rows;
    } catch (err) {
        req.success = false;
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
    next();
}

async function GetMonthlySummary(req, res, next) {
    let { year, month } = req.params;

    if (!year || !month) {
        return res.status(400).json({ message: "חובה לספק שנה וחודש" });
    }

    let Query = `
        SELECT 
            user_id, 
            ROUND(AVG(systolic), 2) AS avg_systolic, 
            ROUND(AVG(diastolic), 2) AS avg_diastolic,
            SUM(CASE 
                WHEN systolic > (SELECT AVG(systolic) * 1.2 FROM measurements) 
                OR diastolic > (SELECT AVG(diastolic) * 1.2 FROM measurements) 
                THEN 1 
                ELSE 0 
            END) AS abnormal_count
        FROM measurements
        WHERE YEAR(date) = ? AND MONTH(date) = ?
        GROUP BY user_id
        ORDER BY user_id;
    `;

    console.log("Running Monthly Summary Query:", Query, [year, month]);

    const promisePool = db.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query, [year, month]);
        req.success = true;
        req.summary = rows;
    } catch (err) {
        req.success = false;
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
    next();
}

module.exports = { 
    AddMeasurement, 
    GetMeasurements, 
    GetMeasurementHistory, 
    GetMonthlySummary 
};


