const { createRequestHandler } = require("@expo/server/adapter/netlify");

import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = createRequestHandler({
  build: require("path").join(__dirname, "../../dist/server"),
  mode: process.env.NODE_ENV,
});

module.exports = { handler };
