import { createContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";


export const UserContext = createContext(); // Create the UserContext to be used for sharing user authentication state across components

export const UserProvider = ({ children }) => { // Create provider component to wrap the app and provide user context
  const [authUser, setAuthUser] = useState(null);   // State to hold the authenticated user information

  const signInUser = async (username, password) => {
    try {
      const encodedCredentials = btoa(`${username}:${password}`);       // Encode the username and password for Basic Auth
      const options = { // Set the request options for the API call
        url: "http://localhost:5000/api/users",
        method: "GET",
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      };
      console.log("Authorization Header:", options.headers.Authorization); // Log the Authorization header for debugging purposes
      
      const response = await axios(options); // Make the API request to get user data
      
      // If the request is successful (status 200), set the user and return it
      if (response.status === 200) {
        const user = response.data;
        user.authToken = encodedCredentials;// Add the auth token to the user object
        setAuthUser(user);   // Update the authUser state
        axios.defaults.headers.common['Authorization'] = `Basic ${encodedCredentials}`; // Set default authorization header for all future axios requests
        
        return user;
      }
    } catch (error) {
      console.error("Sign in failed", error);
      return null;
    }
  };

  const signOutUser = () => {
    
    setAuthUser(null); // Clear the authUser state
    delete axios.defaults.headers.common['Authorization']; // Remove the authorization header from future requests
  };

  // Provide the authUser and actions to the rest of the application via context
  return (
    <UserContext.Provider
      value={{
        authUser,
        actions: {
          signInUser,
          signOutUser,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// PropTypes validation for children
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};