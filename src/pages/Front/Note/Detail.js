import cache from "@/utils/cache";
import "highlight.js/styles/github.css";
import qs from "qs";
import React from "react";
import ReactMarkdown from 'react-markdown';
import { connect } from "redva";
import style from "./Detail.less";

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
            this.state = cache.get("/front/detail") || {
                data: {}
            };
        }
    }
    componentDidUpdate = () => {
        if (!this.state.noteID) {
            cache.set("/front/detail", this.state);
        }
    };
    componentDidMount = async () => {
        if (this.state.noteID) {
            let data = await this.props.dispatch({
                type: "/note/front",
                payload: {
                    noteID: this.state.noteID
                }
            });
            this.state.data = data;
        }
        this.setState({});
    };
    render = () => {
        let title = String(this.state.data.title);
        let detail = String(this.state.data.detail);
        return (
            <div>
                <ReactMarkdown source={title} className={style.Title} />
                <ReactMarkdown source={detail} className={style.Content} />
            </div>
        );
    };
}
