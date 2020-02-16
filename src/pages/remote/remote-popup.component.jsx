import React, { Component } from "react";
import BackButton from "../../components/back-button/back-button.component";
import Popup from "../../components/popup/popup.component";
import "../remote/remote-popup.style.scss";
class RemotePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        latitude: null,
        longitude: null,
        error: null
      },
      showPopup: false,
      session: {
        note: "A",
        volume: 5,
        bridge: 0,
        tempo: [],
        style: "",
        description: "",
        stop: false
      }
    };
    console.log("props in remote", props);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  onSubmit() {}

  render() {
    return (
      <div>
        {!this.state.showPopup ? (
          <button onClick={this.togglePopup.bind(this)}> Launch Remote</button>
        ) : null}
        {this.state.showPopup ? (
          <Popup
            session={this.state.session}
            closePopup={this.togglePopup.bind(this)}
            onSubmit={this.onSubmit}
          />
        ) : (
          <BackButton />
        )}
      </div>
    );
  }
}

export default RemotePopUp;
