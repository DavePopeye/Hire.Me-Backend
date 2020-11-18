const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const cookieParser = require("cookie-parser");

//Routes
const studentsRouter = require("./students");

const hirersRouter = require("./hirers");

//Emails Service

//Error Handlers

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers");

//Server
const server = express();
const httpServer = http.createServer(server);

const listEndpoints = require("express-list-endpoints");
dotenv.config();

const port = process.env.PORT;
server.use(express.json());
server.use(cors());
server.use(cookieParser());

server.use("/students", studentsRouter);
server.use("/hirers", hirersRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndpoints(server));

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || 3003;
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    httpServer.listen(port, () => {
      console.log(`working on port ${port}`);
    })
  );
mongoose.connection.on("connected", () => {
  console.log("connected to atlas");
});
