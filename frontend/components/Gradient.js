import React from "react";
import { LinearGradient } from "expo-linear-gradient";

//Component đổ màu gradient
const Gradient = (props) => {
  return (
    <LinearGradient
      start={props.start}
      end={props.end}
      locations={props.locations}
      colors={props.colors}
      style={props.style}
    >
      {props.children}
    </LinearGradient>
  );
};

export default Gradient;
