import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import firebase, { auth } from "../../firebase/firebase";

import { usePosition } from "../../components/geolocation/position";
import ReactMapGL from "react-map-gl";

import defimage from "../../asset/serveimage.png";
import "../menu/menu.style.scss";
import "bootstrap/dist/css/bootstrap.min.css";

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
  }, []);
  return session;
};

const SessionList = position => {
  const { latitude, longitude } = position.position;
  const [viewport, setViewport] = useState({
    latitude: latitude,
    longitude: longitude,
    width: "100vw",
    height: "100vh",
    zoom: 10
  });

  const openSessions = FetchSessions();

  const proxyFilter = (pos1, pos2) => {
    return (pos1 - pos2) * 600;
  };

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
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
                  bottom: `${proxyFilter(post.position.latitude, latitude) +
                    45}%`,
                  left: `${proxyFilter(post.position.longitude, longitude) +
                    45}%`
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
                  bottom: "35%",
                  left: "47vw"
                }}
              />
            )}
          </Link>
        ))}
      </ReactMapGL>
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
  const { latitude, longitude } = usePosition();
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
          <div className="sign-out" onClick={() => auth.signOut()}>
            SIGN OUT
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="menu-container">
      <div className="session-map">
        <SessionList position={position} />
      </div>
      <code>Join one of the sessions in your area or start a new session</code>
      <Link
        to={`/session/${currentUser.uid}`}
        onClick={() => CreateSession(currentUser, position)}
      >
        <div className="create-session">NEW SESSION</div>
      </Link>
      <div className="sign-out" onClick={() => auth.signOut()}>
        SIGN OUT
      </div>
    </div>
  );
}
