import React, { useState, useEffect } from "react";

import RemotePopUp from "../remote/remote-popup.component";

import "../session/session.style.scss";
import firebase from "../../firebase/firebase";

const SessionPage = ({ currentUser }) => (
  <div className="session-container">
    <RemotePopUp currentUser={currentUser} />
    <SessionDisplay currentUser={currentUser} />
  </div>
);

const SessionDisplay = ({ currentUser }) => {
  const [session, setSession] = useState({});
  const path = window.location.pathname.split("/").slice(-1)[0];

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(path)
      .onSnapshot(
        doc => {
          setSession(doc.data().session);
          console.log("Current data: ", doc.data().session);
        },
        err => console.log("Error Snapsot", err)
      );
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <>
      {!session ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>tempo: {session.tempo}</div>
          <div>volume: {session.volume}</div>
          <div>bridge :{session.bridge}</div>
          <div>style: {session.style}</div>
          <div>description: {session.description}</div>
          <div>note: {session.note}</div>
        </div>
      )}
    </>
  );
};

export default SessionPage;
