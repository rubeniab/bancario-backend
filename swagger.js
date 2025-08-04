const swaggerAutogen = require ('swagger-autogen')()

const doc = {
    info: {
        title: 'Backend NODE.js API',
        description: 'Esta es una API en node.js'
    },
    host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ['./index.js', './routes/banco.routes.js'];

swaggerAutogen(outputFile, routes, doc)