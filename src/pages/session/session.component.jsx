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
        <div>Open remote to conduct...</div>
      ) : (
        <div>
          <div className="text-group"> tempo:</div>
          <div className="tempo-session">
            <Tempo
              tempo={session.tempo}
              style={{ width: 2000, height: 2000 }}
            />
          </div>
          <div className="text-group"> note: </div>
          <div>
            <h1 className="note">{session.note}</h1>
          </div>
          <div className="text-group"> volume: </div>
          <div>
            <h3>{parseInt(session.volume) - 5}</h3>
          </div>
          <div className="text-group"> bridge : </div>
          <div>
            <h3>{session.bridge}</h3>
          </div>
          <div className="text-group"> style: </div>
          <div>
            <h3>{session.style}</h3>
          </div>
          <div className="text-group"> description: </div>
          <div>
            <h3>{session.description}</h3>
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
      from: { opacity: 0 },
      opacity: 0,
      width: 80,
      height: 80,
      background: "blue"
    });
    await next({
      from: { opacity: 1 },
      opacity: 0.5,
      width: 10,
      height: 10,
      background: "blue"
    });
  }
});

const barCenterPosition = "35vw";
const barEdgePosition = "5vw";

const BarContent = Keyframes.Spring(async next => {
  while (true) {
    await next({
      from: { left: barCenterPosition, opacity: 1 },
      position: "absolute",
      opacity: 0.7,
      left: barEdgePosition,
      width: 60,
      height: 20,
      background: "tomato"
    });

    await next({
      from: { left: barEdgePosition },
      left: barCenterPosition,
      opacity: 1
    });
  }
});

const BarContent2 = Keyframes.Spring(async next => {
  // None of this will cause React to render, the component renders only once :-)
  while (true) {
    await next({
      from: { right: barCenterPosition, opacity: 1 },
      position: "absolute",
      opacity: 0.7,
      right: barEdgePosition,
      width: 60,
      height: 20,
      background: "tomato"
    });

    await next({
      from: { right: barEdgePosition },
      right: barCenterPosition,
      opacity: 1
    });
  }
});

const Tempo = ({ tempo }) => {
  const temp = tempo / 2;
  return (
    <>
      {!temp ? (
        <>LOADING TEMPO</>
      ) : (
        <>
          <Content config={{ duration: temp }}>
            {props => (
              <animated.div
                style={{ position: "relative", borderRadius: "50%", ...props }}
              />
            )}
          </Content>
          <BarContent native config={{ duration: temp }}>
            {props => (
              <animated.div
                style={{ position: "relative", borderRadius: "30%", ...props }}
              />
            )}
          </BarContent>
          <BarContent2 native config={{ duration: temp }}>
            {props => (
              <animated.div
                style={{ position: "relative", borderRadius: "30%", ...props }}
              />
            )}
          </BarContent2>
        </>
      )}
    </>
  );
};

export default SessionPage;
