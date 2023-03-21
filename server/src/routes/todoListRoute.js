const express = require("express");

const {
  todoListAdd,
} = require("../controllers/todoListController/todoListAdd");
const {
  todoListDelete,
} = require("../controllers/todoListController/todoListDelete");
const {
  todoListEdit,
} = require("../controllers/todoListController/todoListEdit");
const {
  todoListGet,
} = require("../controllers/todoListController/todoListGet");

const todoListRoute = express.Router();

/*
 * This route makes it possible for a user to add a todo list into their own account.
 */
todoListRoute.post("/", todoListAdd);

/*
 * This route makes it possible for a user to edit a todo list in their own account.
 */
todoListRoute.patch("/", todoListEdit);

/*
 * This route makes it possible for a user to delete a todo list in their own account.
 */
todoListRoute.delete("/", todoListDelete);

/*
 * This route makes it possible for a user access all their todo lists for both themselves and their verified
 * friends todo lists. The user can also access a specific todo list name and even specify which user the todo
 * list belongs to.
 */
todoListRoute.get("/", todoListGet);

exports.todoListRoute = todoListRoute;
