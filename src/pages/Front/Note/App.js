import React from "react";
import style from "./App.less";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor");

    // 初始化state对象
    this.state = {
      users: [{ name: "jd" }, { name: "jc" }, { name: "jj" }, { name: "jx" }]
    };

    // 给自定义方法绑定this，用class fields(fieldName = () => {...})则可以省略这个步骤
    // this.click = this.click.bind(this);
  }
  push = () => {
    // 添加数据
    this.state.users.push({ name: "j" + this.state.users.length });
    this.setState({});
  };
  pop = () => {
    this.state.users.pop();
    this.setState({});
  };
  render = () => {
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
    let users = this.state.users;
    let count = users.length;
    return (
      <div>
        <div>
          {users.map((user, i) =>
            i % 2 === 0 ? (
              left(user.name, i)
            ) : (
              <div key={i}>{right(user.name)}</div>
            )
          )}
        </div>
        <div>
          <div className={style.Count}>user count: {count ? count : "0"}</div>
          <div className={style.Button}>
            <button onClick={this.pop}>-</button>
            <button onClick={this.push}>+</button>
          </div>
        </div>
      </div>
    );
  };
}
