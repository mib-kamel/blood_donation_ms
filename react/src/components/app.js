import React, { Component } from 'react';
import Header from './tpls/header';

//The component which contains the application
export default class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Header />
				<section>
					<div className="container">
						{/* this.props.children is set by the routes */}
						{this.props.children}
					</div>
				</section>
			</div >
		)
	}
}