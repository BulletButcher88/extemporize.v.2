import React from "react";

import RemotePopUp from "../remote/remote-popup.component";

import "../session/session.style.scss";

//requires to reset the state

const SessionPage = ({ currentUser }) => (
  <div className="session-container">
    <RemotePopUp />
  </div>
);

export default SessionPage;
