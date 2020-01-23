import React from "react";
import "./App.css";

export default class App extends React.Component {
  render = () => {
    return (
      <div>
        <div className="App-left">
          <div className="Border">Left</div>
        </div>
        <div className="App-right">
          <div className="Border">Right</div>
        </div>
      </div>
    );
  };
}
