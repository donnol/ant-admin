import React, { Fragment } from "react";
import { connect } from "redva";
import { Input, Button } from "antd";
import MySelect from "@/components/MySelect";
import MyInputButton from "@/components/MyInputButton";
import StandardForm from "@/components/StandardForm";
import StandardTable from "@/components/StandardTable";
import StandardModal from "@/components/StandardModal";
import MyInputDecimal from "@/components/MyInputDecimal";
import CardList from "@/pages/Card2/Select";
import qs from "qs";
import cache from "@/utils/cache";
import InputWrapper from "@/components/InputWrapper";

@connect()
export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    let query = qs.parse(this.props.location.search.substr(1));
    if (query.noteID) {
      this.state = {
        data: {},
        noteID: query.noteID
      };
    } else {
      this.state = cache.get("/note/detail") || {
        data: {}
      };
    }
    this.state.modalVisible = false;
  }
  componentDidUpdate = () => {
    if (!this.state.noteID) {
      cache.set("/note/detail", this.state);
    }
  };
  onChange = data => {
    this.state.data = data;
    this.setState({});
  };
  componentDidMount = async () => {
    if (this.state.noteID) {
      let data = await this.props.dispatch({
        type: "/note/get",
        payload: {
          noteID: this.state.noteID
        }
      });
      this.state.data = data;
    }
    this.setState({});
  };
  onSubmit = async () => {
    if (this.state.noteID) {
      await this.props.dispatch({
        type: "/note/mod",
        payload: {
          noteID: this.state.noteID,
          ...this.state.data
        }
      });
    } else {
      await this.props.dispatch({
        type: "/note/add",
        payload: this.state.data
      });
      this.state.data = {};
      this.componentDidUpdate();
    }
    this.props.history.go(-1);
  };
  render = () => {
    let columns = [
      {
        title: "标题",
        dataIndex: "title",
        labelCol: { span: 2 },
        wrapperCol: { span: 20 },
        rules: [{ required: true }],
        render: () => {
          return <Input placeholder="请输入" />;
        }
      },
      {
        title: "详情",
        dataIndex: "detail",
        labelCol: { span: 2 },
        wrapperCol: { span: 20 },
        rules: [{ required: true }],
        render: () => {
          return <Input placeholder="请输入" />;
        }
      }
    ];
    return (
      <StandardForm
        ref={node => {
          this.form = node;
        }}
        columns={columns}
        data={this.state.data}
        onChange={this.onChange}
        submitCol={{ span: 22, offset: 2 }}
        onSubmit={this.onSubmit}
      />
    );
  };
}
