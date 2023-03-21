/*
 * This function creates an object to store all todo lists and the associated tasks.
 */
exports.groupTasksByList = function (tasks) {
  const array = {};

  /*
   * This goes through the whole query 'tasks'.
   */
  tasks.forEach(function (task, index) {
    const { todoListName, description, done, user } = task;

    /*
     * If the user does not exists in the object todoLists, it will be created.
     */
    if (!array[user]) {
      array[user] = {};
    }

    /*
     * If the todo list does not exists for a user, it will be created, along with an array for the
     * todo lists associated tasks.
     */

    if (!array[user][todoListName]) {
      array[user][todoListName] = {
        tasks: [],
      };
    }

    /*
     * This adds all the tasks into to the associated user and todo list.
     */

    array[user][todoListName].tasks.push({
      description: description,
      done: done,
    });
  });

  /*
   * When it is done the new todoLists array will be returned.
   */

  return array;
};
