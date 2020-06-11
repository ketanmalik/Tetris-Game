import React, { Component } from "react";
import classes from "./GameConsole.module.css";

class GameConsole extends Component {
  componentDidMount() {
    this.draw();
  }

  draw = () => {
    const context = this.refs.canvas.getContext("2d");
    context.scale(20, 20);
    context.fillStyle = "#000";
    context.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
  };

  render() {
    return (
      <div className={classes.GameConsoleWrapper}>
        <canvas
          className={classes.Canvas}
          ref="canvas"
          width={240}
          height={400}
        />
      </div>
    );
  }
}

export default GameConsole;
