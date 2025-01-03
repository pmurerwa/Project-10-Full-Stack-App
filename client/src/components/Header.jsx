// React component to display the header of the application
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// Navigation component to display different nav items based on user's authentication status
const Nav = () => {
  const { authUser } = useContext(UserContext);

  // Render different navigation options based on whether the user is signed in or not
  return (
    <nav>
      {authUser === null ? (
        <ul className="header--signedout">
          <li>
            <Link to="signup">Sign Up</Link>
          </li>
          <li>
            <Link to="signin">Sign In</Link>
          </li>
        </ul>
      ) : (
        <>
          <ul className="header--signedin">
            <li>
              Welcome, {authUser.firstName} {authUser.lastName}!
            </li>
            <li>
              <Link to="/signout">Sign Out</Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
};

// Header component that wraps the navigation and logo
const Header = () => {
  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <Link to="/">Courses</Link>
        </h1>
        <Nav />
      </div>
    </header>
  );
};

export default Header;
