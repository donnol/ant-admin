import StandardForm from "@/components/StandardForm";
import cache from "@/utils/cache";
import { Input } from "antd";
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
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
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
  handleEditorChange = ({ html, md }) => {
    console.log("handleEditorChange", html, md);
  };
  uploadFile = async (url, data) => {
    const formData  = new FormData();
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {},
      body: formData
    });
  
    console.log(response)
  }
  handleImageUpload(file, callback) {
    const reader = new FileReader()
    reader.onload = () => {      
      const convertBase64UrlToBlob = (urlData) => {  
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type:mime})
      }
      console.log("file:",file, "file.File:", file.File)
      const blob = convertBase64UrlToBlob(reader.result)
      console.log("blob:", blob)

      var id = 9;
      const url = "http://localhost:8080/v1/file"

      let formData  = new FormData();
      formData.append("file1", blob, file.name)

      // fetch介绍：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
      fetch(url, {
        method: 'POST',
        headers: {
          // 如果添加下面的Content-Type header，后端会报错：multipart: NextPart: bufio: buffer full
          // From https://stackoverflow.com/questions/25493706/ajax-upload-file-to-golang-server-with-content-type-multipart
          // 'Content-Type': 'multipart/form-data; charset=utf-8; boundary=dbfdfd2232bb'
        },
        body: formData
      })
        .then(response => {
          let data = response.json();
          console.log("response:", response, "body:", data)
          return data
        })
        .then(function(myJson) {
          console.log("myJson:",myJson, "data:", myJson.data);
          id = myJson.data.id;
          console.log("id:", id);

          // 当异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
          callback('http://localhost:8080/v1/file?id=' + id);
        })
        .catch(error => {
          console.error(error)
        });
    }
    reader.readAsDataURL(file)
  }
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
    let detail = String(this.state.data.detail);

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
          return (
            <div style={{ height: "500px" }}>
              <MdEditor
                value={detail}
                renderHTML={text => this.mdParser.render(text)}
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
