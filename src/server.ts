import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import colors from 'colors';
import swaggerUi from 'swagger-ui-express';
import router from './router';
import db from './config/db';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';

// Conectar a la  Base de Datos
export const connectDB = async () => {
    try {
        await db.authenticate();

        db.sync();

        // console.log(colors.bgMagenta.white.bold('Conexión exitosa a la BD'));
    } catch(error) {
        console.log(colors.bgRed.white.bold('Hubo un error al conectar a la BD:'));
        console.log(error);
    }
}

connectDB();

// Instancia de express
const server = express();

// Permitir conexiones
const corsOptions : CorsOptions = {
    
    origin: (origin, callback) => {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
} 

server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

server.use(morgan('dev'));

// Routing
server.use('/api/products', router);

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default server;