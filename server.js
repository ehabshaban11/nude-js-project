require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

const userRouters = require('./routes/userRoutes');
const measurementRoutes = require('./routes/measurementRoutes');

app.use('/api/users', userRouters);
app.use('/api/measurements', measurementRoutes);

const db = require('./config/db');

db.query("SELECT 1", (err, result) => {
    if (err) {
        console.error(" Database connection failed:", err);
    } else {
        console.log(" Connected to MySQL database!");
    }
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
