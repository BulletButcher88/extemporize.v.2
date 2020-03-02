import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import firebase, { auth } from "../../firebase/firebase";
import "../menu/menu.style.scss";
import { usePosition } from "../../components/geolocation/position";
import defimage from "../../asset/serveimage.png";

const FetchSessions = () => {
  const [session, setSession] = useState([]);
  useEffect(() => {
    firebase
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
        err => console.log("Error with Snapshot", err)
      );
  });
  return session;
};

function Spin() {
  return (
    <div>
      {" "}
      Loading...
      {/* <div className="spinner-grow text-dark" role="status"></div> */}
    </div>
  );
}

const SessionList = () => {
  const openSessions = FetchSessions();
  return (
    <>
      {/* <div
        className="spinner-grow text-dark"
        role="status"
        style={{ position: "absolute", top: "35%", left: "47vw" }}
      /> */}
      {openSessions.map((post, id) => (
        <Link key={id} to={`/session/${post.id}`}>
          {post.data ? (
            <img
              key={id}
              src={post.data[0].photoURL}
              alt={defimage}
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                zIndex: { id }
              }}
            />
          ) : (
            <img
              key={id}
              src={defimage}
              alt={defimage}
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                zIndex: { id }
              }}
            />
          )}
        </Link>
      ))}
    </>
  );
};

const CreateSession = (currentUser, position) => {
  const { providerData } = currentUser;
  firebase
    .firestore()
    .collection("users")
    .doc(`${currentUser.uid}`)
    .set({
      id: currentUser.uid,
      data: providerData,
      position: position,
      session: {}
    })
    .then(function() {
      console.log("USER Session successfully written!");
    }, []);
};

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
          <div
            className="spinner-grow text-dark"
            role="status"
            style={{ position: "absolute", top: "35%", left: "47vw" }}
          />
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

  return (
    <div className="menu-container">
      <div
        className="spinner-grow text-dark"
        role="status"
        style={{ position: "absolute", top: "35%", left: "47vw" }}
      />
      <div className="session-map">
        <SessionList />
      </div>
      <h1>OR</h1>
      <Col>
        <Link
          to={`/session/${currentUser.uid}`}
          onClick={() => CreateSession(currentUser, position)}
        >
          <div className="create-session">CREATE A NEW SESSION</div>
        </Link>
      </Col>
      <h1>OR</h1>
      <div className="option" onClick={() => auth.signOut()}>
        SIGN OUT
      </div>
    </div>
  );
}
