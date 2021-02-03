import StandardForm from "@/components/StandardForm";
import cache from "@/utils/cache";
import { Input, Button, notification } from "antd";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import abbreviation from "markdown-it-abbr";
import deflist from "markdown-it-deflist";
import emoji from "markdown-it-emoji";
import footnote from "markdown-it-footnote";
import insert from "markdown-it-ins";
import mark from "markdown-it-mark";
import subscript from "markdown-it-sub";
import superscript from "markdown-it-sup";
import tasklists from "markdown-it-task-lists";
import qs from "qs";
import React from "react";
import MdEditor from "react-markdown-editor-lite";
import { connect } from "redva";
import dayjs from "dayjs";

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
    // initial a parser
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) { }
        }
        return ""; // use external default escaping
      }
    })
      .use(emoji)
      .use(subscript)
      .use(superscript)
      .use(footnote)
      .use(deflist)
      .use(abbreviation)
      .use(insert)
      .use(mark)
      .use(tasklists, { enabled: this.taskLists });
    this.state.modalVisible = false;
  }
  componentDidUpdate = () => {
    if (!this.state.noteID) {
      cache.set("/note/detail", this.state);
    }
  };
  onChange = (data) => {
    // 只更新标题，详情由handleEditorChange负责更新
    this.state.data.title = data.title;
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
  renderHTML = (text) => {
    // 模拟异步渲染Markdown
    return new Promise((resolve) => {
      resolve(this.mdParser.render(text))
    })
  }
  handleEditorChange = (data) => {
    // console.log("handleEditorChange", "text:", data.text, "html:", data.html);
    // 负责更新详情
    this.state.data.detail = data.text;
    this.setState({});
  };
  uploadFile = async (formData) => {
    return await this.props.dispatch({
      type: "/file/add",
      payload: formData
    });
  }
  getFileLink = async (id) => {
    return await this.props.dispatch({
      type: "/file/getLink",
      payload: { id: id }
    });
  }
  handleImageUpload = (file, callback) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const convertBase64UrlToBlob = (urlData) => {
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
      }
      const blob = convertBase64UrlToBlob(reader.result)

      let formData = new FormData();
      formData.append("file1", blob, file.name)

      let data = await this.uploadFile(formData)

      // 拼接链接
      let link = await this.getFileLink(data.id)

      // 当异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
      callback(link);
    }
    reader.readAsDataURL(file)
  }
  onSubmit = async () => {
    await this.handleSaveContent()

    this.props.history.go(-1);
  };
  handleSaveContent = async () => {
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

    // 通知
    this.notifyAfterSave()
  }
  notifyAfterSave = () => {
    let d = dayjs().format('YYYY-MM-DD HH:mm:ss');
    notification.open({
      message: '笔记保存成功',
      description:
        '笔记保存成功：' + d + '。',
      duration: 2,
      style: { backgroundColor: "rgba(205, 205, 125, 75)" },
      onClick: () => {
        console.log('确定!');
      },
    });
  };
  render = () => {
    let title = String(this.state.data.title);
    let detail = String(this.state.data.detail);

    let columns = [
      {
        title: "标题",
        dataIndex: "title",
        labelCol: { span: 2 },
        wrapperCol: { span: 20 },
        rules: [{ required: true }],
        render: () => {
          return <div>
            <Input placeholder="请输入" value={title}></Input>
          </div>;
        }
      },
      {
        title: "详情",
        dataIndex: "detail",
        labelCol: { span: 2 },
        wrapperCol: { span: 20 },
        rules: [{ required: true }],
        render: () => {
          return (
            <div style={{ height: "500px" }}>
              <MdEditor
                value={detail}
                renderHTML={this.renderHTML}
                onChange={this.handleEditorChange}
                onImageUpload={this.handleImageUpload}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: true
                  },
                  imageUrl: "https://octodex.github.com/images/minion.png"
                }}
              />
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <div>
          <Button
            onClick={this.handleSaveContent}
            style={{ marginBottom: "10px", textAlign: "center", backgroundColor: "rgba(225, 125, 75, 75)", width: "fit-content" }}
          >
            保存内容（保存后不会跳回列表页）
        </Button>
        </div>
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
      </div>
    );
  };
}
