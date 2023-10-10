import {Router} from 'express';
import { getEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado, getEmpleado } from '../controllers/empleados.controller.js';
//Enrutador practicamente vacio
const router = Router()

//Creando rest api con los metodos get, post, put y delete
router.get('/empleado', getEmpleados);
//empleados por id
router.get('/empleado/:id', getEmpleado);
router.post('/empleado', crearEmpleado );
router.patch('/empleado/:id', actualizarEmpleado);
router.delete('/empleado/:id', eliminarEmpleado);

export default router;