// express is the server that forms part of the nodejs program
var express = require('express');
var path = require("path");
var fs = require('fs');
var app = express();

// add an https server to serve files 
var http = require('http');

var httpServer = http.createServer(app);
var httpServerPort = 4443;

httpServer.listen(httpServerPort);


app.get('/',function (req,res) {
	res.send("Hello World from the App Server on Node port "+httpServerPort + " (mapped to Apache port 443)");
});

// adding functionality to log the requests
app.use(function (req, res, next) {
	var filename = path.basename(req.url);
	var extension = path.extname(filename);
	console.log("The file " + filename + " was requested.");
	next();
});

app.use(express.static(__dirname));
