//PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Correct path according to your folder structure

// PrivateRoute functional component to handle protected routes logic
const PrivateRoute = () => {
  const { authUser } = useContext(UserContext);
  const location = useLocation();

  // Conditional rendering based on the authentication status
  if (authUser) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" state={{ from: location.pathname }} />;
  }
};
// Exporting PrivateRoute for use in other parts of the app
export default PrivateRoute;
