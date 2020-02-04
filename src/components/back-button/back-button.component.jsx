import React from "react";
import { Link } from "react-router-dom";
import "../back-button/back-button.style.scss";

const BackButton = () => (
  <>
    <Link className="back-btn" to="/menu">
      {"<"}
    </Link>
  </>
);

export default BackButton;
