import React, { useState, useEffect } from "react";
import RemotePopUp from "../remote/remote-popup.component";
import firebase from "../../firebase/firebase";

import "../session/session.style.scss";

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
    <div className="session-panel">
      {!session.volume ? (
        <div>Open remote to instruct...</div>
      ) : (
        <div>
          <div>
            tempo:{" "}
            <h1>
              <Tempo tempo={session.tempo} />
              {session.tempo}
            </h1>
          </div>
          <div>
            note: <h1 className="note">{session.note}</h1>
          </div>
          <div>
            volume: <h3>{parseInt(session.volume) - 5}</h3>
          </div>
          <div>
            bridge :<h3>{session.bridge}</h3>
          </div>
          <div>
            style: <h3>{session.style}</h3>
          </div>
          <div>
            description: <h3>{session.description}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

const Tempo = ({ temp }) => {};

export default SessionPage;
