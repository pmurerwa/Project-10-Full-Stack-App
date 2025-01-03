// UserContext.js
import { createContext, useState } from 'react';
import Cookies from 'js-cookie';
import { api } from '../utils/apiHelper'; 

// Create a context for the user
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const cookie = Cookies.get("authenticatedUser"); // Retrieve the 'authenticatedUser' cookie, if it exists
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null); // Parse the cookie if found, else set initial state to null

  const signIn = async (credentials) => {
    // Make an API call to fetch user data based on the provided credentials
    const response = await api("/users", "GET", null, credentials); 
    if (response.status === 200) {
      const user = await response.json(); // Parse the response if it's successful
      user.password = credentials.password; // Include the password in the user object
      setAuthUser(user); // Update the state with the user data
      Cookies.set(
        "authenticatedUser",
        JSON.stringify(user), // Store the user data in a cookie as a JSON string
        { expires: 1 } // The cookie will expire in 1 day
      );
      return user; 
    } else if (response.status === 401) {
      return null; 
    } else {
      throw new Error(await response.text()); // Throw an error for any other status codes
    }
  };

  const signOut = () => {
    setAuthUser(null); // Reset the state to null
    Cookies.remove("authenticatedUser"); // Remove the 'authenticatedUser' cookie
  };

  return (
    // Provide the context value to all child components
    <UserContext.Provider value={{
      authUser, 
      actions: {
        signIn, 
        signOut, 
      }
    }}>
      {children} {/* Render the child components */}
    </UserContext.Provider>
  );
};

export default UserProvider;