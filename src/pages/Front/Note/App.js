import React from "react";
import style from "./App.less";

export default class App extends React.Component {
  render = () => {
    let show = <div>show</div>;
    let left = function(name) {
      return (
        <div className={style.AppLeft}>
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
        {show ? show : !show}
        {/* 循环 */}
        {users.map((user, i) =>
          // 需要记住一个简单的规则：对于用表达式套数组罗列到页面上的元素，都要为每个元素加上 key 属性，这个 key 必须是每个元素唯一的标识。一般来说，key 的值可以直接后台数据返回的 id，因为后台的 id 都是唯一的。
          // 有时候id也不是唯一的，还要加上类型等其它额外字段
          // 如果表达式又放到了html元素里，也要加上大括号，没有则可以直接使用
          i % 2 === 0 ? left(user.name) : <div key={i}>{right(user.name)}</div>
        )}
      </div>
    );
  };
}
