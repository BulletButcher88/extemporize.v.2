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
              {post.data ? (
                <img
                  src={post.data[0].photoURL}
                  alt="https://picsum.photos/200"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    zIndex: { id }
                  }}
                />
              ) : (
                <img
                  src="https://picsum.photos/200"
                  alt="https://picsum.photos/200"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    zIndex: { id }
                  }}
                />
              )}
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
          currentUser={currentUser}
          openSessions={() => FetchSessions()}
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

function CreateSession(props) {
  // const { providerData } = currentUser;
  console.log("CreateSession", props);
  // {
  //   openSessions
  //     ? openSessions.map()
  //     : console.log("error loading openSessions");
  // }
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
