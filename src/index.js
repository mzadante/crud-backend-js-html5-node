//Inicio del proyecto

//importando desde app.js
import app from './app.js';
//importando el PORT desde config.js
import { PORT } from './config.js';

app.listen(PORT); 
console.log('Server on port', PORT);