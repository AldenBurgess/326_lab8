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
    let resp = {'result' : 'created', 'name' : name, 'value' : 0};
    response.write(JSON.stringify(resp));
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
    let resp = {'result' : 'error'};
    response.write(JSON.stringify(resp));
    response.end();
}

async function readCounter(name, response) {
    if(await isFound(name)){
        let val = await db.get(name, response);
        let resp = {'result' : 'read', 'name' : name, 'value':val};
        response.write(JSON.stringify(resp));
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
        let resp = {'result':'updated','name': name,'value':val}
        response.write(JSON.stringify(resp));
    }
    else{
        errorCounter(name, response);
    }
    
}

async function deleteCounter(name, response) {
    if(await isFound(name)){
        await db.del(name);
        let resp = {'result':'deleted','name': name};
        response.write(JSON.stringify(resp));
    }
    else{
        errorCounter(name, response);
    }
}

const headerText = { "Content-Type": "application/json",
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "*"
};

let server = http.createServer();
server.on('request', async (request, response) => {
    response.writeHead(200, headerText);
    let options = url.parse(request.url, true).query;
    // Heroku mod start
   if (request.url.endsWith("/index.html")) {
    fs.readFile('static/pcrud-interactive.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            response.write('Whoops! File not found!');
        } else {
            response.writeHead(200, {
                "Content-Type": "text/html"});
            response.write(data);
        }
        response.end();
    });
    return;
} else if (request.url.endsWith("/pcrud-xhr.js")) {
    fs.readFile('static/pcrud-xhr.js', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            response.write('Whoops! File not found!');
        } else {
            response.writeHead(200, {
                "Content-Type": "text/javascript"});
            response.write(data);
        }
        response.end();
    });
    return;
}
// Heroku mod ends

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
server.listen(process.env.PORT);