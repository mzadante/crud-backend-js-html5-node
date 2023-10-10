//importamos la base de datos
import {pool} from '../db.js';
// Obtiene la conexión a la base de datos
export const ping = async (req, res) => {
    const [resultado] = await pool.query('SELECT "pong" AS result');
    res.json(resultado[0]);
};