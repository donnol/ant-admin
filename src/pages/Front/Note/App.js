import cache from "@/utils/cache";
import moment from "moment";
import qs from "qs";
import React from "react";
import ReactMarkdown from 'react-markdown';
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

    let block = function (note, i) {
      let appSytle = i % 2 === 0 ? style.AppLeft : style.AppRight
      return (
        <div key={note.noteID} className={appSytle}>
          <div className={style.Border} onClick={click.bind(this, note.noteID)}>{note.noteID + ". " + note.title}</div>
          <ReactMarkdown className={style.Detail} >{note.detail.substr(0, 10) + "..."}</ReactMarkdown>
        </div>
      );
    };

    let list = this.state.list;
    let count = list.length;
    let total = this.state.limit.count;
    return (
      <div>
        {/* 没有overflow的话，包含float的div没能很好地算出它的height */}
        <div style={{ textAlign: "center", margin: "1%", fontSize: "x-large" }}>笔记列表</div>
        <div style={{ overflow: "hidden" }}>
          {list.map((single, i) => {
            return block(single, i)
          }
          )}
        </div>
        <div className={style.Footer}>
          <div>本页数量: {count ? count : "0"}; 总数：{total}</div>
        </div>
      </div>
    );
  };
}
