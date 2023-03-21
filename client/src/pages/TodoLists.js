import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BsSearchHeart } from "react-icons/bs";
import { RiUserHeartLine } from "react-icons/ri";
import { MdLibraryAdd } from "react-icons/md";
import "../sass/TodoLists.scss";
import TodoListBox from "../components/TodoListBox";
import InputForm from "../components/InputForm";

export default function TodoLists() {
  const [username, setUsername] = useState("");
  const [todoLists, setTodoLists] = useState(null);
  const [originalTodoLists, setOriginalTodoLists] = useState(null);
  const [message, setMessage] = useState("");
  const [addTodoListMessage, setAddTodoListMessage] = useState("");
  const [todoListName, setTodoListName] = useState("");
  const [newTodoListName, setNewTodoListName] = useState("");
  const [todoListUsername, setTodoListUsername] = useState("");

  useEffect(function () {
    if (!localStorage.getItem("LoggedInUser")) {
      setOriginalTodoLists(false);
    } else {
      const getUsername = localStorage.getItem("LoggedInUser");
      setUsername(JSON.parse(getUsername).username);
    }

    getTodoLists();
  }, []);

  async function getTodoLists() {
    let response = null;
    try {
      response = await fetch("http://localhost:5050/todoList", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        setOriginalTodoLists(false);
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
        setOriginalTodoLists([]);
        return;
      }

      if (response.status === 200) {
        const serverObject = await response.json();
        setTodoLists(serverObject);
        setOriginalTodoLists(serverObject);
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

  async function findTodoList(event) {
    event.preventDefault();
    let filterTodoList = null;

    if (todoListName.length > 0 && todoListUsername.length > 0) {
      filterTodoList = await originalTodoLists.filter(function (todoList) {
        return (
          todoList.todoList.toLowerCase() === todoListName.toLowerCase() &&
          todoList.user.toLowerCase() === todoListUsername.toLowerCase()
        );
      });
      if (filterTodoList.length === 0) {
        setTodoLists([]);
        setMessage(
          `Todo-list: "${todoListName}" does not exists for username: "${todoListUsername}", please try another name!`
        );
        return;
      }
      event.target.children[0].className = "hidden";
      event.target.children[2].className = "hidden";
      event.target.children[4].className = "hidden";

      setTodoListUsername("");
      setTodoListName("");
      return setTodoLists(filterTodoList);
    }

    if (todoListName.length > 0 && todoListUsername.length === 0) {
      filterTodoList = await originalTodoLists.filter(function (todoList) {
        return todoList.todoList.toLowerCase() === todoListName.toLowerCase();
      });

      if (filterTodoList.length === 0) {
        setTodoLists([]);
        setMessage(
          `Todo-list: "${todoListName}" does not exist, please try another name!`
        );
        return;
      }
      event.target.children[0].className = "hidden";
      event.target.children[4].className = "hidden";

      setTodoListName("");
      return setTodoLists(filterTodoList);
    }

    if (todoListName.length === 0 && todoListUsername.length > 0) {
      filterTodoList = await originalTodoLists.filter(function (todoList) {
        return todoList.user.toLowerCase() === todoListUsername.toLowerCase();
      });

      if (filterTodoList.length === 0) {
        setTodoLists([]);
        setMessage(
          `Either "${todoListUsername}" does not have any todo lists or you do not have access to their todo lists, please try another name!`
        );
        return;
      }
      event.target.children[2].className = "hidden";
      event.target.children[4].className = "hidden";

      setTodoListUsername("");
      return setTodoLists(filterTodoList);
    }

    setMessage("Please input Todo list name or Username!");
  }

  async function addTodoList(event) {
    event.preventDefault();

    let response = null;
    try {
      response = await fetch(`http://localhost:5050/todoList/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: newTodoListName.trim() }),
      });

      if (response.status === 401) {
        setTodoLists(false);
        return;
      }
    } catch (FetchError) {
      return setAddTodoListMessage(
        "Something went wrong, failed to connect to server!"
      );
    }

    try {
      if (response.status === 500) {
        return setAddTodoListMessage(
          "Something went wrong, internal server error!"
        );
      }
      if (response.status === 409) {
        return setAddTodoListMessage(
          `Todo-list "${newTodoListName}" already exists, please choose another name!`
        );
      }

      if (response.status === 404) {
        const responseMessage = await response.text();
        return setAddTodoListMessage(responseMessage);
      }

      if (response.status === 400) {
        const responseMessage = await response.text();
        return setAddTodoListMessage(responseMessage);
      }

      if (response.status === 201) {
        const serverMessage = await response.text();
        setAddTodoListMessage(serverMessage);
        event.target.children[0].className = "hidden";
        event.target.children[2].className = "hidden";
        setNewTodoListName("");
        return getTodoLists();
      }
    } catch (Error) {
      return setAddTodoListMessage("Something went wrong!");
    }
  }

  if (originalTodoLists === null) {
    return (
      <section className="mainSection">
        <h3>Loading...</h3>
      </section>
    );
  }

  if (!originalTodoLists) {
    return (
      <section className="mainSection">
        <h2>Please login to access account settings!</h2>
        <h3>
          <Link to={"/"}>Go back to homepage!</Link>
        </h3>
      </section>
    );
  }

  return (
    <section className="mainSection">
      <h2>Welcome {username} to FIX IT✓</h2>

      <InputForm
        inputType1={"search"}
        inputValue1={todoListName}
        setInputValue1={setTodoListName}
        inputIcon1={<BsSearchHeart />}
        inputText1={"Search todo list name"}
        inputType2={"search"}
        inputValue2={todoListUsername}
        setInputValue2={setTodoListUsername}
        inputIcon2={<RiUserHeartLine />}
        inputText2={"Search username"}
        handleSubmit={findTodoList}
        message={message}
        setMessage={setMessage}
        buttonValue={"Search"}
      />

      {todoLists !== originalTodoLists && originalTodoLists.length > 0 ? (
        <button
          className="button"
          onClick={function (event) {
            setTodoLists(originalTodoLists);
          }}
        >
          Show all todo lists
        </button>
      ) : null}

      <InputForm
        inputType1={"text"}
        inputValue1={newTodoListName}
        setInputValue1={setNewTodoListName}
        inputIcon1={<MdLibraryAdd />}
        inputText1={"Add todo list"}
        handleSubmit={addTodoList}
        message={addTodoListMessage}
        setMessage={setAddTodoListMessage}
        buttonValue={"Add todo list"}
      />
      <h3>Todo lists</h3>
      {originalTodoLists.length > 0 ? (
        <TodoListBox
          username={username}
          todoLists={todoLists}
          todoListFunction={getTodoLists}
        />
      ) : (
        <h4>You do not have any todo-lists registered on your account!</h4>
      )}
    </section>
  );
}
