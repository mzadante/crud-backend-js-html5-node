Inicio del proyecto:
-Creo carpeta del proyecto
-Abrir terminal
-npm init -y (Inicializamos el proyecto con node creando dependencias)(package.json)
-npm i express (instalamos node express)
-creamos index.js (y colocamos un hola mundo)
-En terminal lo ejecutamos con node index.js
-Requerir express (Modulo ES6 - NodeJS) con: import express from 'express';
//Primer opcion para requerir express (Modulo commonJS  - NodeJS) -> const express = require('express');
-En package.json: cramos propiedad "type": "module",(con se podra importar y exportar modulos)
-Creamos el servidor localhost:3000 ->const app = express(); app.listen(3000);
-Instalamos nodemon para que el server se ejecute en loop (npm i nodemon -D)
-Colocamos el script "dev":"nodemon index.js"
-En consola ya podemos ejecutar nodemon con -> npm run dev
-para testearlo podriamos crear un console log en index.js y este refrescara automaticamente en la consola y eso significa que esta todo ok
Rutas EndPoints (rest-Api)
-//Creando rest api con los metodos get, post, put y delete
-- app.get('/empleado', (req, res) => res.send('Obteniendo empleado'));
-- app.post('/empleado', (req, res) => res.send('Creando empleado'));
-- app.put('/empleado', (req, res) => res.send('Actualizando empleado'));
-- app.delete('/empleado', (req, res) => res.send('Eliminando empleado'));
Conexion a la Database (Mysql)
-Creamos carpeta db y dentro database.sql
-Dentro de database.sql codeamos:
    CREATE DATABASE IF NOT EXISTS `empresa` /*!40100 DEFAULT CHARACTER SET utf8 */;
    USE `empresa`;
    CREATE TABLE empleado (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) DEFAULT NULL,
    `salario` VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (`id`)
    );
-Conectando con node utilizando npm mysql2 ->  npm install --save mysql2  
-Creamos archivo de conexion db.js:
            --  //importamos el paquete mysql2
                import { createPool } from "mysql2/promise";
                //creamos la conexion a la base de datos con un pool de conexiones
                export const pool = cratePool({
                    host: 'localhost',
                    user: 'root',
                    password: 'admin',
                    port: 3306,
                    database: 'empresa',
                });
-Exportamos en db.js el pool que creamos para que pueda ser utilizado en index.js que es donde tenemos nuestra rest api 
-//importamos la base de datos -> import {pool} from './db.js';
-Creamos nuestras consultas en index.js :
--  //Creando consulta a la base de datos
        app.get('/ping', async (req, res) => {
            const [resultado] = await pool.query('SELECT 1+1 AS result');
            res.json(resultado[0]);
        });
RUTAS - (dividir la app en multiples partes)
-Utilizaremos un modulo de express que se lla router para crear varias rutas
-Creamos una carpeta routes
-Creamos carpeta src y dentro de ella colocaremos la carpeta router, dentro de src colocaremos db.js y index.js - de esta forma nuestro codigo de la app quedara independiente
-en package json en script modificaremos la ruta para el funcionamiento de nodemon colocando la siguiente: 
                        "dev": "nodemon src/index.js"
-Volvemos a la consola y ejecutamos con npm run dev       
-Dentro de la carpeta routes creamos un archivo de ruta: empleados.routes.js y dentro de el importamos {Router}: import {Router} from 'express'; Que seria un enrutador
-Creamos el enrutador asi:
-- const router = Router()
export default router;
-Ahora en index.js quitaremos todas las consultas y las pegaremos en empleados.routes.js y lo pegaremos antes del default export
-Ahora cambiaremos app por router dejando el codigo de esta forma:
        router.get('/empleado', (req, res) => res.send('Obteniendo empleado'));
        router.post('/empleado', (req, res) => res.send('Creando empleado'));
        router.put('/empleado', (req, res) => res.send('Actualizando empleado'));
        router.delete('/empleado', (req, res) => res.send('Eliminando empleado'));
-Ahora en index.js importaremos desde la carpeta routes, el archivo empleados.routes.js
        import empleadoRoutes from './routes/empleados.routes.js';
-estando en index. js agregamos el siguiente codigo:
        //Aqui le decimos a express que vamos a usar empleadosRoutes que es el archivo
        // que contiene las rutas
        app.use(empleadoRoutes);
-En la carpeta routes creamos otro archivo index.routes.js y en el:
        import {Router} from 'express'; //Que seria 1 enrutador
        //Creamos el enrutador asi:
        const router = Router()
        export default router        
-Bien y ahora desde index.js cortamos:
        //Creando consulta a la base de datos
        app.get('/ping', async (req, res) => {
            const [resultado] = await pool.query('SELECT 1+1 AS result');
            res.json(resultado[0]);
        });
y lo pegamos en index.routes.js antes del export dejando el codigo asi:
        import {Router} from 'express'; //Que seria 1 enrutador
        //Creamos el enrutador asi:
        const router = Router();

        //Creando consulta a la base de datos
        app.get('/ping', async (req, res) => {
            const [resultado] = await pool.query('SELECT 1+1 AS result');
            res.json(resultado[0]);
        });

        export default router        

-y reemplazamos app por router asi: 
        router.get('/ping', async (req, res) => {
            const [resultado] = await pool.query('SELECT 1+1 AS result');
            res.json(resultado[0]);
        });
-como este codigo utiliza pool tendremos que importar pool en index.routes.js
quitandolo del index y colocandolo en index.routers.js :
        //importamos la base de datos lleva 2 puntos porque habiamos cambiado el nivel
        import {pool} from '../db.js';
-Ahora en index.js importaremos index.routes.js
CONTROLLERS (CONTROLADORES):
-Creamos una nueva carpeta en crc: que nombraremos controllers, en ella colocaremos la logica de empleados.routes.js 
-Esto es lo que logramos hacer:
        //exportamos el controlador a empleados.routes.js
        export const getEmpleados = (req, res) => res.send('Obteniendo empleado');
-Y en empleados.routes.js importamos desde empleados.controller.js:
        import { getEmpleados } from '../controllers/empleados.controller.js';
 y lo llamamos en nuestra rest api:
        router.get('/empleado', getEmpleados);
-Por lo tanto hacemos lo mismo para las demas funciones en empleados.routers.js
dejando este codigo de esta manera:
        import {Router} from 'express';
import { getEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from '../controllers/empleados.controller.js';
        //Enrutador practicamente vacio
        const router = Router()

        //Creando rest api con los metodos get, post, put y delete
        router.get('/empleado', getEmpleados);
        router.post('/empleado', crearEmpleado );
        router.put('/empleado', actualizarEmpleado);
        router.delete('/empleado', eliminarEmpleado);

        export default router;
-Ahora le toca index.routes.js alli quitaremos la funcion y la colocaremos en un archivo nuevo en controllers al que llamaremos index.controller.js, dejando el archivo de esta forma:
        export const ping = async (req, res) => {
        const [resultado] = await pool.query('SELECT 1+1 AS result');
        res.json(resultado[0]);
        };
-Esto no funcionara ya que deberemos colocar el import del pool dentro del archivo index.controller.js, quedando este archivo de la siguiente manera:
        //importamos la base de datos
        import {pool} from '../db.js';
        // Obtiene la conexión a la base de datos
        export const ping = async (req, res) => {
        const [resultado] = await pool.query('SELECT 1+1 AS result');
        res.json(resultado[0]);
        };        

POST EMPLEADO:
-En database.sql crearemos un metodo post para insertar un empleado:
        INSERT INTO empleado (nombre, salario) VALUES ('Juan', '1000'); 
pero, en realidad esta consulta POST la tendriamos que realizar en el controlador donde tenemos el controllers de empleados, por lo tanto alli creamos el metodo post:
-primero importamos el pool:
        import {pool} from '../db.js';
. y luego en crear Empleado, hacemos el post:
         export const crearEmpleado = (req, res) => {
         //para insertar los datos por grupos
        //pool.query('INSERT INTO empleados (nombre, salario) VALUES(?, ?)',[]);
        console.log(req.body);//para ver los datos que el cliente envia al servidor
        res.send('Creando empleado');
        }
con el console log vemos cuales son los datos que manda el cliente al servidor y alli podemos ver si nuestro servidor entiende el dato, al probarlo en el servidor obtendremos Undefined, porque de momento el cliente no esta pasando ningun dato al servidor, por lo tanto esto es porque el servidor no entiende los datos pasados, para reslver esto vamos a index.js y utilizando una funcion de app es como le vamos a decir al servidor que lea el dato json que pasa el cliente:
        //Antes de que llegue a la ruta vamos a utilizar un middleware para que el servidor
        // pueda entender los datos que envia el cliente (json)
        app.use(express.json());
-Bien ahora en empleados.controler.js modificamos el metodo post dejandolo de esta forma:
        //consulta asincrona
        export const crearEmpleado = async (req, res) => {
        const {nombre, salario} = req.body;
        //para insertar los datos por grupos
        const [rows] = await pool.query('INSERT INTO empleado (nombre, salario) VALUES(?, ?)',[nombre, salario]);
        //console.log(req.body);//para ver los datos que el cliente envia al servidor
        res.send({
                id: rows.insertId,
                nombre,
                salario
        });
        }

Y listo de esta forma ya podemos colocar empleados en la base de datos

OBTENER EMPLEADOS (todos)
-para obtener los empleados modificaremos la funcion getEmpleados que se encuentra en empleados.controller.js dejando la funcion de esta forma:
        export const getEmpleados = async (req, res) => {
        const [rows] = await pool.query('SELECT * FROM empleado');
        res.json(rows);
        };
Ahora lo que haremos sera agregarle a la ruta de empleado /api antes, para ello 
en index.js y antes de empleadoRoutes colocaremos /api quedando el codigo asi:
      app.use('/api',empleadoRoutes)

OBTENER EMPLEADO X ID:
-En empleado.routes.js lo que haremos sera copiar el getEmpleados y agregaremos un parametro a su direccion: (esto lo hace express)
        //empleados por id
        router.get('/empleado/:id', getEmpleados);
-Ahora en empleados.controller.js colocaremos el metodo para buscar por id, este
nos devolvera el resultado y si buscamos un id que no existe con express crearemos un status con un error 404 anunciando que ese id no se encuentra, por lo tanto el codigo quedaria de esta manera:
        //consulta por un empleado segun su id
        export const getEmpleado = async (req, res) => {
        //esto es para obtener el id que envia el cliente
        console.log(req.params.id);
        const [rows]= await pool.query('SELECT * FROM empleado WHERE id = ?', [req.params.id]);
        if (rows.length <= 0) {
                return res.status(404).json({
                message: 'Empleado no encontrado'});
        }
        console.log(rows);
        res.json(rows[0]);
        };        

BORRAR (DELETE) EMPLEADOS
-Esta consulta es muy similar a buscarlos por id, lo unico que cambiaria es que lo eliminariamos una vez encontrado, por lo tanto en nuestro empleados.controller.js crearemos la consulta para eliminar por id, realizando el siguiente codigo:
        //Eliminar por id
        export const eliminarEmpleado = async (req, res) => {
        const [result] = await pool.query('DELETE FROM empleado WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) {
                return res.status(404).json({
                message: 'Empleado no encontrado'});
        }
        console.log(result);
        res.sendStatus(204);
        }

-Tambien otro cambio a realizar es agregar el parametro en la rutas de empleados.routes.js (:id)
        router.delete('/empleado/:id', eliminarEmpleado);

PATCH empleado EDITAR EMPLEADO
- En empleados.controller.js arreglaremos la funcion actualizarEmpleado dejando el codigo de esta forma:
        //Actualizar por id
        export const actualizarEmpleado = async (req, res) => {
        const {id} = req.params;
        const {nombre, salario} = req.body;
        //para actualizar los datos por grupos
        //console.log(id, nombre, salario);
        const [result] = await pool.query(
                'UPDATE empleado SET nombre = IFNULL(?, nombre), salario = IFNULL(?, salario) WHERE id = ?', [nombre, salario, id]);
                console.log(result);
        if (result.affectedRows === 0) {    
        return res.status(404).json({
                message: 'Empleado no encontrado'});
        }
        //Ahora con SELECT para que nos muestre los datos actualizados
        const [rows] = await pool.query('SELECT * FROM empleado WHERE id = ?', [id]);
        console.log(rows);
        res.json(rows[0]);
        }
-Tambien otro cambio a realizar es agregar el parametro en la rutas de empleados.routes.js (:id) en PUT
        router.patch('/empleado/:id', actualizarEmpleado);

MANEJO DE ERRORES
- Para tener un buuen manejo de errores, por ejemplo pensando en que ocurriria si el servidor esta caido, como informo al cliente de los sucedido, para ello vamos a crear nuestro propio error en javascript de esta forma nos quedara el codigo completo de empleados.controllers.js una vez que le agregamos try catch para el manejo de errores, tambien provocamos errores para testear el funcionamiento y entonces el codigo quedo de esta manera actualizado:

        //exportamos el controlador a empleados.routes.js
export const getEmpleados = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleado');
        //console.log(rows);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al consultar los empleados',
        });
    }

};
//consulta por un empleado segun su id
export const getEmpleado = async (req, res) => {
    try {
        //para forzar un error y testeear el try catch
         //throw new Error('Error forzado');
        //esto es para obtener el id que envia el cliente
        console.log(req.params.id);
        const [rows] = await pool.query('SELECT * FROM empleado WHERE id = ?', [req.params.id]);
        if (rows.length <= 0) {
            return res.status(404).json({
                message: 'Empleado no encontrado'
            });
        }
        console.log(rows);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al consultar el empleado',
        });
    }
};
//consulta asincrona
export const crearEmpleado = async (req, res) => {
    const { nombre, salario } = req.body;
    try {
        //para insertar los datos por grupos
        const [rows] = await pool.query('INSERT INTO empleado (nombre, salario) VALUES(?, ?)', [nombre, salario]);
        //console.log(req.body);//para ver los datos que el cliente envia al servidor
        res.send({
            id: rows.insertId,
            nombre,
            salario
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al crear el empleado',
        });
    }
}

//Eliminar por id
export const eliminarEmpleado = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM empleado WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Empleado no encontrado'
            });
        }
        console.log(result);
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al eliminar el empleado',
        });
    }
}

//Actualizar por id
export const actualizarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, salario } = req.body;
    try {
        //para actualizar los datos por grupos
        //console.log(id, nombre, salario);
        const [result] = await pool.query(
            'UPDATE empleado SET nombre = IFNULL(?, nombre), salario = IFNULL(?, salario) WHERE id = ?', [nombre, salario, id]);
        console.log(result);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Empleado no encontrado'
            });
        }
        //Ahora con SELECT para que nos muestre los datos actualizados
        const [rows] = await pool.query('SELECT * FROM empleado WHERE id = ?', [id]);
        console.log(rows);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrio un error al actualizar el empleado',
        });
    }
}

NOT FOUND ROUTE (MANEJANDO EL ERROR)
-Para manejar este error por si el usuario ingresa cualquier ruta a buscar en index.js vamos a colocar despues de que recorra las rutas el siguiente uso de la app:
        //Aqui le decimos al usuario que la pagina no existe porque la ruta no existe
        app.use((req, res, next) => {
                res.status(404).json({
                        message: 'Pagina no encontrada'
                })
        })

VARIABLES DE ENTORNO

-Para preparar nuestro proyecto para produccion y que sea mas segura nuestra app al trabajar con una base de datos vamos a prepararlo utilizando variables de entorno.
-Vamos a instalar un modulo mas de node utilizaremos dotenv de esta manera instalamos por terminal:
npm i dotenv
- Una vez instalado el modulo en la raiz del proyecto colocaremos nuestro archivo .env
y dentro de el colocaremos la informacion a proteger, ademas ahora en src crearemos el archivo config.js que es el que manejara las variables de entorno
        import {config} from 'dotenv';
        //este archivo es para configurar las variables de entorno
        config();
        //aqui mostramos el puerto que esta en el archivo .env
        //console.log(process.env.PORT);
        export const PORT = process.env.PORT || 3000;
-Ahora en index.js importaremos:
        import {PORT} from './config.js';
y en app.listen quitaremos el valor 3000 y lo reemplazaremos por la variable de entorno PORT quedando de esta forma:
        export const PORT = process.env.PORT || 3000;
y aprovechamos para hacer los demas:        
        export const DB_USER = process.env.DB_USER || 'root';
        export const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';
        export const DB_HOST = process.env.DB_HOST || 'localhost';
        export const DB_PORT = process.env.DB_PORT || 3306;
        export const DB_DATABASE = process.env.DB_DATABASE || 'empresa';
-Ahora en db.js vamos a importar config.js como hicimos en index.js dejando el codigo asi:
        import {PORT, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER,}
        from './config.js';

        export const pool = createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        database: DB_DATABASE,
        });
-Finalizado esto ya tenemos todas las variables de entorno creadas y listas para produccion, ahora lo que se rrecomienda hacer es quitar codigo en mi index.js y colocarlo
en un nuevo archivo en src que llamare app.js y dentro de el colocaremos el codigo que sacaremos de index.js dejando el codigo app.js de esta forma:
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

-Podemos eliminar la importacion de PORT ya que estamos solo definiendo en app.js y no estamos utilizando el metodo listen, este lo tenemos en index.js y alli importaremos desde app.js, por lo tanto este archivo index quedara de la siguiente forma:

        //Inicio del proyecto
        //importando desde app.js
        import app from './app.js';
        //importando el PORT desde config.js
        import { PORT } from './config.js';

        app.listen(PORT); 
        console.log('Server on port', PORT);

DESPLEGANDO LA APLICACION EN RAYLWAY
-Primero vamos a necesitar un repositorio de github, y para ello tambien tenemos que preparar cuales seran los archivos que subiremos a github y cuales no, por lo tanto en nuestra raiz creamos el archivo .gitignore y dentro de el ignoraremoos estos archivos:
        node_modules
        .env
        









