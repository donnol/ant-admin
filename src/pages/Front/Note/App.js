import React from "react";
import style from "./App.less";

export default class App extends React.Component {
  render = () => {
    return (
      <div>
        <div className={style.AppLeft}>
          <div className={style.Border}>Left</div>
        </div>
        <div className={style.AppRight}>
          <div className={style.Border}>Right</div>
        </div>
      </div>
    );
  };
}
