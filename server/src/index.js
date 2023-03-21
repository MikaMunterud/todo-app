const express = require("express");
const server = express();
const cors = require("cors");

require("dotenv").config();
const cookieParser = require("cookie-parser");
const { authenticationRoute } = require("./routes/authenticationRoute");
const { friendRoute } = require("./routes/friendRoute");
const {
  checkAuthentication,
} = require("./controllers/middleware/checkAuthentication");
const { todoListRoute } = require("./routes/todoListRoute");
const { taskRoute } = require("./routes/taskRoute");

server.use(express.json());
server.use(cookieParser());

server.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
  })
);

server.use("/authentication", authenticationRoute);

/*
 * checkAuthentication is made for all below routes/ end points to ensure that the user is logged
 * in before they can access any account setting or application functions.
 */
server.use("/friend", checkAuthentication, friendRoute);
server.use("/todoList", checkAuthentication, todoListRoute);
server.use("/task", checkAuthentication, taskRoute);

server.listen(5050);
