import {Router} from 'express'; //Que seria 1 enrutador
//importamos el controlador
import {ping} from '../controllers/index.controller.js';
//Creamos el enrutador asi:
const router = Router();

//Creando consulta a la base de datos
router.get('/ping', ping);

export default router