const express = require("express");

// Create express instnace
const app = express();

// Require API routes
//const meraki = require("./routes/meraki");
const proxy = require("./routes/proxy")

// Import API Routes
//app.use(meraki);
app.use(proxy)

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
