import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import "../sass/Homepage.scss";
import UserForm from "../components/UserForm";

export default function Homepage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    let response = null;
    const user = { username, password };

    try {
      response = await fetch("http://localhost:5050/authentication/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (response.status === 400) {
        const serverMessage = await response.text();
        return setMessage(serverMessage);
      }
    } catch (FetchError) {
      return setMessage("Something went wrong, failed to connect to server!");
    }

    try {
      if (response.status === 500) {
        return setMessage("Something went wrong, internal server error!");
      }

      if (response.status === 404) {
        return setMessage(
          "Invalid credentials, please double check the username and password!"
        );
      }

      if (response.status === 200) {
        const serverObject = await response.json();

        if (!localStorage.getItem("LoggedInUser")) {
          localStorage.setItem("LoggedInUser", JSON.stringify(serverObject));
        } else {
          localStorage.setItem("LoggedInUser", JSON.stringify(serverObject));
        }
        navigate("/todoLists");
      }
    } catch (Error) {
      return setMessage("Something went wrong!");
    }
  }

  return (
    <section className="mainSection" id="homepage">
      <UserForm
        heading={"Login"}
        handleSubmit={login}
        username={username}
        setUsername={setUsername}
        password1={password}
        setPassword1={setPassword}
        autoCompletePassword={"current-password"}
        buttonValue={"Login"}
      />
      {message && (
        <Message
          className="homepageMessage"
          message={message}
          setMessage={setMessage}
        />
      )}
    </section>
  );
}
