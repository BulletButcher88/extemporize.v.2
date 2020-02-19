import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import firebase, { auth } from "../../firebase/firebase";
import "../menu/menu.style.scss";
import { usePosition } from "../../components/geolocation/position";

function Spin() {
  return (
    <div>
      {" "}
      Loading...
      <div className="spinner-grow text-dark" role="status"></div>
    </div>
  );
}

export default function MenuPage({ currentUser }) {
  const { latitude, longitude, timestamp } = usePosition();
  const [position, setPosition] = useState([
    {
      latitude: latitude,
      longitude: longitude,
      timestamp: timestamp
    }
  ]);
  setTimeout(function() {
    setPosition({
      latitude: latitude,
      longitude: longitude,
      timestamp: Math.round(new Date().getTime() / 100)
    });
  }, 2000);

  if (!position.latitude) {
    return (
      <>
        <div className="menu-container">
          <div className="spin-container">
            <Spin />
          </div>
          <h1>OR</h1>
          <div className="option" onClick={() => auth.signOut()}>
            SIGN OUT
          </div>
        </div>
      </>
    );
  }

  const FetchSessions = () => {
    const [session, setSession] = useState({});
    useEffect(() => {
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .onSnapshot(
          doc => {
            const openSessions = doc.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setSession(openSessions);
          },
          err => console.log("Error Snapsot", err)
        );
      return () => unsubscribe();
    }, [currentUser]);
    return session;
  };

  const SessionList = () => {
    let session = undefined;
    if (!session) {
      session = FetchSessions();
    } else {
      return session;
    }

    return (
      <>
        <Col>
          <Link to={`/session`}>
            {/* {session.map(user => {
                <div key={user.id}>{user.id}</div>;
              })} */}
            <code>{JSON.stringify(session)}</code>;
            {/* <code>{JSON.stringify(session)}</code> */}
            {/* <img
            src={currentUser.photoURL}
            alt={currentUser.displayName}
            className="rounded mx-auto d-block"
          />
          Join {currentUser.displayName} session */}
          </Link>
        </Col>
      </>
    );
  };

  return (
    <div className="menu-container">
      <SessionList />
      <h1>OR</h1>
      <Col>
        <Link
          to={`/session/${currentUser.uid}`}
          currentUser={currentUser}
          onClick={() => CreateSession(currentUser, position)}
        >
          CREATE A NEW SESSION{" "}
        </Link>
      </Col>
      <h1>OR</h1>
      <div className="option" onClick={() => auth.signOut()}>
        SIGN OUT
      </div>
    </div>
  );
}

function CreateSession(currentUser, position) {
  const { providerData } = currentUser;

  console.log(currentUser, position);
  firebase
    .firestore()
    .collection("users")
    .doc(currentUser.uid)
    .update({
      id: currentUser.uid,
      data: providerData,
      position: position
    })
    .then(function() {
      console.log("USER Session successfully written!");
    }, []);
}
