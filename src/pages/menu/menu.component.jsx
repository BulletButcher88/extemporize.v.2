import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import firebase, { auth } from "../../firebase/firebase";
import "../menu/menu.style.scss";
import { usePosition } from "../../components/geolocation/position";

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
      <div className="spinner-grow text-dark" role="status"></div>
    </div>
  );
}

const SessionList = () => {
  const openSessions = FetchSessions();

  return (
    <>
      <Col>
        {openSessions.map((post, id) => (
          <Link key={id} to={`/session/${post.id}`}>
            <div key={id}>
              SESSION ID: {post.id}
              <div>{post.position.latitude}</div>
              <div>{post.position.longitude}</div>
              {post.data ? (
                <img
                  src={post.data[0].photoURL}
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              ) : null}
            </div>
          </Link>
        ))}
      </Col>
    </>
  );
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
      <SessionList />
      <h1>OR</h1>
      <Col>
        <Link
          to={`/session/${currentUser.uid}`}
          // currentUser={currentUser}
          onClick={() => CreateSession(currentUser, position)}
        >
          CREATE A NEW SESSION
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
  const idList = FetchSessions();

  const { providerData } = currentUser;

  console.log("-----fetching session ids", idList);

  // firebase
  //   .firestore()
  //   .collection("users")
  //   .doc(currentUser.uid)
  //   .update({
  //     id: currentUser.uid,
  //     data: providerData,
  //     position: position
  //   })
  //   .then(function() {
  //     console.log("USER Session successfully written!");
  //   }, []);
}
