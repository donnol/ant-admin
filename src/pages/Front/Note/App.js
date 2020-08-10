import cache from "@/utils/cache";
import moment from "moment";
import qs from "qs";
import React from "react";
import { connect } from "redva";
import style from "./App.less";

@connect(state => {
  return { loading: state.loading.global };
})
export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor");

    // 初始化state对象
    this.state = cache.get("/note/page") || {
      list: [],
      where: {},
      limit: {
        pageIndex: 0,
        pageSize: 10,
        count: 0
      }
    };
  }
  componentDidMount = () => {
    this.fetch();
  };
  fetch = async () => {
    let limit = {
      ...this.state.limit,
      count: undefined
    };
    let data = await this.props.dispatch({
      type: "/note/page",
      payload: {
        ...limit,
      }
    });
    this.state.limit.count = data.total;
    if (data.list) {
      this.state.list = data.list.map(function (element) {
        var temp = new Date(parseInt(element.createdAt) * 1000);
        element.createdAt = moment(temp).format("YYYY-MM-DD hh:mm:ss");
        return element;
      });
    } else {
      this.state.list = data.list;
    }
    console.log(this.state);
    this.setState({});
  };
  click = async noteID => {
    console.log("click", noteID);
    this.props.history.push({
      pathname: "/front/note/detail",
      search: qs.stringify({
        noteID: noteID,
        hasBack: true
      })
    });
  };
  render = () => {
    let click = this.click;

    let left = function (name, i, style) {
      return (
        <div key={i} className={style.AppLeft}>
          <div className={style.Border} onClick={click.bind(this, i)}>{name}</div>
        </div>
      );
    };
    let right = function (name, i, style) {
      return (
        <div key={i} className={style.AppRight}>
          <div className={style.Border} onClick={click.bind(this, i)}>{name}</div>
        </div>
      );
    };
    let list = this.state.list;
    let count = list.length;
    return (
      <div>
        {/* 没有overflow的话，包含float的div没能很好地算出它的height */}
        <div style={{ overflow: "hidden" }}>
          {list.map((single, i) =>
            i % 2 === 0 ? (
              left(single.noteID + ". " + single.title, single.noteID, style)
            ) : (
                right(single.noteID + ". " + single.title, single.noteID, style)
              )
          )}
        </div>
        <div className={style.Footer}>
          <div>data count: {count ? count : "0"}</div>
        </div>
      </div>
    );
  };
}
