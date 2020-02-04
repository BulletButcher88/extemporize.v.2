import React, { useState } from "react";
import {
  CircularInput,
  CircularProgress,
  CircularThumb
} from "react-circular-input";
import "./note-knob.style.scss";

const key = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

export default function NoteKnob(props, { onChange }) {
  const [value, setValue] = useState(0);
  const stepValue = v => Math.round(v * 12) / 12;
  const val = Math.round(stepValue(value) * 12);
  const keyNote = val === 0 ? key[11] : key[val - 1];

  function handleChange() {
    const name = props.name;
    props.onChange({ [name]: keyNote });
    // keyNote is the state value to send to the popup.component this.state.note
  }

  return (
    <>
      <div className="note-wheel">
        <CircularInput
          value={stepValue(value)}
          onChange={v => setValue(stepValue(v))}
        >
          <CircularInput
            x={45}
            y={45}
            value={value}
            radius={60}
            name="note"
            onChange={handleChange}
          >
            <CircularProgress strokeWidth={2} stroke="rgb(249, 75, 89)" />
            <CircularThumb fill="rgb(249, 75, 89)" />
          </CircularInput>
          <text
            x={100}
            y={85}
            textAnchor="middle"
            dy="0.7em"
            fontWeight="bold"
            fill="rgb(249, 75, 89)"
          >
            {keyNote}
          </text>
        </CircularInput>
      </div>
    </>
  );
}
