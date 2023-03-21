import Swal from "sweetalert2";
import { MdOutlineDelete, MdOutlineSettings } from "react-icons/md";
import "../sass/FriendBox.scss";

export default function FriendBox({
  friendList,
  friendListFunction,
  friendEdit,
  friendDelete,
}) {
  const deleteFriend = async function (friendName) {
    let response = null;

    const confirmDelete = await Swal.fire({
      title: "Remove friend?",
      text: `Are you sure you want to remove ${friendName} from your friend list?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove friend!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (confirmDelete.isConfirmed) {
      try {
        response = await fetch("http://localhost:5050/friend", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: friendName }),
        });

        if (response.status === 400) {
          const responseMessage = await response.text();
          Swal.fire({
            icon: "error",
            text: responseMessage,
          });
          return;
        }
        if (response.status === 403) {
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
          friendListFunction();
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
        `Deletion of friend: ${friendName} is cancelled!`,
        "error"
      );
      return;
    }
  };

  const editFriend = async function (friendName) {
    let response = null;
    let friendRequest = null;

    const confirmEdit = await Swal.fire({
      title: "Confirm friend request!",
      text: `Do you approve ${friendName}'s friend request?`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, approve!",
      denyButtonText: "No, reject!",
      reverseButtons: true,
    });

    if (confirmEdit.isConfirmed) {
      friendRequest = "approved";
    }
    if (confirmEdit.isDenied) {
      friendRequest = "rejected";
    }
    if (confirmEdit.isDismissed) {
      Swal.fire(
        "Cancelled",
        `${friendName}'s friend request has not been changed!`,
        "error"
      );
      return;
    }

    try {
      response = await fetch("http://localhost:5050/friend", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          friend: friendName,
          message: friendRequest,
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
      if (response.status === 403) {
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
        friendListFunction();
        return;
      }
    } catch (Error) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong!",
      });
      return;
    }
  };

  return (
    <div className="friendRequests">
      <ul className="friendRequest">
        {friendList.map(function (friend, index) {
          return (
            <li className="list" key={index}>
              <h5 className="heading">
                To friend:
                <span>{friend.friend}</span>
                {friendDelete ? (
                  <MdOutlineDelete
                    className="link delete"
                    onClick={function () {
                      deleteFriend(friend.friend);
                    }}
                  />
                ) : null}
                {friendEdit ? (
                  <MdOutlineSettings
                    className="link edit"
                    onClick={function () {
                      editFriend(friend.friend);
                    }}
                  />
                ) : null}
              </h5>

              <p>
                <strong>Is verified: </strong> {friend.verified}
              </p>

              <p>
                <strong>Message: </strong> {friend.message}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
