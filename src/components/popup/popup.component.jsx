import React from "react";
import NoteKnob from "../../components/note-knob/note-knob.component";
import { timeLoader } from "../../components/geolocation/position";
import firebase from "../../firebase/firebase";

import "./popup.style.scss";

const tempo = [];
const key = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

class Popup extends React.Component {
  constructor(props) {
    console.log("this props popup component", props);
    super(props);
    this.state = {
      stop: false,
      volume: props.session.volume,
      bridge: props.session.bridge,
      style: props.session.style,
      description: props.session.description,
      note: props.session.note,
      tempo: props.session.tempo,
      timestamp: Math.round(new Date().getTime() / 100)
    };
    this.receiveTempo = this.receiveTempo.bind(this);
  }

  receiveTempo() {
    if (tempo.length <= 0) {
      tempo.push(timeLoader());
    }
    if (tempo.length > 1) {
      tempo.shift();
    }
    tempo.push(timeLoader());
    const newTempo = tempo[1] - tempo[0];
    this.setState({ tempo: newTempo });
  }

  receiveNote = value => {
    // console.log(props.currentUser);
    const stepValue = v => Math.round(v * 12) / 12;
    const val = Math.round(stepValue(value) * 12);
    const keyNote = val === 0 ? key[11] : key[val - 1];
    this.setState({ note: keyNote });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  postRequest = props => {
    const path = window.location.pathname.split("/").slice(-1)[0];
    firebase
      .firestore()
      .collection("users")
      .doc(path)
      .update({
        session: this.state
      })
      .then(function() {
        // console.log("SESSION POST successfully saved!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
    this.props.closePopup();
  };

  render() {
    const { volume, bridge, style, description, note, tempo } = this.state;
    return (
      <div className="popup">
        <div className="popup\_inner">
          {/* <h5>{JSON.stringify(this.props.session.volume)}</h5> */}
          <div className="container">
            <div className="stop">
              <div className="stop-btn" onClick={this.props.closePopup}></div>
            </div>
            <div className="submit">
              <div
                className="submit-btn"
                onClick={this.postRequest}
                // onClick={this.props.onSubmit}
              ></div>
            </div>
            <div className="volume">
              <span> {volume - 5}</span>
              <input
                name="volume"
                value={volume}
                onChange={this.handleChange}
                type="range"
                min="0"
                max="10"
                className="volume-slider slider"
              />
            </div>
            <div className="bridge">
              <span>{bridge}</span>
              <input
                name="bridge"
                value={bridge}
                onChange={this.handleChange}
                type="range"
                min="0"
                max="10"
                className="bridge-slider slider"
                id="myRange"
              />
            </div>
            <div className="style">
              <input
                type="text"
                name="style"
                placeholder={style}
                value={style}
                onChange={this.handleChange}
                className="styleInIt"
              />
            </div>
            <div className="description">
              <input
                name="description"
                value={description}
                onChange={this.handleChange}
                className="descriptionInit"
                type="text"
              />
            </div>
            <button
              className="temp"
              name="tempo"
              value={tempo}
              onClick={this.receiveTempo}
              onChange={this.handleChange}
            >
              <text textAnchor="middle" dy="0.7em" fontWeight="bold">
                {tempo}
              </text>
            </button>
            <div className="notes">
              <NoteKnob name="note" value={note} onChange={this.receiveNote} />
            </div>
          </div>
          <button className="close_btn" onClick={this.props.closePopup}>
            X
          </button>
        </div>
      </div>
    );
  }
}

export default Popup;
