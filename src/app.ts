import "./pre-start";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";
import "express-async-errors";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import RouteError from "@src/common/RouteError";

//Import Mongoose.
import mongoose from "mongoose";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

import auth from "@src/routes/auth";
import user from "@src/routes/user";

import enquiries from "@src/routes/enquiry";
import licensing from "@src/routes/license";

// //Import Swagger Doc
// import swaggerJsdoc from 'swagger-jsdoc';

// //Import Swagger Doc
// import swaggerUi from 'swagger-ui-express';

// //import yaml
// import YAML from 'yamljs';
import EnvVars from "@src/common/EnvVars";
//Import Routes
import indexRouter from "./routes/index";

const app = express();

const SERVER_START_MSG =
  "Express server started on port: " + EnvVars.Port.toString();
const allowedOrigins = [
  "https://horsetechnologies.org",
  "http://localhost:3000",
];

// console.log("EMAIL_USER---->", process.env.EMAIL_USER);
// console.log("EMAIL_PASS---->", process.env.EMAIL_PASS);
// console.log("EMAIL_SERVICE---->", process.env.EMAIL_SERVICE);
// console.log("DB---->", process.env.DBNAME);
// console.log("DB STRING---->", process.env.DBCONN_STR);

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// APIs
app.use("/", indexRouter);
app.use("/api/auth", auth);
app.use("/api/users", user);

//console related
app.use("/api/enquiries", enquiries);
app.use("/api/licensing", licensing);

// Initial Swagger
// const swaggerDocumentation = YAML.load('./src/api.yaml');

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);

//#region  ======= CREATE SERVER AND START ===============
var http = require("http");

//  Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//   Create HTTP server.
var server = http.createServer(app);

//  Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
//#endregion

//Configure Routes
app.use("/", indexRouter);
// app.use("/api/auth", auth);

//Connect to MongoDB
try {
  mongoose.set("strictQuery", false);
  mongoose.set("strictPopulate", false);
  mongoose
    .connect(
      process.env.DBCONN_STR || "mongodb://127.0.0.1:27017/horsetechdb",
      {
        dbName: process.env.DBNAME,
      }
    )
    .then((e) => {
      console.log("Database Connection Successful");
      console.log("connected to database ", process.env.DBCONN_STR);
      console.log("connected to host", e.connection.host);
    })
    .catch((err) => {
      console.log({ err });
    });
} catch (error: any) {
  console.log(error);
}

app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (process.env.NODE_ENV !== "test") {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// Some other functions
function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

//  Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("App started on port: ", bind);
}

//  Normalize a port into a number, string, or false.
function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Add error handler

// Set views directory (html)
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set doc directory (html)
const docsDir = path.join(__dirname, "restendpoints");
app.set("doc", docsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

module.exports = app;
