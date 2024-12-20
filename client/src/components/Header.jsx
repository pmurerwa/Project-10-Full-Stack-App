import React from "react";

const Header = () => {
  return (
    <header>
      <div class="wrap header--flex">
        <h1 class="header--logo">
          <a href="index.html">Courses</a>
        </h1>
        <nav>
          <ul class="header--signedout">
            <li>
              <a href="sign-up.html">Sign Up</a>
            </li>
            <li>
              <a href="sign-in.html">Sign In</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
