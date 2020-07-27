const express = require("express");

// Create express instnace
const app = express();

// Require API routes
const proxy = require("./routes/proxy")

// Import API Routes
app.use(proxy)

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
