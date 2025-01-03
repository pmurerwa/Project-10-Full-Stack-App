//UserSignIn.jsx
import { useContext, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ErrorsDisplay from "./ErrorsDisplay";

// Component for user sign-in functionality
const UserSignIn = () => {
  const emailAddress = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

  const { actions } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const from = location.state?.from || "/"; // Determines the path to navigate after sign-in
    const credentials = {
      emailAddress: emailAddress.current.value, // Access the email input's value
      password: password.current.value  // Access the password input's value
    };

    // Attempt to sign in with provided credentials
    try {
      const user = await actions.signIn(credentials);
      if (user) {
        navigate(from); // Navigate to the previous page or home '/'
      } else {
        setErrors(["Sign-in was unsuccessful, verify your email/password"]);
      }
    } catch {
      navigate("/error"); // Navigate to error page on exceptions
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div className="form--centered">
      <h2>Sign In</h2>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress" 
          type="email" 
          ref={emailAddress} />
        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          ref={password} />
        <button className="button" type="submit">Sign In</button>
        <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
      </form>
      <p>Do not have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
    </div>
  );
};

export default UserSignIn;