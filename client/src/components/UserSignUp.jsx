//UserSignUp.jsx
import { useContext, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/apiHelper";
import ErrorsDisplay from "./ErrorsDisplay";

// Component for user sign-up functionality
const UserSignUp = () => {
  // References to input fields
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  
  const navigate = useNavigate();   // Hook for navigation
  const [errors, setErrors] = useState([]);  // State to store errors
  
  const { actions } = useContext(UserContext); // Get actions (e.g., signIn) from UserContext
  
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create new user object from form inputs
    const newUser = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      emailAddress: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      // Send new user data to the server
      const response = await api("/users", "POST", newUser);
      if (response.status === 201) {
        console.log(`Successfully signed up and authenticated`);
        
        // Attempt to sign in the new user
        const signInResponse = await actions.signIn(newUser);
        if (signInResponse) { // Navigate to home page on successful sign-in
          navigate("/");
        } else { // If sign-in fails, display an error message
          setErrors([
            "Sign up was successful but login failed. Please log in using your credentials.",
          ]);
        }
      } else if (response.status === 400) { // If there's a validation issue, display error messages
        const data = await response.json();
        console.log('ade data', data)
        setErrors(data.errors);
      } else if (response.status === 500) { // Navigate to error page on server error
        navigate("/error");
      } else { // Throw an error for any other response status
        throw new Error("Failed Sign-In");
      }
    } catch { // Navigate to error page if fetch request fails
      navigate("/error");
    }
  };

  // Function to handle form cancellation
  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/"); 
  };

  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" name="firstName" type="text" ref={firstNameRef} />
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" type="text" ref={lastNameRef} />
        <label htmlFor="emailAddress">Email Address</label>
        <input id="emailAddress" name="emailAddress" type="email" ref={emailRef} />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" ref={passwordRef} />
        <button className="button" type="submit">Sign Up</button>
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