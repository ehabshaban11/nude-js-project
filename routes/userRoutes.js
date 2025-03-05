
const express = require('express');
const router = express.Router();
const UserMiddleware = require('../middleware/userMiddleware');

router.post('/', [UserMiddleware.AddUser], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", Last_Id: req.insertId });
    } else {
        res.status(500).json({ message: "Error adding user" });
    }
});

router.get('/', [UserMiddleware.GetUsers], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", data: req.users });
    } else {
        res.status(500).json({ message: "Error retrieving users" });
    }
});

module.exports = router;
