import React from 'react';

export default class List2 extends React.PureComponent{
	render(){
		return (<div>This is List2 Page userId:{this.props.match.params.userId}</div>);
	}
}