const express = require("express");
const { friendAdd } = require("../controllers/friendController/friendAdd");
const {
  friendApprove,
} = require("../controllers/friendController/friendApprove");
const {
  friendDelete,
} = require("../controllers/friendController/friendDelete");
const { friendGet } = require("../controllers/friendController/friendGet");

const friendRoute = express.Router();

/*
 * This route makes it possible for a user to add a friend.
 */
friendRoute.post("/", friendAdd);

/*
 * This route makes it possible for a user to approve or reject a friend request.
 */
friendRoute.patch("/", friendApprove);

/*
 * This route makes it possible for a user to delete a friend.
 */
friendRoute.delete("/", friendDelete);

/*
 * This route makes it possible for a user access all friend requests and the friend request status.
 * the user can access both the requests the user have sent themselves and the requests they have received.
 */
friendRoute.get("/", friendGet);

exports.friendRoute = friendRoute;
