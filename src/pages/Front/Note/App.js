import React from "react";
import style from "./App.less";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor");

    // 初始化state对象
    this.state = { show: false };

    // 给自定义方法绑定this
    this.click = this.click.bind(this);
  }
  click = () => {
    console.log("click", this.state.show);
    this.setState({ show: !this.state.show });
    console.log("click", this.state.show);
  };
  render = () => {
    let show = this.state.show;
    let left = function(name, i) {
      return (
        <div key={i} className={style.AppLeft}>
          <div className={style.Border}>{name}</div>
        </div>
      );
    };
    let right = function(name) {
      return (
        <div className={style.AppRight}>
          <div className={style.Border}>{name}</div>
        </div>
      );
    };
    let users = [{ name: "jd" }, { name: "jc" }];
    return (
      <div>
        {/* 条件 */}
        {show ? "a" : "b"}
        <div>
          <button onClick={this.click}>Click</button>
        </div>
        {/* 循环 */}
        {users.map((user, i) =>
          i % 2 === 0 ? (
            left(user.name, i)
          ) : (
            <div key={i}>{right(user.name)}</div>
          )
        )}
      </div>
    );
  };
}
