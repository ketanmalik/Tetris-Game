import React from "react";
import classes from "./Board.module.css";

const board = (props) => {
  const square = <div className={classes.Square}>Cs</div>;
  let boardMatrix = new Array(props.boardSize).fill(square);
  boardMatrix.push(<div />);
  return boardMatrix;
};

export default board;
