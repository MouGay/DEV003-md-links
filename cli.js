const {mdLinks} = require('./index.js');
const process = require('process');
//const chalk = require('chalk');

const path = process.argv[2];
const validate = process.argv.includes('--validate') || process.argv.includes('--v');
const stats = process.argv.includes('--stats') || process.argv.includes('--s');
const options = {validate, stats};
console.log(options);

function totalLinks(linkArray){
    return linkArray.length;
}

function uniqueLinks(linkArray){
    const linksNoRepetidos = linkArray.map(link => link.href);
    const setDeLinks = new Set(linksNoRepetidos); 
    return setDeLinks.size;
}

function failLinks(linkArray){
    const linksRotos = linkArray.filter(link => link.ok === 'fail').map(link => link.href);
    const setDeLinks = new Set(linksRotos);
    return setDeLinks.size;

}

mdLinks(path, options).then((respuesta) => {
    if(validate && stats){
        console.log('Total de links ' + totalLinks(respuesta));
        console.log('Links únicos ' + uniqueLinks(respuesta));
        console.log('Links rotos ' + failLinks(respuesta));
    } else if (stats) {
        console.log('Total de links ' + totalLinks(respuesta));
        console.log('Links únicos ' + uniqueLinks(respuesta));
    } else if (validate) {
        respuesta.forEach(link => {
            console.log('URL:     ' + link.href);
            console.log('Título:  ' + link.text);
            console.log('Archivo: ' + link.file);
            console.log('Status:  ' + link.status);
            console.log('Ok:      ' + link.ok);
            console.log('');
        });
    } else {
        respuesta.forEach(link => {
            console.log('URL:     ' + link.href);
            console.log('Título:  ' + link.text);
            console.log('Archivo: ' + link.file);
            console.log('');
        });
    }
}).catch((error) => console.log(error));
