const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Blood Pressure Tracker API",
        description: "תיעוד API לתוכנת מעקב לחץ דם"
    },
    host: `localhost:${process.env.PORT || 3000}`,
    schemes: ["http"]
};

const swaggerOutputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(swaggerOutputFile, routes, doc).then(() => {
    console.log("✅ Swagger documentation generated successfully!");
});
