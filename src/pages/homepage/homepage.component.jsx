import React from "react";
import "./homepage.style.scss";
import { Link } from "react-router-dom";

const HomePage = ({ currentUser }) => (
  <>
    <div className="homepage">
      {/* <img className="homeImage" src={Diamond} /> */}
      <Link className="btn-enter" to="/menu" style={{ textDecoration: "none" }}>
        enter
      </Link>
      {currentUser ? (
        <span className="user-name">Hello => {currentUser.displayName}</span>
      ) : null}
    </div>
  </>
);

export default HomePage;
