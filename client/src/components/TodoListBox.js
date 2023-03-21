import Swal from "sweetalert2";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { MdOutlineDelete, MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import "../sass/TodoListBox.scss";

export default function TodoListBox({ todoLists, username, todoListFunction }) {
  const deleteTodoList = async function (todoListName) {
    let response = null;

    const confirmDelete = await Swal.fire({
      title: "Delete todo list?",
      text: `Are you sure you want to delete todo list: ${todoListName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (confirmDelete.isConfirmed) {
      try {
        response = await fetch("http://localhost:5050/todoList", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name: todoListName }),
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
        `Deletion of todo list: ${todoListName} is cancelled!`,
        "error"
      );
      return;
    }
  };

  const editTodoList = async function (todoListName) {
    let response = null;

    const confirmEdit = await Swal.fire({
      title: "Edit todo list!",
      text: `Edit todo list name: ${todoListName}?`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Edit todo list",
    });

    const newTodoListName = confirmEdit.value;

    if (confirmEdit.isConfirmed) {
      try {
        response = await fetch("http://localhost:5050/todoList", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentName: todoListName,
            name: newTodoListName,
          }),
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
        if (response.status === 409) {
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
  };

  return (
    <div className="todoLists">
      <div className="todoList">
        {todoLists.map(function (todoList, index) {
          return (
            <div className="list" key={index}>
              <Link
                className="list_info"
                to={`/task/${todoList.todoList}/${todoList.user}`}
              >
                <h4>{todoList.todoList}</h4>
                <p>Total tasks: {todoList.taskCount}</p>
                <p>Owner: {todoList.user}</p>
              </Link>
              <div className="links">
                {todoList.user === username ? (
                  <>
                    <MdOutlineDelete
                      className="link delete"
                      onClick={function () {
                        deleteTodoList(todoList.todoList);
                      }}
                    />
                    <MdOutlineSettings
                      className="link edit"
                      onClick={function () {
                        editTodoList(todoList.todoList);
                      }}
                    />
                  </>
                ) : (
                  <Link
                    className="link"
                    to={`/task/${todoList.todoList}/${todoList.user}`}
                  >
                    {<IoIosArrowDroprightCircle />}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
