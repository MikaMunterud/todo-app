import { useEffect, useState } from "react";
import { MdLibraryAdd } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import InputForm from "../components/InputForm";
import TaskBox from "../components/TaskBox";

export default function Tasks() {
  const { todoListName, username } = useParams();
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [todoList, setTodoList] = useState(null);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskMessage, setNewTaskMessage] = useState("");

  useEffect(function () {
    const getUsername = localStorage.getItem("LoggedInUser");
    setLoggedInUsername(JSON.parse(getUsername).username);

    getTasks();
  }, []);

  async function getTasks() {
    let response = null;
    try {
      response = await fetch(
        `http://localhost:5050/task/${todoListName}/${username}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status === 401) {
        setTodoList(false);
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
    } catch (FetchError) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong, failed to connect to server!",
      });
      return;
    }

    try {
      if (response.status === 500) {
        Swal.fire({
          icon: "error",
          text: "Something went wrong, internal server error!",
        });
        return;
      }

      if (response.status === 404) {
        setTodoList([]);
        return;
      }

      if (response.status === 200) {
        const serverObject = await response.json();
        setTodoList(serverObject);
        return;
      }
    } catch (Error) {
      const error = Swal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
      return;
    }
  }

  async function addTask(event) {
    event.preventDefault();
    let response = null;
    let newTaskObject = null;

    if (loggedInUsername === username) {
      newTaskObject = {
        todoListName: todoListName,
        description: newTaskDescription.trim(),
      };
    } else {
      newTaskObject = {
        todoListName: todoListName,
        description: newTaskDescription.trim(),
        friend: username,
      };
    }

    try {
      response = await fetch("http://localhost:5050/task", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newTaskObject),
      });

      if (response.status === 401) {
        setTodoList(false);
        return;
      }
      if (response.status === 400) {
        const responseMessage = await response.text();
        return setNewTaskMessage(responseMessage);
      }
    } catch (FetchError) {
      return setNewTaskMessage(
        "Something went wrong, failed to connect to server!"
      );
    }

    try {
      if (response.status === 500) {
        return setNewTaskMessage(
          "Something went wrong, internal server error!"
        );
      }
      if (response.status === 409) {
        return setNewTaskMessage(
          `Todo-list "${newTaskDescription}" already exists, please choose another name!`
        );
      }

      if (response.status === 404) {
        const responseMessage = await response.text();
        return setNewTaskMessage(responseMessage);
      }

      if (response.status === 201) {
        const serverMessage = await response.text();
        setNewTaskMessage(serverMessage);
        event.target.children[0].className = "hidden";
        event.target.children[2].className = "hidden";
        setNewTaskDescription("");
        return getTasks();
      }
    } catch (Error) {
      return setNewTaskMessage("Something went wrong!");
    }
  }

  if (todoList === null) {
    return (
      <section className="mainSection">
        <h3>Loading...</h3>{" "}
      </section>
    );
  }

  if (!todoList) {
    return (
      <section className="mainSection">
        <h2>Please login to access account settings!</h2>
        <h3>
          <Link to={"/"}>Go back to homepage!</Link>
        </h3>
      </section>
    );
  }

  if (todoList.length === 0) {
    return (
      <section className="mainSection">
        <h3>Todo list could not be found...</h3>{" "}
      </section>
    );
  }

  return (
    <section className="mainSection">
      <h2>
        {username}'s todo list {todoListName}
      </h2>

      <InputForm
        inputValue1={newTaskDescription}
        setInputValue1={setNewTaskDescription}
        inputIcon1={<MdLibraryAdd />}
        inputText1={"Add new task"}
        handleSubmit={addTask}
        message={newTaskMessage}
        setMessage={setNewTaskMessage}
        buttonValue={"Add task"}
      />

      {todoList[username][todoListName].tasks.length > 0 &&
      todoList[username][todoListName].tasks[0].description !==
        "no task registered" ? (
        <>
          <h3>Tasks</h3>
          <TaskBox
            taskList={todoList[username][todoListName].tasks}
            todoListFunction={getTasks}
          />
        </>
      ) : (
        <>
          <h3>Tasks</h3>
          <h4>This todo list does not have any tasks registered!</h4>
        </>
      )}
    </section>
  );
}
