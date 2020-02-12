import React, { useStateå } from "react";

import RemotePopUp from "../remote/remote-popup.component";

import "../session/session.style.scss";
import firebase from "../../firebase/firebase";
const { session, setSession } = useStateå();

const SessionPage = ({ currentUser }) => (
  <div className="session-container">
    <RemotePopUp currentUser={currentUser} />
    {/* <SessionDisplay /> */}
  </div>
);

const SessionDisplay = () => {
  const path = window.location.pathname.split("/").slice(-1)[0];
  firebase
    .firestore()
    .collection("users")
    .doc(path)
    .onSnapshot(function(doc) {
      setSession(doc.data());
      console.log("Current data: ", data.session);
    });
};
SessionDisplay();

export default SessionPage;
