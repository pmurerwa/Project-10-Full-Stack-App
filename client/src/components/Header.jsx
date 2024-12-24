import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Nav = () => {
  const { authUser } = useContext(UserContext);
  return (
    <nav>
      {authUser === null ? (
        <>
          <Link className="signup" to="/signup">Sign up</Link>
          <Link className="signin" to="/signin">{" "}Sign in</Link>
        </>
      ) : (
        <>
          <span>
            Welcome, {authUser.firstName} {authUser.lastName}!
          </span>
          <Link className="signout" to="/signout">
            Sign out
          </Link>
        </>
      )}
    </nav>
  );
};

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