import React from "react";
import { connect } from "redva";

@connect(state => {
  return { login: state.login };
})
export default class HomeRedirect extends React.Component {
  componentDidMount = () => {
    const role = this.props.login.role;
    var rediretUrl = null;
    if (role == "admin") {
      rediretUrl = "/note";
    } else {
      rediretUrl = "/card";
    }
    this.props.history.push(rediretUrl);
  };
  render() {
    return null;
  }
}
