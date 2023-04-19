
const fs = require('fs');
const pathM = require('path');
const importModule = require('./funcionesSecundarias');

function mdLinks(path, options) {
  //Crear una nueva promesa, la promesa nos regresa una función: resolve o reject
  return new Promise (function(resolve,reject){
    //Crear constante para usarla después porque vamos a usarla varias veces 
    const absolutePath = importModule.absoluteFunction(path);
    //Checar si el camino existe
    if (importModule.pathExist(absolutePath)) {
      //Checar si el archivo es un md
      if (importModule.mdExists(absolutePath)) {
        //metemos funciones dentro de otras funciones // Se importa desde funcionesSecundarias
        const archivo = importModule.leerArchivo(absolutePath);
        //estamos pasando variable archivo como párametro a identify link
        const linksIdentificados = importModule.identifyLinks(archivo, absolutePath);
        //la longitud de identificar links es mayor a cero
        if (linksIdentificados.length > 0) {
          //Este parametro se la pasamos, validate es una propiedad del parametro
          if (options.validate) {
            resolve(importModule.validateLinks(linksIdentificados));
          } else {
            resolve(linksIdentificados);
          }
        } else { 
          reject('No hay links');
        }
        //Si el archivo no es válido, lanza error
      } else {
        reject('El archivo no es válido');
      }
      //Si el camino no existe, lanza error
    } else {
      reject('No existe el camino');
    }
  }).then((respuesta) => {console.log(respuesta)});
  
}
const testPath = "/Users/macbookair/DEV003-md-links/README.md";
mdLinks(testPath,{validate:true});
