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
                    return <Input style={{ margin: "2%" }} disabled placeholder="请输入" />;
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
                        <div style={{ height: "500px", margin: "2%" }}>
                            <MdEditor
                                value={detail}
                                renderHTML={text => this.mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                readOnly={true}
                                config={{
                                    view: {
                                        html: true
                                    },
                                    canView: {
                                        html: true,
                                        hideMenu: true,
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
            />
        );
    };
}
