import { useEffect, useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import Message from "./Message";
import "../sass/InputForm.scss";

export default function InputForm({
  inputValue1,
  inputType1,
  setInputValue1,
  inputIcon1,
  autoComplete1,
  inputText1,
  inputValue2,
  inputType2,
  setInputValue2,
  inputIcon2,
  inputText2,
  handleSubmit,
  message,
  setMessage,
  buttonValue,
}) {
  const [searchInput1, setSearchInput1] = useState("hidden");
  const [searchInput2, setSearchInput2] = useState("hidden");
  const [searchButton, setSearchButton] = useState("hidden");
  const [inputTypePassword1, setInputTypePassword1] = useState("password");
  const [inputTypePassword2, setInputTypePassword2] = useState("password");

  useEffect(
    function () {
      if (searchInput1 === "visible" || searchInput2 === "visible") {
        setSearchButton("visible");
      } else {
        setSearchButton("hidden");
      }
    },
    [searchInput1, searchInput2]
  );

  return (
    <>
      <form className="searchBoxes" onSubmit={handleSubmit}>
        {autoComplete1 === "new-password" ? (
          <>
            <input
              className={searchInput1}
              type={inputTypePassword1}
              placeholder={"New password"}
              autoComplete={autoComplete1}
              value={inputValue1}
              onChange={function (event) {
                setInputValue1(event.target.value);
              }}
            />
            {inputTypePassword1 === "password" ? (
              <span className={`passwordEye ${searchInput1}`}>
                <BsFillEyeFill
                  className="passwordEye_icon"
                  onMouseDown={function () {
                    setInputTypePassword1("text");
                  }}
                />
              </span>
            ) : (
              <span className={`passwordEye ${searchInput1}`}>
                <BsFillEyeSlashFill
                  className="passwordEye_icon"
                  onMouseUp={function () {
                    setInputTypePassword1("password");
                  }}
                />
              </span>
            )}
            <input
              className={searchInput1}
              type={inputTypePassword2}
              placeholder={"Confirm password"}
              autoComplete={autoComplete1}
              value={inputValue2}
              onChange={function (event) {
                setInputValue1(event.target.value);
              }}
            />

            {inputTypePassword2 === "password" ? (
              <span className={`passwordEye ${searchInput1}`}>
                <BsFillEyeFill
                  className="passwordEye_icon"
                  onMouseDown={function () {
                    setInputTypePassword2("text");
                  }}
                />
              </span>
            ) : (
              <span className={`passwordEye ${searchInput1}`}>
                <BsFillEyeSlashFill
                  className="passwordEye_icon"
                  onMouseUp={function () {
                    setInputTypePassword2("password");
                  }}
                />
              </span>
            )}
            <div className="searchIcon">
              <span
                className="searchIcon_symbol"
                data-hover={inputText1}
                onClick={function (event) {
                  if (searchInput1 === "hidden") {
                    setSearchInput1("visible");
                  } else {
                    setSearchInput1("hidden");
                  }
                }}
              >
                {inputIcon1}
              </span>
            </div>
          </>
        ) : (
          <>
            <input
              className={searchInput1}
              type={inputType1}
              placeholder={inputText1}
              autoComplete={autoComplete1}
              value={inputValue1}
              onChange={function (event) {
                setInputValue1(event.target.value);
              }}
            />
            <div className="searchIcon">
              <span
                className="searchIcon_symbol"
                data-hover={inputText1}
                onClick={function (event) {
                  if (searchInput1 === "hidden") {
                    setSearchInput1("visible");
                  } else {
                    setSearchInput1("hidden");
                  }
                }}
              >
                {inputIcon1}
              </span>
            </div>
          </>
        )}

        {inputIcon2 && (
          <>
            <input
              className={searchInput2}
              type={inputType2}
              placeholder={inputText2}
              value={inputValue2}
              onChange={function (event) {
                setInputValue2(event.target.value);
              }}
            />
            <div className="searchIcon">
              <span
                className="searchIcon_symbol"
                data-hover={inputText2}
                onClick={function (event) {
                  if (searchInput2 === "hidden") {
                    setSearchInput2("visible");
                  } else {
                    setSearchInput2("hidden");
                  }
                }}
              >
                {inputIcon2}
              </span>
            </div>
          </>
        )}
        {searchButton === "visible" ? (
          <input
            className={searchButton}
            id="searchButton"
            type="submit"
            value={buttonValue}
          />
        ) : null}
      </form>

      {message && (
        <Message
          className={"todoListMessage"}
          message={message}
          setMessage={setMessage}
        />
      )}
    </>
  );
}
