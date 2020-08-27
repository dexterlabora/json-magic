const { Router } = require('express')
var axios = require('axios');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const router = Router()

// API Request Handler
// function request(requestOptions) {
//   requestOptions.contentType = "application/json";
//   requestOptions.followRedirects = true;
//   if (response.headers["content-type"]) {
//     res.setHeader("content-type", response.headers["content-type"]);
//   }
//   // ** AXIOS **
//   requestOptions.baseURL = requestOptions.baseURL; // || "http://localhost:8080/api"; // hard coded for local dev testing
//   console.log("axios requestOptions", requestOptions)
//   return axios(requestOptions)
//     .then(res => {
//       console.log("axios res", res);
//       return res.data;
//     })
//     .catch(e => {
//       console.log("request-handler error: ", e);
//     });
// }

function request(requestOptions) {
  
  //requestOptions.contentType = "application/json";
  requestOptions.followRedirects = true;
  // if (response.headers["content-type"]) {
  //       res.setHeader("content-type", response.headers["content-type"]);
  //     }

  // ** AXIOS **
  //requestOptions.url = requestOptions.url; // || "http://localhost:8080/api"; // hard coded for local dev testing
  //console.log("axios requestOptions", requestOptions)
  return axios(requestOptions)
    .then(res => {
      //console.log("axios res.data", res.data);
      return res.data;
    })
    .catch(e => {
      console.log("request-handler error: ", e);
      return e
    });
}


router.post('/proxy', jsonParser, async (req, res, next) => {
  console.log('/proxy req.body', req.body)
  await request(req.body).then(data => res.json(data)).catch(e => {
    res.json(e)
  })
});

router.get('/proxy', async (req, res, next) => {
  res.send("API Proxy")
  
});

module.exports = router
