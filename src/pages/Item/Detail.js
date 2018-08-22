import React from 'react';
import { connect } from 'redva';
import {Input} from 'antd';
import StandardForm from '@/components/StandardForm';
import MySelect from '@/components/MySelect';
import qs from 'qs';
import cache from '@/utils/cache';

@connect()
export default class Form extends React.Component{
	constructor(props){
		super(props);
		let query = qs.parse(this.props.location.search.substr(1));
		if( query.itemId ){
			this.state = {
				data:{},
				itemId:query.itemId,
				allCategorys:{},
			}
		}else{
			this.state = cache.get('/item/detail') || {
				data:{},
				allCategorys:{},
			}
			if( query.itemCategoryId ){
				this.state.data.itemCategoryId = parseInt(query.itemCategoryId);
			}
		}
	}
	componentDidUpdate = ()=>{
		if( !this.state.itemId ){
			cache.set('/item/detail',this.state);
		}
	}
	form = null;
	onChange = (data)=>{
		this.state.data = data;
		this.setState({});
	}
	componentDidMount = async ()=>{
		let allCategorys = await this.props.dispatch({
			type:'/itemcategory/getAll'
		});
		this.state.allCategorys = allCategorys;
		this.setState({});

		if( this.state.itemId ){
			let data = await this.props.dispatch({
				type:'/item/get',
				payload:{
					itemId:this.state.itemId,
				}
			});
			this.state.data = data;
			this.setState({});
		}
	}
	onSubmit = async ()=>{
		if( this.state.itemId ){
			await this.props.dispatch({
				type:'/item/mod',
				payload:{
					itemId:this.state.itemId,
					...this.state.data,
				}
			});
		}else{
			await this.props.dispatch({
				type:'/item/add',
				payload:this.state.data,
			});
			this.state.data = {};
			this.componentDidUpdate();
		}
		this.props.history.go(-1);
	}
	render = ()=>{
		let columns = [
			{
				title:"名称",
				dataIndex:"name",
				rules:[{ required: true}],
				render:()=>{
					return (<Input placeholder="请输入"/>);
				}
			},
			{
				title:"类别",
				dataIndex:"itemCategoryId",
				rules:[{ required: true}],
				render:()=>{
					return (<MySelect placeholder="请选择" options={this.state.allCategorys} renderOption={(data)=>(data.name)}/>);
				}
			},
			{
				title:"类别",
				dataIndex:"itemCategoryId2",
				rules:[],
				render:()=>{
					return (<MySelect placeholder="请选择" options={this.state.allCategorys} renderOption={(data)=>(data.name)}/>);
				}
			}
		];
		return (
			<StandardForm
				ref={(node)=>{this.form=node}}
				columns={columns}
				data={this.state.data}
				onChange={this.onChange}
				onSubmit={this.onSubmit}
			/>
		);
	}
}