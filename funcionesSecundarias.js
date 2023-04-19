const fetch = require('node-fetch');
const fs = require('fs');
const pathM = require('path');

function pathExist(path){
  return fs.existsSync(path);
}

function absoluteFunction(path){
  if(pathM.isAbsolute(path)) {
    return path;
  } else {
    return pathM.resolve(path);
  }
}

function mdExists(path) {
  if(pathM.extname(path) === ".md"){
    return path;
  }
}

function leerArchivo(path){
  return fs.readFileSync(path, 'utf8', function(err, archivo) {
 
    return archivo;
    
    //console.log(err); 
    //console.log(data);
  });
}
//Creamos una función con el parámetro de archivo y path 
function identifyLinks(archivo, path) {
  //Creamos un array vacío para objetos
  const linkArray = [];
  //Esta es una expresión regular
  const regEx = /\[+[a-zA-Z0-9.-].+\]+\([a-zA-Z0-9.-].+\)/gm;
  //Creamos un nuevo array y al archivo le agregamos el método match con la expresión regular
  const stringArray = archivo.match(regEx);
  //Si el array es diferente de nulo
  if (stringArray != null) {
    //Pasar por el for el array del string
    for (let i = 0; i < stringArray.length; i++) {
      //Tomamos el elemento string
      const element = stringArray[i];
      //Tomamos index de cuando empieza el texto 
      const startText = element.indexOf('[');
      //Index de cuando termina el texto
      const endText = element.indexOf(']');
      //Index de cuando empieza el links
      const startLink = element.indexOf('(');
      //Index de cuando termina el link
      const endLink = element.indexOf(')');
      //Definir el objeto y meterlo al linkArray 
      linkArray.push({
        href: element.substring(startLink + 1, endLink),
        text: element.substring(startText + 1, endText),
        file: absoluteFunction(path)
      });
    
    } 
    
  }
  
  return linkArray;
}


//La función recibe un array de links
function validateLinks(linkArray) {
  console.log("ya entraste a validate");
  //Se crea un array para las promesas que tiene que estar vacío
  const arrayPromesas = [];
  //Se crea un for para linkArray
  for (let i = 0; i < linkArray.length; i++) {
    const element = linkArray[i];
    //Se crea un array para promesas fetch que recibe la constante element y un .href
    const elementFetch = fetch(element.href);
    //Se ejecuta la función push que necesita la variable element fetch a la variable array promesas
    arrayPromesas.push(elementFetch);
  }
  //Este es un array de objetos-links/Cuando todos los fetch estén realizados, se inicializa el then
  return Promise.allSettled(arrayPromesas).then((results) => {
    //Se pasa por todos los resultados y checa el estatus 
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      //Si el fetch se realiza con éxito 
      if (element.status === 'fulfilled') {
        //Se le agrega al elemento i de link array, las propiedades ok y status basado en el resultado del fetch
       element.value.ok ? linkArray[i].ok = 'ok':linkArray[i].ok = 'fail';
       linkArray[i].status = element.value.status;
      } else {
        //Si el fetch no se realiza con exito, agregamos al elemento i de link array las propiedades negativas o de fallo
        linkArray[i].status = 404;
        linkArray[i].ok = 'fail';
      }
    }
    //Devolver el link array modificado/expandido
    return linkArray;
  });
};

module.exports = {
  pathExist,
  absoluteFunction,
  mdExists,
  leerArchivo,
  identifyLinks,
  validateLinks
}
