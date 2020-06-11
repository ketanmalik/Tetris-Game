import React, { Component } from "react";
import Board from "../../components/Board/Board";
import classes from "./GameConsole.module.css";

class GameConsole extends Component {
  render() {
    const board = new Array(10).fill(<Board boardSize={10} />);
    return (
      <div className={classes.Wrapper}>
        <div className={classes.OuterPanel}>
          <div className={classes.LeftPanel}>{board}</div>
        </div>
      </div>
    );
  }
}

export default GameConsole;
