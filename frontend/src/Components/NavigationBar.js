import {React, Component} from 'react';
import {Navbar, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import CONSTANTS from './Constants';

class NavigationBar extends Component {
    constructor(props)
    {
        super(props);
        this.state = {};
        this.state.functionLoginState = props.functionLoginState;
        this.onClickFuncs.Logout = this.onClickFuncs.Logout.bind(this);
        this.LoggedIn = false;
        
    }
    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios.post(
            (CONSTANTS.ServerURL + "checklogin"),
            {
                withCredentials: true
            }
        ).then(
            (response) => {
                let respData = response.data;
                console.log(respData);
                if(respData.Status === -1) // Not Logged In
                {
                    this.setState({
                        LoggedIn: false
                    });
                    this.state.functionLoginState(false);
                }
                else
                {
                    this.setState({
                        LoggedIn: true
                    });
                    this.state.functionLoginState(true);
                }
            }
        )
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.clear();
        console.log("prevProps, prevState, snapshot");
        console.log(prevProps);
        console.log(prevState);
        console.log(snapshot);
        
    }
    shouldComponentUpdate(nextProps, nextState) {
        //console.log(nextProps);
        //console.log(nextState);
        //console.log("shouldComponentUpdate");
        //if(nextProps.stateLoggedIn)
            //this.setState({LoggedIn : nextProps.stateLoggedIn});
        console.log("shouldCompnentUpdate");
        console.log(this.props);
        console.log(nextProps);
        //this.LoggedIn = this
        this.LoggedIn = nextProps.stateLoggedIn;
        console.log("Received State: " + this.state.LoggedIn);
        return nextProps !== this.props;
    }
    render() {
        return (
            <Navbar bg="light">
                <Container fluid>
                    <Navbar.Brand href="#">SAMP</Navbar.Brand>
                </Container>
                <Link to="/" className="nav-link">Home</Link>
                {
                    (() => {
                        if(this.LoggedIn) {
                            return (
                                <>
                                    <Link to="/Vehicles" className="nav-link">Vehicles</Link>
                                    <Link to="/" className="nav-link" onClick={this.onClickFuncs.Logout}>Logout</Link>
                                </>
                            );
                        }
                        return (
                            <div>
                                <Link to="/Login" className="nav-link">Login</Link>
                            </div>
                        );
                    })()
                }
                { /*<Link to="/"className="nav-link">Home</Link> */ }
            </Navbar>
        )
    }
    onClickFuncs = {
        Logout : function() {
            axios.defaults.withCredentials = true;
            axios.post(
                (CONSTANTS.ServerURL + "userlogout"),
                {
                    withCredentials: true
                }
            ).then(
                (response) => {
                    let respData = response.data;
                    console.log(respData);
                    if(respData.Status === 1) // Not Logged In
                    {
                        if(respData.Payload.code === "LOGOUT_SUCCESS") { 
                            this.setState({
                                LoggedIn: false
                            });
                            this.state.functionLoginState(false);
                        }
                    }
                }
            )
        }
    }
}

export default NavigationBar