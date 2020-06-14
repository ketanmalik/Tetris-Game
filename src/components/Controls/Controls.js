import React from "react";
import classes from "./Controls.module.css";

const controls = (props) => {
  return (
    <div className={classes.Controls}>
      <button
        className={classes.Button}
        style={{ marginBotton: "1%", display: "block" }}
        onClick={props.clickUp}
      >
        <i className="fas fa-undo" style={{ color: "#fff" }}></i>
      </button>
      <button
        className={classes.Button}
        style={{ display: "inline-block" }}
        onClick={props.clickLeft}
      >
        <i className="fas fa-chevron-left" style={{ color: "#fff" }}></i>
      </button>
      <button
        className={classes.Button}
        style={{ display: "inline-block", marginLeft: "1%", marginRight: "1%" }}
        onClick={props.clickDown}
      >
        <i className="fas fa-chevron-down" style={{ color: "#fff" }}></i>
      </button>
      <button
        className={classes.Button}
        style={{ display: "inline-block" }}
        onClick={props.clickRight}
      >
        <i className="fas fa-chevron-right" style={{ color: "#fff" }}></i>
      </button>
      <button
        className={classes.Button}
        style={{ width: "200px", borderRadius: "5%" }}
        onClick={props.clickSpacebar}
      >
        New Game
      </button>
    </div>
  );
};

export default controls;
