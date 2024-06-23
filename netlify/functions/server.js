const { createRequestHandler } = require("@expo/server/adapter/netlify");

import path from "path";

const __dirname = path.resolve();

const handler = createRequestHandler({
  build: require("path").join(__dirname, "../../dist/server"),
  mode: process.env.NODE_ENV,
});

module.exports = { handler };
