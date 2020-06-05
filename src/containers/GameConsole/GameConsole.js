import React, { Component } from "react";
import classes from "./GameConsole.module.css";

class GameConsole extends Component {
  render() {
    const squareLight = <div className={classes.SquareLight}></div>;
    const squaredark = <div className={classes.SquareDark}></div>;

    let leftPanelDivisions = [...Array(18)].map((e) => Array(20));
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 20; j++) {
        j % 2 === 0
          ? (leftPanelDivisions[i][j] = squareLight)
          : (leftPanelDivisions[i][j] = squaredark);
      }
    }

    return (
      <div className={classes.Wrapper}>
        <div className={classes.OuterPanel}>
          <div className={classes.LeftPanel}>{leftPanelDivisions}</div>
        </div>
      </div>
    );
  }
}

export default GameConsole;
