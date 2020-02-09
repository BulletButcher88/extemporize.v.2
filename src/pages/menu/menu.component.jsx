import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import firestore, { auth } from "../../firebase/firebase";
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

function CreateSession({ currentUser }) {
  firestore.collection("users").onSnapshot(snapshot => {
    console.log(snapshot.val());
    // const newSession = snapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data()
    // }));

    // console.log(newSession);
  });
}

// function OpenSession() {
//   const [session, setSession] = useState([]);

//   useEffect(() => {
//     firestore.collection("users").onSnapshot(snapshot => {
//       const newSession = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       console.log(newSession);
//       setSession(newSession);
//     });
//   });

//   return session;
// }

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
        <div className="spin-container">
          <Spin />
        </div>
      </>
    );
  }

  const SessionList = () => {
    // const sessions = OpenSession();
    return (
      <Col>
        <Link to={`/session`}>
          {/* {sessions.map(session => {
            <div key={session.id}>{session.id}</div>;
          })} */}
          {/* <code>{JSON.stringify(sessions)}</code> */}
          <code>{JSON.stringify(position)}</code>
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName}
            className="rounded mx-auto d-block"
          />
          Join {currentUser.displayName} session
        </Link>
      </Col>
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
          onClick={CreateSession}
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
