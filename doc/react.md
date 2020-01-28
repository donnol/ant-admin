# React

## 生命周期方法

1.挂载

> constructor: 组件构造函数，第一个被执行
>
> getDerivedStateFromProps: 一个静态方法，所以不能在这个函数里面使用 this，这个函数有两个参数 props 和 state，分别指接收到的新参数和当前的 state 对象，这个函数会返回一个对象用来更新当前的 state 对象，如果不需要更新可以返回 null
>
> render: React 中最核心的方法，一个组件中必须要有这个方法，纯函数，里面只做一件事，就是返回需要渲染的东西，不应该包含其它的业务逻辑，如数据请求，对于这些业务逻辑请移到 componentDidMount 和 componentDidUpdate 中
>
> componentDidMount: 组件装载之后调用，此时我们可以获取到 DOM 节点并操作，比如对 canvas，svg 的操作，服务器请求，订阅都可以写在这个里面，但是记得在 componentWillUnmount 中取消订阅。在 componentDidMount 中调用 setState 会触发一次额外的渲染，多调用了一次 render 函数，但是用户对此没有感知，因为它是在浏览器刷新屏幕前执行的，但是我们应该在开发中避免它，因为它会带来一定的性能问题，我们应该在 constructor 中初始化我们的 state 对象，而不应该在 componentDidMount 调用 state 方法

2.更新: 当组件的 props 改变了，或组件内部调用了 setState 或者 forceUpdate 发生，会发生多次

> getDerivedStateFromProps
>
> shouldComponentUpdate: 有两个参数 nextProps 和 nextState，表示新的属性和变化之后的 state，返回一个布尔值，true 表示会触发重新渲染，false 表示不会触发重新渲染，默认返回 true
>
> render
>
> getSnapshotBeforeUpdate: 这个方法在 render 之后，componentDidUpdate 之前调用，有两个参数 prevProps 和 prevState，表示之前的属性和之前的 state，这个函数有一个返回值，会作为第三个参数传给 componentDidUpdate，如果你不想要返回值，请返回 null，不写的话控制台会有警告，还有这个方法一定要和 componentDidUpdate 一起使用，否则控制台也会有警告
>
> componentDidUpdate:该方法在 getSnapshotBeforeUpdate 方法之后被调用，有三个参数 prevProps，prevState，snapshot，表示之前的 props，之前的 state，和 snapshot。第三个参数是 getSnapshotBeforeUpdate 返回的，在这个函数里我们可以操作 DOM，和发起服务器请求，还可以 setState，但是注意一定要用 if 语句控制，否则会导致无限循环

3.卸载

> componentWillUnmount: 当我们的组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的 DOM 元素等垃圾清理工作，注意不要在这个函数里去调用 setState，因为组件不会重新渲染了

## 列表 key

需要记住一个简单的规则：对于用表达式套数组罗列到页面上的元素，都要为每个元素加上 key 属性，这个 key 必须是每个元素唯一的标识。一般来说，key 的值可以直接后台数据返回的 id，因为后台的 id 都是唯一的。

有时候 id 也不是唯一的，还要加上类型等其它额外字段

## 表达式

如果表达式又放到了 html 元素里，也要加上大括号，没有则可以直接使用
