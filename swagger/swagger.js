const swaggerAutogen = require('swagger-autogen')({ language: 'en' });

const doc = {
  info: {
    title: "INTERFACE 홈페이지",
    description: "백엔드 개발중",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [ "../app.js" ];

swaggerAutogen(outputFile, endpointsFiles, doc);