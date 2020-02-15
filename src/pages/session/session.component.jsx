import React, { useState, useEffect } from "react";
import { useSpring } from "react-spring";
import { Keyframes, animated, config } from "react-spring/renderprops";
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
            tempo:
            <Tempo
              tempo={session.tempo}
              style={{ width: 1200, height: 1200 }}
            />
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

const Content = Keyframes.Spring(async next => {
  // None of this will cause React to render, the component renders only once :-)
  while (true) {
    await next({
      opacity: 1,
      width: 80,
      height: 80,
      background: "blue"
    });
    await next({
      opacity: 0,
      width: 40,
      height: 40,
      background: "black"
    });
  }
});

const Tempo = ({ tempo }) => {
  return (
    <Content>
      {props => (
        <animated.div
          style={{ position: "relative", borderRadius: "50%", ...props }}
        />
      )}
    </Content>
  );
};

export default SessionPage;
