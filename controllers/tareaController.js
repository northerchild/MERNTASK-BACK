const Tarea = require('../models/Tareas');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');
//crea una nueva tarea
exports.crearTarea = async (req,res) =>{
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    //Extraer el proyecto y comprobar si existe

    try {
        const {proyecto} = req.body;
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        //Revisar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }
        //Creamos la tarea
        const tarea = Tarea(req.body);
        await tarea.save();
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async(req,res) =>{
    try {
        const {proyecto} = req.query;
        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
        //Revisar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }
        //Obtener las tareas por proyecto 
        const tareas = await Tarea.find({proyecto})
        res.json({tareas});
    } catch (error) {
        console.log(error)
    }
}

//Actualizar tarea
exports.actualizarTarea = async (req,res) =>{
    try {
        const {proyecto,nombre,estado} = req.body;
        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id).sort({creado: -1});
        if(!tarea){
            return res.status(404).json({msg: 'No existe la tarea'})
        }
        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        //Revisar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;  

        //Guardar Tarea     
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id }, nuevaTarea, { new: true } );
        res.json({tarea});   
    } catch (error) {
        console.log(error);
    }
}

// Elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const {proyecto,nombre,estado} = req.query;
        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe la tarea'})
        }
        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)
        //Revisar si el proyecto pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
        if(nombre) nuevaTarea.nombre = nombre;
        if(estado) nuevaTarea.estado = estado;  

        //Guardar Tarea     
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'}) 
    } catch (error) {
        console.log(error);
    }
}