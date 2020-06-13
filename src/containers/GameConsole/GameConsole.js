import React, { Component } from "react";
import classes from "./GameConsole.module.css";

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
class GameConsole extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.keyPressHandler = this.keyPressHandler.bind(this);
    this.state = {
      player: {
        matrix: [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0],
        ],
        pos: { x: 5, y: 5 },
      },
      context: null,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyPressHandler);
    const canvas = this.canvas.current;
    const context = canvas.getContext("2d");
    context.scale(20, 20);
    this.setState({ context: context }, this.updateConsoleHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPressHandler);
  }

  draw = () => {
    const context = this.state.context;
    context.fillStyle = "#000";
    context.fillRect(
      0,
      0,
      this.canvas.current.width,
      this.canvas.current.height
    );
    this.drawMatrix(this.state.player.matrix, this.state.player.pos);
  };

  drawMatrix = (matrix, offset) => {
    const context = this.state.context;
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = "#555";
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };

  keyPressHandler = (event) => {
    switch (event.keyCode) {
      case 37:
        this.playerMoveHandler(-1);
        break;
      case 38:
        this.playerRotateHandler();
        break;
      case 39:
        this.playerMoveHandler(1);
        break;
      case 40:
        this.playerDropHandler();
        break;
      default:
        break;
    }
  };

  playerDropHandler = () => {
    let player = { ...this.state.player, pos: { ...this.state.player.pos } };
    player.pos.y++;
    this.setState({ player: player });
  };

  playerMoveHandler = (dir) => {
    let player = { ...this.state.player, pos: { ...this.state.player.pos } };
    player.pos.x += dir;
    this.setState({ player: player });
  };

  playerRotateHandler = () => {
    let player = {
      ...this.state.player,
      matrix: [...this.state.player.matrix],
      pos: { ...this.state.player.pos },
    };
    let matrix = player.matrix;
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    matrix.forEach((row) => row.reverse());

    this.setState({ player: player });
  };

  updateConsoleHandler = (time = 0) => {
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      this.playerDropHandler();
      dropCounter = 0;
    }
    lastTime = time;
    this.draw();
    requestAnimationFrame(this.updateConsoleHandler);
  };

  render() {
    return (
      <div className={classes.GameConsoleWrapper}>
        <canvas
          className={classes.Canvas}
          ref={this.canvas}
          width={240}
          height={400}
        />
      </div>
    );
  }
}

export default GameConsole;
