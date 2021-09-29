import axios from 'axios';
import {React,Component} from 'react'
import { withRouter } from 'react-router';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Redirect } from 'react-router';

import CONSTANTS from './Constants';

class LoginWindow extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {};
        this.setState({Username: ""});
        this.setState({Password: ""});
//        this.setState({LoggedIn : false});
        this.state.disabledinputs = true;
        this.initFunctions.InitScreen = this.initFunctions.InitScreen.bind(this);
        this.onClickFuncs.Login = this.onClickFuncs.Login.bind(this);
        this.state.functionLoginState = props.functionLoginState;
        console.log(this.state.functionLoginState);
    }
    componentDidMount()
    {
        
        console.log("componentDidMount");
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
                    this.setState(
                        {
                            disabledinputs: false
                        }
                    );
                }
                else
                {
                    this.setState({
                        LoggedIn: true
                    });
                }
            }
        )
    }
    componentDidUpdate() {
        
    }
    shouldComponentUpdate(nextProps, nextState)
    {
        if(nextProps.stateLoggedIn)
            this.LoggedIn = nextProps.stateLoggedIn;
            //this.setState({ LoggedIn : nextProps.stateLoggedIn});
        if(this.state.LoggedIn) {
            console.log("stateLoggedIn: " + this.state.stateLoggedIn);
            console.log("Redirecting..");
        }
       return true;
    }
    render()
    {
        return(
            <Container align="left">
            {
                (() => {
                    if(!this.LoggedIn) {
                        return (
                            <>
                                <h2>Login</h2>
                                <Form>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm="1">Username</Form.Label>
                                        <Col sm="3">
                                            <Form.Control type="text" placeholder="Enter Username" onChange={this.onChangeFuncs.Username.bind(this)} disabled={this.state.disabledinputs}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm="1">Password</Form.Label>
                                        <Col sm="3">
                                            <Form.Control type="password" placeholder="Enter Password" onChange={this.onChangeFuncs.Password.bind(this)} disabled={this.state.disabledinputs}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button variant="primary" onClick={this.onClickFuncs.Login.bind(this)}>Login</Button>
                                    </Form.Group>
                                </Form>
                            </>
                        )
                    }
                    else
                    {
                        return (
                            <Redirect to="/" />
                            
                        );
                    }
                }
                )()
            }
            </Container>
        );
    }

    onChangeFuncs = {
        Username : function(event) {

            this.setState(
                {Username: event.target.value}
            )
        },
        Password : function(event) {

            this.setState(
                {Password: event.target.value}
            )
        }
    }
    onClickFuncs = {
        Login : function() {
            axios.post(CONSTANTS.ServerURL + "userlogin",
            {
                Username: this.state.Username,
                Password: this.state.Password
            },
            {
                withCredentials: true
            }).then(
                (response) => {
                    let data = response.data;
                    if(data.Status === 1) {
                        if(data.Payload.code === "LOGIN_SUCCESS") {
                            this.props.history.push("/");
                            this.state.functionLoginState(true);
                            //return (<Redirect to="/" />)
                        }
                    }
                }
            )
        }
    }
    initFunctions = {
        InitScreen : function(e) {
            console.log("shouldComponentUpdate");
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
                    }
                    else
                    {
                        this.setState({
                            LoggedIn: true
                        });
                    }
                }
            )
        }
    }
}

export default withRouter(LoginWindow);