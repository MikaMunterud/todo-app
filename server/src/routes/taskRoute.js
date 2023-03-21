const express = require("express");

const { taskAdd } = require("../controllers/taskController/taskAdd");
const { taskDelete } = require("../controllers/taskController/taskDelete");
const {
  taskEditDescription,
} = require("../controllers/taskController/taskEditDescription");
const { taskEditDone } = require("../controllers/taskController/taskEditDone");
const { taskGet } = require("../controllers/taskController/taskGet");

const taskRoute = express.Router();

/*
 * This route makes it possible for a user to add a task into their own todo lists or into a
 * verified friends todo lists.
 */
taskRoute.post("/", taskAdd);

/*
 * This route makes it possible for a user to edit a task in their own todo lists or edit a task
 * in a verified friends todo lists.
 */
taskRoute.patch("/description", taskEditDescription);

taskRoute.patch("/done", taskEditDone);

/*
 * This route makes it possible for a user to delete a task in their own todo lists or delete a task
 * in a verified friends todo lists.
 */
taskRoute.delete("/", taskDelete);

/*
 * This route makes it possible for a user access all their todo lists and the associated tasks for both
 * themselves and their verified friends todo lists. The user can also access the tasks of a specific todo
 * list name and even specify which user the todo list belongs to.
 */
taskRoute.get("/:todoListName/:username", taskGet);

exports.taskRoute = taskRoute;
