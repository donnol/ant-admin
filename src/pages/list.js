import React from 'react';

export default class List extends React.Component{
	render(){
		return (<div>This is List Page{this.props.children}</div>);
	}
}