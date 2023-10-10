import { pool } from '../db.js';

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



