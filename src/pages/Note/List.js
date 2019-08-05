import React, { Fragment } from "react";
import { connect } from "redva";
import { Button, Input, Divider, Popconfirm } from "antd";
import MyDatePicker from "@/components/MyDatePicker";
import StandardQuery from "@/components/StandardQuery";
import StandardTable from "@/components/StandardTable";
import MySelect from "@/components/MySelect";
import qs from "qs";
import cache from "@/utils/cache";
import moment from "moment";

const { MyRangePicker } = MyDatePicker;

@connect(state => {
  return { loading: state.loading.global };
})
export default class List extends React.Component {
  constructor(props) {
    super(props);
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
  componentDidUpdate = () => {
    cache.set("/note/page", this.state);
  };
  onQueryChange = where => {
    this.state.where = where;
    this.setState({});
  };
  onPaginactionChange = limit => {
    this.state.limit = limit;
    this.fetch();
    this.setState({});
  };
  onQuerySubmit = () => {
    this.state.limit.pageIndex = 0;
    this.fetch();
  };
  componentDidMount = () => {
    this.fetch();
  };
  fetch = async () => {
    let where = { ...this.state.where };
    if (where.createdAt) {
      (where.beginTime = Date.parse(where.createdAt[0] + " 00:00:00") / 1000),
        (where.endTime = Date.parse(where.createdAt[1] + " 23:59:59") / 1000),
        (where.createdAt = undefined);
    }
    let limit = {
      ...this.state.limit,
      count: undefined
    };
    let data = await this.props.dispatch({
      type: "/note/page",
      payload: {
        ...where,
        ...limit
      }
    });
    this.state.limit.count = data.total;
    if (data.list) {
      this.state.list = data.list.map(function(element) {
        var temp = new Date(parseInt(element.createdAt) * 1000);
        element.createdAt = moment(temp).format("YYYY-MM-DD hh:mm:ss");
        return element;
      });
    }
    this.setState({});
  };
  add = async () => {
    let data = await this.props.dispatch({
      type: "/note/add",
      payload: {}
    });

    this.props.history.push({
      pathname: "/note/detail",
      search: qs.stringify({
        noteID: data.id,
        hasBack: true
      })
    });
  };
  mod = async noteID => {
    this.props.history.push({
      pathname: "/note/detail",
      search: qs.stringify({
        noteID: noteID,
        hasBack: true
      })
    });
  };
  del = async noteID => {
    await this.props.dispatch({
      type: "/note/del",
      payload: {
        noteID: noteID
      }
    });
    await this.fetch();
  };
  render = () => {
    let queryColumns = [
      {
        title: "标题",
        dataIndex: "title",
        render: () => {
          return <Input placeholder="请输入" />;
        }
      },
      {
        title: "摘要",
        dataIndex: "detail",
        render: () => {
          return <Input placeholder="请输入" />;
        }
      },
      {
        title: "时间",
        dataIndex: "createdAt",
        render: () => {
          return <MyRangePicker />;
        }
      }
    ];
    const columns = [
      {
        title: "笔记ID",
        dataIndex: "noteID"
      },
      {
        title: "标题",
        dataIndex: "title"
      },
      {
        title: "摘要",
        dataIndex: "detail"
      },
      {
        title: "创建时间",
        dataIndex: "createdAt"
      },
      {
        title: "操作",
        render: (val, data) => (
          <Fragment>
            <a onClick={this.mod.bind(this, data.noteID)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该笔记?"
              onConfirm={this.del.bind(this, data.noteID)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        )
      }
    ];
    return (
      <div>
        <StandardQuery
          columns={queryColumns}
          data={this.state.where}
          onChange={this.onQueryChange}
          onSubmit={this.onQuerySubmit}
        />
        <div style={{ marginTop: "16px" }}>
          <Button type="primary" onClick={this.add}>
            添加
          </Button>
        </div>
        <StandardTable
          style={{ marginTop: "16px" }}
          rowKey={"noteID"}
          loading={this.props.loading}
          columns={columns}
          value={this.state.list}
          paginaction={this.state.limit}
          onPaginactionChange={this.onPaginactionChange}
        />
      </div>
    );
  };
}
