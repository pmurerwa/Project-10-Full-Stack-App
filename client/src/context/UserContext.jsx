import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';
import { api } from '../utils/apiHelper'; 

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

  const signIn = async (credentials) => {
    
    const response = await api("/users", "GET", null, credentials);
    if (response.status === 200) {
      const user = await response.json();
      setAuthUser(user);
      Cookies.set(
        "authenticatedUser",
        JSON.stringify({ ...user, password: credentials.password }), 
        { expires: 1 } // 1 day
      );
      return { ...user, password: credentials.password };
    } else if (response.status === 401) {
      Cookies.remove("authenticatedUser");
      return null;
    } else {
      throw new Error(await response.text());
    }
  };

  const signOut = () => {
    setAuthUser(null);
    Cookies.remove("authenticatedUser");
  };

  return (
    <UserContext.Provider value={{
      authUser,
      actions: {
        signIn,
        signOut,
      }
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;