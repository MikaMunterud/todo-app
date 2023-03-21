import { useState } from "react";
import Message from "../components/Message";
import UserForm from "../components/UserForm";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  async function register(event) {
    event.preventDefault();
    let response = null;

    if (password1 !== password2) {
      return setMessage(
        "Passwords does not match, please change to register an account!"
      );
    }

    const user = { username: username, password: password1 };

    try {
      response = await fetch("http://localhost:5050/authentication/register", {
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

      if (response.status === 409) {
        const serverMessage = await response.text();
        return setMessage(serverMessage);
      }

      if (response.status === 201) {
        const serverMessage = await response.text();
        return setMessage(serverMessage);
      }
    } catch (Error) {
      return setMessage("Something went wrong!");
    }
  }

  return (
    <section className="mainSection" id="homepage">
      <UserForm
        heading={"Register"}
        handleSubmit={register}
        username={username}
        setUsername={setUsername}
        password1={password1}
        setPassword1={setPassword1}
        password2={password2}
        setPassword2={setPassword2}
        passwordAuthentication={true}
        autoCompletePassword={"new-password"}
        buttonValue={"Register"}
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
