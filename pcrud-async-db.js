'use strict';
let http = require('http');
let url = require('url');
let fs = require('fs');
let util = require('util');

let level = require('level');
 
const dbFile = 'counter-db';
const db = level(dbFile);

async function createCounter(name, response) {
    await db.put(name, 0);
    response.write("<h1> counter " + name + " created </h1>");
    response.end();
}

async function isFound(name){
    try{let val = await db.get(name)}
    catch(err)
    {
        return false;
    }
    return true;
}

function errorCounter(name, response) {
    response.write("<h1> error: counter " + name + " not found. </h1>");
    response.end();
}

async function readCounter(name, response) {
    if(await isFound(name)){
        let val = await db.get(name, response);
        response.write("<h1> counter [" + name + "] = " + val + " </h1>");
    }
    else{
        errorCounter(name, response);
    }
}

async function updateCounter(name, response) {
    if(await isFound(name)){
        let val = parseInt(await db.get(name));
        ++val;
        await db.put(name, val);
        response.write("<h1> counter " + name + " updated </h1>");
    }
    else{
        errorCounter(name, response);
    }
    
}

async function deleteCounter(name, response) {
    if(await isFound(name)){
        await db.del(name);
        response.write("<h1> counter " + name + " deleted </h1>");
    }
    else{
        errorCounter(name, response);
    }
}

const headerText = { "Content-Type": "text/html" };
let server = http.createServer();
server.on('request', async (request, response) => {
    response.writeHead(200, headerText);
    let options = url.parse(request.url, true).query;
    response.write(JSON.stringify(options));
    if (request.url.startsWith("/create")) {
	await createCounter(options.name, response);
        return;
    }
    let bool = await isFound(options.name)
    if (!bool) {
	    errorCounter(options.name, response);
        return;
    }
    if (request.url.startsWith("/read")) {
	await readCounter(options.name, response);
    }
    else if (request.url.startsWith("/update")) {
	await updateCounter(options.name, response);
    }
    else if (request.url.startsWith("/delete")) {
	await deleteCounter(options.name, response);
    }
    else {
        response.write("no command found.");
    }
    response.end();
});
server.listen(8080);