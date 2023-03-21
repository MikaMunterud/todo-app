import { useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../sass/UserForm.scss";

export default function UserForm({
  heading,
  handleSubmit,
  username,
  setUsername,
  password1,
  setPassword1,
  password2,
  setPassword2,
  autoCompletePassword,
  buttonValue,
  passwordAuthentication,
}) {
  const [inputType1, setInputType1] = useState("password");
  const [inputType2, setInputType2] = useState("password");

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form_heading">{heading}</h2>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={function (event) {
          setUsername(event.target.value);
        }}
        required
      />
      <div className="inputPasswordRow">
        <label htmlFor="password1">Password:</label>

        {inputType1 === "password" ? (
          <BsFillEyeFill
            onMouseDown={function () {
              setInputType1("text");
            }}
          />
        ) : (
          <BsFillEyeSlashFill
            onMouseUp={function () {
              setInputType1("password");
            }}
          />
        )}
      </div>

      <input
        id="password1"
        type={inputType1}
        placeholder="Password"
        autoComplete={autoCompletePassword}
        value={password1}
        onChange={function (event) {
          setPassword1(event.target.value);
        }}
        required
      />

      {passwordAuthentication && (
        <>
          <div className="inputPasswordRow">
            <label htmlFor="password2">Confirm Password:</label>

            {inputType2 === "password" ? (
              <BsFillEyeFill
                onMouseDown={function () {
                  setInputType2("text");
                }}
              />
            ) : (
              <BsFillEyeSlashFill
                onMouseUp={function () {
                  setInputType2("password");
                }}
              />
            )}
          </div>

          <input
            id="password2"
            type={inputType2}
            placeholder="Confirm password"
            autoComplete={autoCompletePassword}
            value={password2}
            onChange={function (event) {
              setPassword2(event.target.value);
            }}
            required
          />
        </>
      )}
      <input type="submit" className="submitButton" value={buttonValue} />
      {buttonValue === "Login" ? (
        <p className="link">
          <strong>Don't have a FIX IT✓ account?</strong>{" "}
          <Link to={"/register"}>Register here!</Link>
        </p>
      ) : (
        <p className="link">
          <strong>Already have a FIX IT✓ account?</strong>{" "}
          <Link to={"/"}>Login here!</Link>
        </p>
      )}
    </form>
  );
}
