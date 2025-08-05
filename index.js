const express = require('express')
const cors = require("cors")
const dotenv = require ('dotenv')
const app = express()

//Primero carga la configuración del archivo .env para que este disponible en las demás llamadas
dotenv.config()

//Se requiere para entender los datos recibidos en JSON
app.use(express.json())
app.use(express.urlencoded ({ extended: false}))

//Se require si se accede desde un navegador web
var corsOptions = {
    origin: ["http://localhost:8080", "http://localhost:8081", "http://localhost:5173"],
    methods: "GET, PUT, POST, DELETE",
    exposedHeaders: ['Content-Disposition', 'Content-Type']
}

app.use(cors(corsOptions))

//Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use("/api/bancos", require('./routes/banco.routes'))

app.get('/*slat', (req, res) => {res.status(404).send("Recurso no encontrado")})

const errorHandler = require('./middleware/errorhandler.middleware')
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Aplicacion escuchando en el puerto ${PORT}`)
})