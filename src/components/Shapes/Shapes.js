import React from "react";

const shapes = (props) => {
  let shapesMatrix = [];
  shapesMatrix.push();
  switch (props.type) {
    case "T":
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    default:
      return null;
  }
};

export default shapes;
