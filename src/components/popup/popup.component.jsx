import React from "react";
import NoteKnob from "../../components/note-knob/note-knob.component";
import { timeLoader } from "../../components/geolocation/position";
import "./popup.style.scss";
// import { ReactComponent as SwitchBackground } from "../../utils/note-background.svg";

const tempo = [];
const key = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: "",
      bridge: "",
      style: "...",
      description: "...",
      note: "",
      tempo: null
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
    const stepValue = v => Math.round(v * 12) / 12;
    const val = Math.round(stepValue(value) * 12);
    const keyNote = val === 0 ? key[11] : key[val - 1];
    this.setState({ note: keyNote });
  };

  handleChange = event => {
    console.log(event);
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { volume, bridge, style, description, note, tempo } = this.state;
    console.log(this.state);
    return (
      <div className="popup">
        <div className="popup\_inner">
          {/* <h5>{JSON.stringify(this.props.session)}</h5> */}
          <div className="container">
            <div className="stop">
              <a className="stop-btn" onClick={this.props.onSubmit}></a>
            </div>
            <div className="submit">
              <a
                className="submit-btn"
                onClick={this.props.closePopup}
                // onClick={this.props.onSubmit}
              ></a>
            </div>
            <div className="volume">
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
                name="style"
                value={style}
                onChange={this.handleChange}
                className="styleInIt"
                type="text"
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
