// User Defined Environment
const serverPort = 3000

// Setup
// #########################

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var axios = require('axios');
var expressWs = require('express-ws')(app);
const path = require('path');
var jsonParser = bodyParser.json();

// API Request Handler
function request(requestOptions) {
  
  requestOptions.contentType = "application/json";
  requestOptions.followRedirects = true;

  // ** AXIOS **
  requestOptions.baseURL = requestOptions.baseURL; // || "http://localhost:8080/api"; // hard coded for local dev testing
  console.log("axios requestOptions", requestOptions)
  return axios(requestOptions)
    .then(res => {
      console.log("axios res", res);
      return res.data;
    })
    .catch(e => {
      console.log("request-handler error: ", e);
    });
}


// Server Routes
// ######


// Frontend VUE app
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

// Proxies API requests for client
app.post('/api/proxy', jsonParser, (req, res) => {
  console.log(req.body)
  request(req.body).then(data => res.send(data))
});

// Websocket to Vue App - real-time updates
app.ws('/websocket', function (ws, req) {
  ws.on('message', function (msg) {
    console.log(msg);
  });

  // exposes API to accept JSON for display with an active websocket client
  app.post('/webhook', jsonParser, (req, res) => {
    console.log(req.body)
    res.status(201).send(req.body);
    ws.send(JSON.stringify(req.body, null, 4));
  });
});



// Begin Server
app.listen(serverPort);
console.log("\n Application Started \n");
console.log(`APP address on      http://localhost:${serverPort}`)
console.log(`Webhook API address    http://localhost:${serverPort}/webhook`)
console.log(`Websocket address   ws://localhost:${serverPort}`)