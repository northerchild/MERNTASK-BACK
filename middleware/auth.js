const jwt = require('jsonwebtoken');
const Proyecto = require('../models/Proyecto');

module.exports = function(req,res,next){
    //leer el token del header
    const token = req.header('x-auth-token');
    //Revisar si no hay token
    if(!token){
        return res.status(401).json({msg: 'No hay token, permiso no válido'})
    }
    //validar el token 
    try {
        //Guardar el proyecto
        const cifrado = jwt.verify(token, process.env.SECRETA)
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        res.status(401).json({msg:'Token no válido'});
    }
}