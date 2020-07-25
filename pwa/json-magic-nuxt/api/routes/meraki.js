const { Router } = require("express");

const router = Router();

// External Configuration File
var configs = require("../../meraki.config");
//var requestMeraki = require("../../request-meraki.js");
var bodyParser = require("body-parser");
var request = require("request");

/* API router. */
var jsonParser = bodyParser.json();
router.use("/", jsonParser, function(req, res, next) {
  console.log("API request url", req.url);
  console.log("API request headers", req.headers);
  console.log("request body, ", req.body);

  // Use server side key only
  apiKey = configs.apiKey;

  /*
  // Use client supplied API key or default to server config.
  var apiKey = "";
  if ("x-cisco-meraki-api-key" in req.headers) {
    apiKey = req.headers["x-cisco-meraki-api-key"];
    //console.log("New headers sent", apiKey);
  } else {
    apiKey = process.env.API_KEY || configs.apiKey;
  }
  */

  var options = {
    qs: req.query,
    url: configs.apiUrl + req.url,
    method: req.method,
    body: JSON.stringify(req.body),
    //followAllRedirects: true, // Does not work as intended with PUT,POST,DELETE (returns a [GET] on final location)
    headers: {
      "X-Cisco-Meraki-API-Key": apiKey,
      "Content-Type": "application/json",
      "User-Agent": "meraki-json-magic-demo"
    }
  };
  console.log("meraki.js requestMeraki options", options);
  //request(options())

  request(options, function(err, response, data) {
    if (err) {
      console.log("requestMeraki err ", err);
      res.send(err);
    }
    //console.log("FINAL res", response);
    if (data) {
      console.log("FINAL data ", data);
    }
    if (response.headers["content-type"]) {
      res.setHeader("content-type", response.headers["content-type"]);
    }
    res.status(response.statusCode).send(data || "");
  }).on("error", function(err) {
    console.log(err);
    res.send(err);
  });

  /* Legacy Method - to handle  redirects and Org ID as number
  requestMeraki(options, function(err, response, data) {
    if (err) {
      console.log("requestMeraki err ", err);
      res.status(response.statusCode).send({
        message: "err"
      });
      res.send(err);
    }
    console.log("FINAL res.statusCode ", response.statusCode);
    console.log("FINAL res.body ", response.body);

    res.setHeader("content-type", response.headers["content-type"]);
    res.status(response.statusCode).send(data);
  });
  */
});

module.exports = router;
