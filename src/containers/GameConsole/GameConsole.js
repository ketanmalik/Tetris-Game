import React, { Component } from "react";
import Controls from "../../components/Controls/Controls";
import classes from "./GameConsole.module.css";

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
const pieces = "ILJOTSZ";
const colors = [
  null,
  "#FF0D72",
  "#0DC2FF",
  "#0DFF72",
  "#F538FF",
  "#FF8E0D",
  "#FFE138",
  "#3877FF",
];

class GameConsole extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.keyPressHandler = this.keyPressHandler.bind(this);
    this.state = {
      arena: [],
      context: null,
      lastScore: 0,
      stopGame: true,
      player: {
        matrix: [],
        pos: { x: 5, y: 5 },
        score: 0,
      },
    };
  }

  arenaSweepHandler = () => {
    let arena = [...this.state.arena];
    let player = { ...this.state.player };
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
      for (let x = 0; x < arena[y].length; ++x) {
        if (arena[y][x] === 0) {
          continue outer;
        }
      }

      const row = arena.splice(y, 1)[0].fill(0);
      console.log(row);
      arena.unshift(row);
      ++y;

      player.score += rowCount * 10;
      rowCount *= 2;
      this.setState({ arena: arena, player: player });
    }
  };

  collide = (arena, player) => {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (
          m[y][x] !== 0 &&
          (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  };

  createMatrix = (w, h) => {
    let matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  };

  createPiece = (type) => {
    if (type === "I") {
      return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ];
    } else if (type === "L") {
      return [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2],
      ];
    } else if (type === "J") {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [3, 3, 0],
      ];
    } else if (type === "O") {
      return [
        [4, 4],
        [4, 4],
      ];
    } else if (type === "Z") {
      return [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
      ];
    } else if (type === "S") {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    } else if (type === "T") {
      return [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
      ];
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keyPressHandler);
    const canvas = this.canvas.current;
    const context = canvas.getContext("2d");
    const arena = this.createMatrix(12, 20);
    context.scale(20, 20);
    this.setState(
      { arena: arena, context: context },
      this.updateConsoleHandler
    );
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
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
    this.drawMatrix([...this.state.arena], { x: 0, y: 0 });
    this.drawMatrix(this.state.player.matrix, this.state.player.pos);
  };

  drawMatrix = (matrix, offset) => {
    const context = this.state.context;
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = colors[value];
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };

  keyPressHandler = (event) => {
    switch (event.keyCode) {
      case 32:
        this.newGameHandler();
        break;
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

  merge = (arena, player) => {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
    this.setState({ arena: arena, player: player });
  };

  newGameHandler = () => {
    this.playerResetHandler();
    let player = { ...this.state.player };
    let lastScore = 0;
    player.score = 0;
    const arena = this.createMatrix(12, 20);
    let stopGame = false;
    this.setState({
      arena: arena,
      player: player,
      stopGame: stopGame,
      lastScore: lastScore,
    });
  };

  playerDropHandler = () => {
    let player = { ...this.state.player, pos: { ...this.state.player.pos } };
    let arena = [...this.state.arena];
    player.pos.y++;
    this.setState({ arena: arena, player: player });
    if (this.collide(arena, player)) {
      player.pos.y--;
      this.merge(arena, player);
      this.playerResetHandler();
      this.arenaSweepHandler();
    }
  };

  playerMoveHandler = (dir) => {
    let player = { ...this.state.player, pos: { ...this.state.player.pos } };
    let arena = [...this.state.arena];
    player.pos.x += dir;
    if (this.collide(arena, player)) player.pos.x -= dir;
    this.setState({ arena: arena, player: player });
  };

  playerResetHandler = () => {
    let player = { ...this.state.player, matrix: { ...this.state.matrix } };
    let arena = [...this.state.arena];
    let stopGame = this.state.stopGame;
    let lastScore = this.state.lastScore;
    player.matrix = this.createPiece(
      pieces[(pieces.length * Math.random()) | 0]
    );
    player.pos.y = 0;
    player.pos.x =
      ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (this.collide(arena, player)) {
      arena.forEach((row) => row.fill(0));
      lastScore = player.score;
      player.score = 0;
      stopGame = true;
    }
    this.setState({
      arena: arena,
      player: player,
      stopGame: stopGame,
      lastScore: lastScore,
    });
  };

  playerRotateHandler = () => {
    let player = {
      ...this.state.player,
      matrix: [...this.state.player.matrix],
      pos: { ...this.state.player.pos },
    };
    let pos = player.pos.x;
    let matrix = player.matrix;
    let arena = [...this.state.arena];
    let offset = 1;
    this.rotate(matrix);
    while (this.collide(arena, player)) {
      player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > matrix[0].length) {
        this.rotate(matrix);
        player.pos.x = pos;
        return;
      }
    }

    this.setState({ player: player });
  };

  rotate = (matrix) => {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    matrix.forEach((row) => row.reverse());
  };

  stopGameHandler = () => {
    const context = this.state.context;
    context.fillStyle = "#000";
    context.fillRect(
      0,
      0,
      this.canvas.current.width,
      this.canvas.current.height
    );
    context.fillStyle = "#fff";
    context.font = "bold 1.5px Courier";
    context.fillText("Game Over!", 1.5, 9);
  };

  update = (time = 0) => {
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      this.playerDropHandler();
      dropCounter = 0;
    }
    lastTime = time;
    if (!this.state.stopGame) this.draw();
    else this.stopGameHandler();
    requestAnimationFrame(this.update);
  };

  updateConsoleHandler = () => {
    this.playerResetHandler();
    this.update();
  };

  render() {
    return (
      <div>
        <h4>
          Score&nbsp;&nbsp;
          {this.state.lastScore > 0
            ? this.state.lastScore
            : this.state.player.score}
        </h4>
        <canvas
          className={classes.Canvas}
          ref={this.canvas}
          width={240}
          height={400}
        />
        <Controls
          clickSpacebar={() => this.keyPressHandler({ keyCode: 32 })}
          clickLeft={() => this.keyPressHandler({ keyCode: 37 })}
          clickUp={() => this.keyPressHandler({ keyCode: 38 })}
          clickRight={() => this.keyPressHandler({ keyCode: 39 })}
          clickDown={() => this.keyPressHandler({ keyCode: 40 })}
        />
      </div>
    );
  }
}

export default GameConsole;
