import Swal from "sweetalert2";
import { MdOutlineDelete, MdOutlineSettings } from "react-icons/md";
import "../sass/TaskBox.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TaskBox({ taskList, todoListFunction }) {
  const { todoListName, username } = useParams();
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(function () {
    const getUsername = localStorage.getItem("LoggedInUser");
    setLoggedInUsername(JSON.parse(getUsername).username);
  }, []);

  async function deleteTask(taskDescription) {
    let response = null;
    let newTaskObject = null;

    const confirmDelete = await Swal.fire({
      title: "Delete task?",
      text: `Are you sure you want to delete task: ${taskDescription}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (loggedInUsername === username) {
      newTaskObject = {
        todoListName: todoListName,
        description: taskDescription,
      };
    } else {
      newTaskObject = {
        todoListName: todoListName,
        description: taskDescription,
        friend: username,
      };
    }

    if (confirmDelete.isConfirmed) {
      try {
        response = await fetch("http://localhost:5050/task", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newTaskObject),
        });

        if (response.status === 400) {
          const responseMessage = await response.text();
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }
      } catch (FetchError) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong, failed to connect to server!",
        });
        return;
      }

      const responseMessage = await response.text();

      try {
        if (response.status === 500) {
          Swal.fire({
            icon: "error",
            text: "Something went wrong, internal server error!",
          });
          return;
        }

        if (response.status === 404) {
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: responseMessage,
          });
          todoListFunction();
          return;
        }
      } catch (Error) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong!",
        });
        return;
      }
    } else {
      Swal.fire(
        "Cancelled",
        `Deletion of task: ${taskDescription} is cancelled!`,
        "error"
      );
      return;
    }
  }

  async function editTaskDescription(taskDescription) {
    let response = null;
    let newTaskObject = null;

    const confirmEdit = await Swal.fire({
      title: "Edit task!",
      text: `Edit task description: ${taskDescription}?`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Edit todo list",
    });

    const newTaskDescription = confirmEdit.value;

    if (loggedInUsername === username) {
      newTaskObject = {
        todoListName: todoListName,
        currentDescription: taskDescription,
        newDescription: newTaskDescription,
      };
    } else {
      newTaskObject = {
        todoListName: todoListName,
        currentDescription: taskDescription,
        newDescription: newTaskDescription,
        friend: username,
      };
    }

    if (confirmEdit.isConfirmed) {
      try {
        response = await fetch("http://localhost:5050/task/description", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newTaskObject),
        });

        if (response.status === 401) {
          return;
        }

        if (response.status === 400) {
          const responseMessage = await response.text();
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }
        if (response.status === 409) {
          const responseMessage = await response.text();
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }
      } catch (FetchError) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong, failed to connect to server!",
        });
        return;
      }

      const responseMessage = await response.text();

      try {
        if (response.status === 500) {
          Swal.fire({
            icon: "error",
            text: "Something went wrong, internal server error!",
          });
          return;
        }

        if (response.status === 409) {
          const responseMessage = await response.text();
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }

        if (response.status === 404) {
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: responseMessage,
          });
          todoListFunction();
          return;
        }
      } catch (Error) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong!",
        });
        return;
      }
    }
  }

  async function editTaskDone(taskDescription, taskDone) {
    let response = null;
    let newTaskObject = null;
    let taskDoneAttribute = null;

    if (taskDone === 0) {
      taskDoneAttribute = true;
    } else {
      taskDoneAttribute = false;
    }

    if (loggedInUsername === username) {
      newTaskObject = {
        todoListName: todoListName,
        currentDescription: taskDescription,
        done: taskDoneAttribute,
      };
    } else {
      newTaskObject = {
        todoListName: todoListName,
        currentDescription: taskDescription,
        done: taskDoneAttribute,
        friend: username,
      };
    }

    try {
      response = await fetch("http://localhost:5050/task/done", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newTaskObject),
      });

      if (response.status === 400) {
        const responseMessage = await response.text();
        Swal.fire({
          icon: "error",
          text: responseMessage,
        });
        return;
      }
      if (response.status === 409) {
        const responseMessage = await response.text();
        Swal.fire({
          icon: "error",
          text: responseMessage,
        });
        return;
      }
    } catch (FetchError) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong, failed to connect to server!",
      });
      return;
    }

    const responseMessage = await response.text();

    try {
      if (response.status === 500) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong, internal server error!",
        });
        return;
      }

      if (response.status === 404) {
        Swal.fire({
          icon: "error",
          text: responseMessage,
        });
        return;
      }

      if (response.status === 200) {
        todoListFunction();
        return;
      }
    } catch (Error) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
      return;
    }
  }

  return (
    <div className="taskLists">
      <div className="taskList">
        {taskList.map(function (taskList, index) {
          return (
            <div className="list" key={index}>
              <p className="description">{taskList.description}</p>

              <div className="symbols">
                <input
                  className="checkbox"
                  type={"checkbox"}
                  checked={taskList.done}
                  onChange={function () {
                    editTaskDone(taskList.description, taskList.done);
                  }}
                />

                <MdOutlineSettings
                  className="icon edit"
                  onClick={function () {
                    editTaskDescription(taskList.description);
                  }}
                />

                <MdOutlineDelete
                  className="icon delete"
                  onClick={function () {
                    deleteTask(taskList.description);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
