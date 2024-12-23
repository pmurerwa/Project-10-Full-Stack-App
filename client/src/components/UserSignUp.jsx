import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/apiHelper";
import ErrorsDisplay from "./ErrorsDisplay";

const UserSignUp = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  // Correctly consuming the UserContext to access actions
  const { actions } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newUser = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      emailAddress: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await api("/users", "POST", newUser);
      if (response.status === 201) {
        console.log(`Succesfully signed up and autheniticated`);

        const signInResponse = await actions.signIn(user);
        if (signInResponse) {
          navigate("/");
        } else {
          setErrors([
            "Sign up was successful but login failed. Please login using your credentials.",
          ]);
        }
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 500) {
        navigate("/error"); // Redirect on server error
      } else {
        throw new Error("Failed Sign-In");
      }
    } catch (error) {
      console.log(error);
      navigate("/error"); // Navigate to error route
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
      <ErrorsDisplay errors={errors} />
      <form>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" name="firstName" type="text" ref={firstName} />
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" type="text" ref={lastName} />
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          ref={emailAddress}
        />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" ref={password} />
        <button className="button" onClick={handleSubmit}>
          Sign Up
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
      <p>
        Already have a user account? Click here to{" "}
        <Link to="/signin">sign in</Link>!
      </p>
    </div>
  );
};

export default UserSignUp;
