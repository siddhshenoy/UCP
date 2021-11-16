import {React, Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NavigationBar from './Components/NavigationBar';
import LoginWindow from './Components/LoginWindow';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import VehicleWindow from './Components/VehicleWindow';

class App extends Component {

	constructor(props)
	{
		super(props);
		this.state = {};
		this.state.stateLoggedIn = false;
		this.updateLoginState.bind(this);
	}
	render() {
		return (
			<div className="App">
				<Router>
					<NavigationBar stateLoggedIn={this.state.stateLoggedIn} functionLoginState={this.updateLoginState.bind(this)}/>
					<Switch>
						<Router path="/Vehicles">
							{/* Personal Vehicles */}
							<VehicleWindow stateLoggedIn={this.state.stateLoggedIn} />
						</Router>
						<Router path="/Login">
							<LoginWindow stateLoggedIn={this.state.stateLoggedIn} functionLoginState={this.updateLoginState.bind(this)}/>
						</Router>
						<Router path="/">
							HomePage
						</Router>
					</Switch>
				</Router>
			</div>
		);
	}
	updateLoginState(state)
	{
		this.setState(
			{
				stateLoggedIn: state
			}
		)
	}
}
export default App;
	