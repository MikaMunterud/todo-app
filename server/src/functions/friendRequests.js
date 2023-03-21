/*
 * This function creates two different arrays to store the users different type of friend requests.
 * One array containing the friend requests the user has sent themselves and one array containing the
 * friend requests the user has received.
 */
exports.friendRequests = function (friends, username) {
  const sentFriendRequests = [];
  const receivedFriendRequests = [];

  /*
   * This loop goes through the whole query 'result'.
   */
  friends.forEach(function (friend) {
    /*
     * If the username match the current user all friend objects will be pushed into the array sentFriendRequests.
     */
    if (friend.user === username) {
      if (friend.message === null) {
        friend.message = "User has not yet answered your friend request!";
      }

      const friendName = friend.friend;
      const { verified, message } = friend;

      const friendObject = {
        friend: friendName,
        verified: verified,
        message: message,
      };

      sentFriendRequests.push(friendObject);
    }
    /*
     * If the username match the current user all friend objects will be pushed into the array receivedFriendRequests.
     */
    if (friend.friend === username) {
      if (friend.message === null) {
        friend.message = "You have not yet answered their friend request!";
      }

      const friendName = friend.user;
      const { verified, message } = friend;

      const friendObject = {
        friend: friendName,
        verified: verified,
        message: message,
      };
      receivedFriendRequests.push(friendObject);
    }
  });
  /*
   * This checks wether the arrays sentFriendRequests and receivedFriendRequests contain any data.
   * Depending of the result different types of objects will be returned.
   */
  if (sentFriendRequests.length > 0 && receivedFriendRequests.length > 0) {
    return {
      sentFriendRequests: sentFriendRequests,
      receivedFriendRequests: receivedFriendRequests,
    };
  }

  if (sentFriendRequests.length === 0 && receivedFriendRequests.length > 0) {
    return {
      sentFriendRequests: "You have not sent any friend requests!",
      receivedFriendRequests: receivedFriendRequests,
    };
  }

  if (sentFriendRequests.length > 0 && receivedFriendRequests.length === 0) {
    return {
      sentFriendRequests: sentFriendRequests,
      receivedFriendRequests: "You have not received any friend requests!",
    };
  }
};
