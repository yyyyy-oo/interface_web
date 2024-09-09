const fs = require('fs');
const path = require('path');
const swaggerAutogen = require('swagger-autogen')({ language: 'ko' });

const doc = {
  info: {
    title: "INTERFACE 홈페이지",
    description: "백엔드 개발중",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";

const routesPath = path.resolve(__dirname, '../routes');
const endpointsFiles = fs.readdirSync(routesPath).map(file => `../routes/${file}`);

endpointsFiles.push('../app.js');

swaggerAutogen(outputFile, endpointsFiles, doc);
