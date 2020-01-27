import React from "react";
import style from "./App.less";

// 生命周期方法
//
// 挂载
//  constructor: 组件构造函数，第一个被执行
//  getDerivedStateFromProps: 一个静态方法，所以不能在这个函数里面使用this，这个函数有两个参数props和state，分别指接收到的新参数和当前的state对象，这个函数会返回一个对象用来更新当前的state对象，如果不需要更新可以返回null
//  render: React中最核心的方法，一个组件中必须要有这个方法，纯函数，里面只做一件事，就是返回需要渲染的东西，不应该包含其它的业务逻辑，如数据请求，对于这些业务逻辑请移到componentDidMount和componentDidUpdate中
//  componentDidMount: 组件装载之后调用，此时我们可以获取到DOM节点并操作，比如对canvas，svg的操作，服务器请求，订阅都可以写在这个里面，但是记得在componentWillUnmount中取消订阅。在componentDidMount中调用setState会触发一次额外的渲染，多调用了一次render函数，但是用户对此没有感知，因为它是在浏览器刷新屏幕前执行的，但是我们应该在开发中避免它，因为它会带来一定的性能问题，我们应该在constructor中初始化我们的state对象，而不应该在componentDidMount调用state方法
//
// 更新: 当组件的props改变了，或组件内部调用了setState或者forceUpdate发生，会发生多次
//  getDerivedStateFromProps
//  shouldComponentUpdate: 有两个参数nextProps和nextState，表示新的属性和变化之后的state，返回一个布尔值，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true
//  render
//  getSnapshotBeforeUpdate: 这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，表示之前的属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，如果你不想要返回值，请返回null，不写的话控制台会有警告，还有这个方法一定要和componentDidUpdate一起使用，否则控制台也会有警告
//  componentDidUpdate:该方法在getSnapshotBeforeUpdate方法之后被调用，有三个参数prevProps，prevState，snapshot，表示之前的props，之前的state，和snapshot。第三个参数是getSnapshotBeforeUpdate返回的，在这个函数里我们可以操作DOM，和发起服务器请求，还可以setState，但是注意一定要用if语句控制，否则会导致无限循环
//
// 卸载
//  componentWillUnmount: 当我们的组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的DOM元素等垃圾清理工作，注意不要在这个函数里去调用setState，因为组件不会重新渲染了
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
          // 需要记住一个简单的规则：对于用表达式套数组罗列到页面上的元素，都要为每个元素加上 key 属性，这个 key 必须是每个元素唯一的标识。一般来说，key 的值可以直接后台数据返回的 id，因为后台的 id 都是唯一的。
          // 有时候id也不是唯一的，还要加上类型等其它额外字段
          // 如果表达式又放到了html元素里，也要加上大括号，没有则可以直接使用
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
