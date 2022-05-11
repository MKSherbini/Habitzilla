const doc = {
    info: {
        title: 'My API',
        description: 'Description',
    },
    host: 'localhost:6969',
    schemes: ['http'],
};

const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./routes/index.js']

swaggerAutogen(outputFile, endpointsFiles, doc)