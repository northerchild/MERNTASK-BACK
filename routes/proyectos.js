const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectosControllers');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//Crear Proyectos
//api/proyecto
router.post('/', 
            auth,[check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()],
            proyectoController.crearProyecto);
//obtener todos los proyectos            
router.get('/', auth,proyectoController.obtenerProyectos);
//actualizar un proyecto via ID
router.put('/:id',
            auth,[check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()],
            proyectoController.actualizarProyecto)
module.exports = router;

//eliminar un proyecto via ID
router.delete('/:id',
            auth,[check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()],
            proyectoController.eliminarProyecto)
module.exports = router;