import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { FaUserSlash } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiLockPasswordLine, RiUserHeartLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import FriendBox from "../components/FriendBox";
import InputForm from "../components/InputForm";
import Message from "../components/Message";
import "../sass/UserSettings.scss";

export default function UserSetting() {
  const navigate = useNavigate();
  const [friendMessage, setFriendMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [originalFriends, setOriginalFriends] = useState(null);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState(null);
  const [sentFriendRequests, setSentFriendRequests] = useState(null);
  const [friendName, setFriendName] = useState("");
  const [friendNameMessage, setFriendNameMessage] = useState("");
  const [showFriendButton, setShowFriendButton] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");

  useEffect(function () {
    if (!localStorage.getItem("LoggedInUser")) {
      setOriginalFriends(false);
    } else {
      const getUsername = localStorage.getItem("LoggedInUser");
      setUsername(JSON.parse(getUsername).username);
    }

    getFriends();
  }, []);

  async function deleteUser(event) {
    let response = null;

    const confirmDelete = await Swal.fire({
      title: "Delete account?",
      text: `Are you sure you want to delete you FIX IT✓ account ${username} 😢?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (confirmDelete.isConfirmed) {
      try {
        response = await fetch(
          "http://localhost:5050/authentication/deleteUser",
          {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.status === 401) {
          setOriginalFriends(false);
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
          setOriginalFriends(false);
          return;
        }

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: responseMessage,
          });
          localStorage.removeItem("LoggedInUser");
          setOriginalFriends(false);
          navigate("/");
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
        `Deletion of FIX IT✓ account is cancelled 🥳!`,
        "error"
      );
      return;
    }
  }

  async function logout(event) {
    let response = null;

    const confirmLogout = await Swal.fire({
      title: "Logout?",
      text: `Are you sure you want to logout from FIX IT✓?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, I want to stay!",
      reverseButtons: true,
    });

    if (confirmLogout.isConfirmed) {
      try {
        response = await fetch(
          "http://localhost:5050/authentication/logoutUser",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
          }
        );
        const responseMessage = await response.text();

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: responseMessage,
          });
          localStorage.removeItem("LoggedInUser");
          setOriginalFriends(false);
          navigate("/");
          return;
        }

        if (response.status === 401) {
          setOriginalFriends(false);
          return;
        }

        if (response.status === 400) {
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
    } else {
      Swal.fire(
        "Cancelled",
        `Logout cancelled nice to have you here at FIX IT✓ 🥳!`,
        "error"
      );
      return;
    }
  }

  async function editPassword(event) {
    event.preventDefault();

    if (newPassword1 !== newPassword2) {
      return setUserMessage(
        "Passwords does not match, please change to edit account password!"
      );
    }

    let response = null;
    try {
      response = await fetch(
        "http://localhost:5050/authentication/editPassword",
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ password: newPassword1 }),
        }
      );

      if (response.status === 401) {
        setOriginalFriends(false);
        return;
      }

      if (response.status === 400) {
        const responseMessage = await response.text();
        return setUserMessage(responseMessage);
      }
    } catch (FetchError) {
      return setUserMessage(
        "Something went wrong, failed to connect to server!"
      );
    }

    try {
      if (response.status === 500) {
        return setUserMessage("Something went wrong, internal server error!");
      }

      if (response.status === 200) {
        const responseMessage = await response.text();
        return setUserMessage(responseMessage);
      }
    } catch (Error) {
      return setUserMessage("Something went wrong!");
    }
  }

  async function getFriends() {
    let response = null;
    try {
      response = await fetch("http://localhost:5050/friend", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        setOriginalFriends(false);
        return;
      }
      if (response.status === 403) {
        const responseMessage = await response.text();
        return setFriendMessage(responseMessage);
      }
      if (response.status === 400) {
        const responseMessage = await response.text();
        return setFriendMessage(responseMessage);
      }
    } catch (FetchError) {
      return setFriendMessage(
        "Something went wrong, failed to connect to server!"
      );
    }

    try {
      if (response.status === 500) {
        return setFriendMessage("Something went wrong, internal server error!");
      }

      if (response.status === 404) {
        setOriginalFriends([]);
        setReceivedFriendRequests([]);
        setSentFriendRequests([]);
        return;
      }

      if (response.status === 200) {
        const serverObject = await response.json();
        setOriginalFriends(serverObject);
        setReceivedFriendRequests(serverObject.receivedFriendRequests);
        setSentFriendRequests(serverObject.sentFriendRequests);
        return;
      }
    } catch (Error) {
      return setFriendMessage("Something went wrong!");
    }
  }

  async function findFriend(event) {
    event.preventDefault();

    if (username.toLowerCase() === friendName.toLowerCase()) {
      setFriendMessage("You can not search for yourself as a friend!");
      setShowFriendButton(false);
      return;
    }

    if (
      sentFriendRequests === "You have not sent any friend requests!" &&
      receivedFriendRequests === "You have not received any friend requests!"
    ) {
      setFriendMessage("You do not have any friends to search for!");
      setShowFriendButton(false);
      return;
    }

    let filterReceivedFriendRequests = null;
    let filterSentFriendRequests = null;

    if (friendName.length > 0) {
      try {
        filterReceivedFriendRequests =
          await originalFriends.receivedFriendRequests.filter(function (
            friend
          ) {
            return friend.friend.toLowerCase() === friendName.toLowerCase();
          });
      } catch (error) {
        filterReceivedFriendRequests = false;
      }

      try {
        filterSentFriendRequests =
          await originalFriends.sentFriendRequests.filter(function (friend) {
            return friend.friend.toLowerCase() === friendName.toLowerCase();
          });
      } catch (error) {
        filterSentFriendRequests = false;
      }

      if (!filterReceivedFriendRequests && !filterSentFriendRequests) {
        setReceivedFriendRequests("You have not received any friend requests!");
        setSentFriendRequests("You have not sent any friend requests!");
        setShowFriendButton(false);

        return;
      }

      if (
        !filterReceivedFriendRequests &&
        filterSentFriendRequests.length > 0
      ) {
        setReceivedFriendRequests("You have not received any friend requests!");
        setSentFriendRequests(filterSentFriendRequests);
        setFriendNameMessage(friendName);
        setFriendName("");
        event.target.children[0].className = "hidden";
        event.target.children[2].className = "hidden";
        setShowFriendButton(true);
        return;
      }

      if (
        filterReceivedFriendRequests.length > 0 &&
        !filterSentFriendRequests
      ) {
        setReceivedFriendRequests(filterReceivedFriendRequests);
        setSentFriendRequests("You have not sent any friend requests!");
        setFriendNameMessage(friendName);
        setFriendName("");
        event.target.children[0].className = "hidden";
        event.target.children[2].className = "hidden";
        setShowFriendButton(true);
        return;
      }
      setReceivedFriendRequests(filterReceivedFriendRequests);
      setSentFriendRequests(filterSentFriendRequests);
      setFriendNameMessage(friendName);
      setFriendName("");
      event.target.children[0].className = "hidden";
      event.target.children[2].className = "hidden";
      setShowFriendButton(true);
      return;
    }

    setFriendMessage("Please input a friend name!");
  }

  async function addFriend(event) {
    event.preventDefault();

    let response = null;
    try {
      response = await fetch(`http://localhost:5050/friend`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: newFriendName }),
      });

      if (response.status === 401) {
        setOriginalFriends(false);
        return;
      }
      if (response.status === 403) {
        const responseMessage = await response.text();
        return setFriendMessage(responseMessage);
      }

      if (response.status === 400) {
        const responseMessage = await response.text();
        return setFriendMessage(responseMessage);
      }
    } catch (FetchError) {
      return setFriendMessage(
        "Something went wrong, failed to connect to server!"
      );
    }

    try {
      if (response.status === 500) {
        return setFriendMessage("Something went wrong, internal server error!");
      }
      if (response.status === 409) {
        return setFriendMessage(
          `Todo-list "${newFriendName}" already exists, please choose another name!`
        );
      }

      if (response.status === 200) {
        const serverMessage = await response.text();
        setFriendMessage(serverMessage);
        setNewFriendName("");
        event.target.children[0].className = "hidden";
        event.target.children[2].className = "hidden";
        getFriends();
        return;
      }
    } catch (Error) {
      return setFriendMessage("Something went wrong!");
    }
  }

  if (originalFriends === null) {
    return (
      <section className="mainSection">
        <h3>Loading...</h3>{" "}
      </section>
    );
  }

  if (!originalFriends) {
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
      <h2>
        {username}'s user settings{" "}
        <span className="user logout" data-hover="Logout!" onClick={logout}>
          <MdLogout />
        </span>
        <span
          className="user delete"
          data-hover="Delete account!"
          onClick={deleteUser}
        >
          <FaUserSlash />
        </span>
      </h2>

      <div className="userInputs">
        <InputForm
          inputType1={"password"}
          autoComplete1={"new-password"}
          inputValue1={newPassword1}
          setInputValue1={setNewPassword1}
          inputIcon1={<RiLockPasswordLine />}
          inputText1={"Edit password"}
          inputValue2={newPassword2}
          setInputValue2={setNewPassword2}
          handleSubmit={editPassword}
          buttonValue={"Edit"}
        />
      </div>
      <Message
        className={"todoListMessage"}
        message={userMessage}
        setMessage={setUserMessage}
      />
      <div className="friendInputs">
        <InputForm
          inputValue1={friendName}
          setInputValue1={setFriendName}
          inputIcon1={<BsSearchHeart />}
          inputText1={"Search friend"}
          handleSubmit={findFriend}
          buttonValue={"Search"}
        />

        <InputForm
          inputType1={"text"}
          inputValue1={newFriendName}
          setInputValue1={setNewFriendName}
          inputIcon1={<RiUserHeartLine />}
          inputText1={"Add new friend"}
          handleSubmit={addFriend}
          buttonValue={"Add"}
        />
      </div>
      <Message
        className={"todoListMessage"}
        message={friendMessage}
        setMessage={setFriendMessage}
      />

      {showFriendButton ? (
        <button
          className="button"
          onClick={function (event) {
            setReceivedFriendRequests(originalFriends.receivedFriendRequests);
            setSentFriendRequests(originalFriends.sentFriendRequests);
            setFriendNameMessage("");
            setShowFriendButton(false);
          }}
        >
          Show all friend requests
        </button>
      ) : null}

      {receivedFriendRequests.length > 0 &&
      receivedFriendRequests !==
        "You have not received any friend requests!" ? (
        <>
          <h4>Your received friend requests!</h4>
          <FriendBox
            friendList={receivedFriendRequests}
            friendListFunction={getFriends}
            friendEdit={true}
          />
        </>
      ) : friendNameMessage.length > 0 ? (
        <>
          <h4>Your received friend requests!</h4>
          <h5>
            You have not received any friend requests from {friendNameMessage}!
          </h5>
        </>
      ) : (
        <>
          <h4>Your received friend requests!</h4>
          <h5>You have not received any friend requests!</h5>
        </>
      )}

      {sentFriendRequests.length > 0 &&
      sentFriendRequests !== "You have not sent any friend requests!" ? (
        <>
          <h4>Your sent friend requests!</h4>
          <FriendBox
            friendList={sentFriendRequests}
            username={username}
            friendListFunction={getFriends}
            friendDelete={true}
          />
        </>
      ) : friendNameMessage.length > 0 ? (
        <>
          <h4>Your sent friend requests!</h4>
          <h5>You have not sent any friend requests to {friendNameMessage}!</h5>
        </>
      ) : (
        <>
          <h4>Your sent friend requests!</h4>
          <h5>You have not sent any friend requests!</h5>
        </>
      )}
    </section>
  );
}
