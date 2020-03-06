import React from "react";
import "./homepage.style.scss";
import { Link } from "react-router-dom";

const HomePage = ({ currentUser }) => {
  const firstName = () => currentUser.displayName.split(" ")[0];

  return (
    <>
      <div className="homepage">
        {/* <img className="homeImage" src={Diamond} /> */}

        {currentUser ? (
          <Link
            className="btn-enter"
            to="/menu"
            style={{ textDecoration: "none" }}
          >
            Welcome back {firstName(firstName)}
          </Link>
        ) : (
          <Link
            className="btn-enter"
            to="/menu"
            style={{ textDecoration: "none" }}
          >
            enter
          </Link>
        )}
      </div>
    </>
  );
};

export default HomePage;
