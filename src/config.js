import {config} from 'dotenv';
//este archivo es para configurar las variables de entorno
config();
//aqui mostramos el puerto que esta en el archivo .env
//console.log(process.env.PORT);
//console.log(process.env.DB_HOST);
//console.log(process.env.DB_PORT);
//console.log(process.env.DB_USER);
//console.log(process.env.DB_PASSWORD);
//console.log(process.env.DB_DATABASE);

export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_DATABASE = process.env.DB_DATABASE || 'empresa';
