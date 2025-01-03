import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

// UserSignOut functional component
const UserSignOut = () => {
    // Using the UserContext to access the actions object
    const { actions } = useContext(UserContext);

    // Using useEffect hook to perform side effects
    useEffect(() => { 
        actions.signOut(); // Calling signOut action when component mounts
    }, [actions]); // Dependencies array, re-run effect when 'actions' changes

    // Redirecting to home page after sign out
    return <Navigate to="/" replace />
}

export default UserSignOut;