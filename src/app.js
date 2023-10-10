
//Primer opcion para requerir express (Modulo commonJS  - NodeJS)
//const express = require('express');
//Segunda opcion para requerir express (Modulo ES6 - NodeJS)
import express from 'express';

import empleadoRoutes from './routes/empleados.routes.js';
import indexRoutes from './routes/index.routes.js'

//Aqui creamos una constante que va a ser igual a express

const app = express();

//Antes de que llegue a la ruta vamos a utilizar un middleware para que el servidor
// pueda entender los datos que envia el cliente (json)
app.use(express.json());

//Aqui le decimos a express que vamos las rutas que estan en indexRoutes
app.use(indexRoutes)
//Aqui le decimos a express que vamos a usar empleadosRoutes que es el archivo
// que contiene las rutas
app.use('/api',empleadoRoutes)
//Aqui le decimos al usuario que la pagina no existe porque la ruta no existe
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Pagina no encontrada'
    })
})

export default app;