
const express = require('express');
const router = express.Router();
const MeasurementMiddleware = require('../middleware/measurementMiddleware');

router.post('/', [MeasurementMiddleware.AddMeasurement], (req, res) => {
    if (req.success) {
        res.status(200).json({ msg: "ok", Last_Id: req.insertId });
    } else {
        res.status(500).json({ message: "Error adding measurement" });
    }
});

router.get('/history', [MeasurementMiddleware.GetMeasurementHistory], (req, res) => {  
    if (req.success) {
        res.status(200).json({ msg: "ok", data: req.measurements });
    } else {
        res.status(500).json({ message: "Error retrieving measurement history" });
    }
});

router.get('/:user_id', [MeasurementMiddleware.GetMeasurements], (req, res) => {  
    if (req.success) {
        res.status(200).json({ msg: "ok", data: req.measurements });
    } else {
        res.status(500).json({ message: "Error retrieving measurements" });
    }
});


module.exports = router;
