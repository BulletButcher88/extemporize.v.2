import React, { useState } from "react";
import { CircularInput, CircularThumb } from "react-circular-input";
import "./note-knob.style.scss";

const key = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

export default function NoteKnob(props, { onChange }) {
  const [value, setValue] = useState(0);
  const stepValue = v => Math.round(v * 12) / 12;
  const val = Math.round(stepValue(value) * 12);
  const keyNote = val === 0 ? key[11] : key[val - 1];

  return (
    <div className="note-wheel">
      <CircularInput
        radius={60}
        name="set-note"
        value={stepValue(value)}
        onChange={v => setValue(stepValue(v))}
        backgroundColor="transparent"
      />
      <text
        x={100}
        y={90}
        textAnchor="middle"
        dy="0.7em"
        fontWeight="bold"
        fill="white"
        backgroundColor="rgba(52, 52, 52, alpha)"
      >
        {keyNote}
      </text>
    </div>
  );

  // return (
  //   <>
  //     <div className="note-wheel">
  //       <CircularInput
  //         name="set-note"
  //         value={stepValue(value)}
  //         onChange={v => setValue(stepValue(v))}
  //       >
  //         <CircularInput
  //           x={45}
  //           y={45}
  //           value={value}
  //           radius={60}
  //           name="note"
  //           onChange={e => props.onChange(e)}
  //         >
  //           <CircularThumb fill="white" />
  //         </CircularInput>
  //         <text
  //           x={100}
  //           y={90}
  //           textAnchor="middle"
  //           dy="0.7em"
  //           fontWeight="bold"
  //           fill="white"
  //         >
  //           {keyNote}
  //         </text>
  //       </CircularInput>
  //     </div>
  //   </>
  // );
}
