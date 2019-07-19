import React, { Fragment } from "react";
import { connect } from "redva";
import { Button, Input, Divider, Popconfirm } from "antd";
import MyDatePicker from "@/components/MyDatePicker";
import StandardQuery from "@/components/StandardQuery";
import StandardTable from "@/components/StandardTable";
import MySelect from "@/components/MySelect";
import qs from "qs";
import cache from "@/utils/cache";

const { MyRangePicker } = MyDatePicker;

@connect(state => {
  return { loading: state.loading.global };
})
export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = cache.get("/note/list") || {
      list: [],
      where: {},
      limit: {
        pageIndex: 0,
        pageSize: 10,
        count: 0
      },
      itemMap: {}
    };
  }
  componentDidUpdate = () => {
    cache.set("/note/list", this.state);
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
    let data = await this.props.dispatch({
      type: "/item/getAll"
    });
    let itemMap = {};
    for (let i in data.data) {
      itemMap[data.data[i].itemId] = data.data[i];
    }
    this.state.itemMap = itemMap;
    let where = { ...this.state.where };
    if (where.createTime) {
      (where.beginTime = where.createTime[0] + " 00:00:00"),
        (where.endTime = where.createTime[1] + " 23:59:59"),
        (where.createTime = undefined);
    }
    let limit = {
      ...this.state.limit,
      count: undefined
    };
    data = await this.props.dispatch({
      type: "/note/search",
      payload: {
        ...where,
        ...limit
      }
    });
    this.state.limit.count = data.count;
    this.state.list = data.data;
    this.setState({});
  };
  add = async () => {
    this.props.history.push({
      pathname: "/note/detail",
      search: qs.stringify({
        hasBack: true
      })
    });
  };
  mod = async noteId => {
    this.props.history.push({
      pathname: "/note/detail",
      search: qs.stringify({
        noteId: noteId,
        hasBack: true
      })
    });
  };
  del = async noteId => {
    await this.props.dispatch({
      type: "/note/del",
      payload: {
        noteId: noteId
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
        dataIndex: "createTime",
        render: () => {
          return <MyRangePicker />;
        }
      }
    ];
    const columns = [
      {
        title: "笔记ID",
        dataIndex: "noteId"
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
        dataIndex: "createTime"
      },
      {
        title: "更新时间",
        dataIndex: "modifyTime"
      },
      {
        title: "操作",
        render: (val, data) => (
          <Fragment>
            <a onClick={this.mod.bind(this, data.noteId)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该笔记?"
              onConfirm={this.del.bind(this, data.noteId)}
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
          rowKey={"noteId"}
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