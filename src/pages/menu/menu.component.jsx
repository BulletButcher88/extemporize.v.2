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

// const sessionLocator = (openSessions, position) => {
//   let pos = {};
//   const { latitude, longitude, timestamp } = position.position;
//   openSessions.map((data, i) =>
//     data.position
//       ? (pos = {
//           top: (data.position.latitude - latitude) * 1000,
//           bottom: (data.position.longitude - longitude) * 1000
//         })
//       : null
//   );
//   return pos;
// };

const SessionList = position => {
  const { latitude, longitude, timestamp } = position.position;

  const openSessions = FetchSessions();
  // console.log(sessionLocator(openSessions, position));

  return (
    <>
      <div
        className="spinner-grow text-dark"
        role="status"
        style={{ position: "absolute", top: "35%", left: "47vw", zIndex: 30 }}
      />
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
                zIndex: { id },
                position: "absolute",
                top: `${((post.position.latitude - latitude) / 2) * 1000 +
                  35}%`,
                left: `${((post.position.longitude - longitude) / 2) * 1000 +
                  47}vw`
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
                zIndex: { id },
                position: "absolute",
                top: "35%",
                left: "47vw"
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
    });
};

export default function MenuPage({ currentUser }) {
  const { latitude, longitude, timestamp } = usePosition();
  const [position, setPosition] = useState([{}]);
  setTimeout(function() {
    setPosition({
      latitude: latitude,
      longitude: longitude,
      timestamp: Math.round(new Date().getTime() / 100)
    });
  }, 10);

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
        <SessionList position={position} />
      </div>
      <h1>OR</h1>
      <Link
        to={`/session/${currentUser.uid}`}
        onClick={() => CreateSession(currentUser, position)}
      >
        <div className="create-session">CREATE A NEW SESSION</div>
      </Link>
      <h1>OR</h1>
      <div className="option" onClick={() => auth.signOut()}>
        SIGN OUT
      </div>
    </div>
  );
}
