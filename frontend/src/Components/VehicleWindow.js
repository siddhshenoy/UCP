import axios from 'axios';
import {React, Component} from 'react';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CONSTANTS from './Constants.js';
import { RenderEngine } from './Renderer/RenderEngine.js'

class VehicleWindow extends Component {
    constructor(props) 
    {
        super(props);
        this.state = {};
        this.stateLoggedIn = props.stateLoggedIn;
        this.state.PlayerVehicleData = [];
        this.onChangeFuncs.VehicleSelect = this.onChangeFuncs.VehicleSelect.bind(this);
    }
    componentDidMount() {
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
                    this.rendererSetup();
                    this.fetchUserVehicles();
                }
            }
        )
    }
    fetchUserVehicles() {
        if(this.LoggedIn) {
            axios.get(
                (CONSTANTS.ServerURL + "fetchvehicles"),
                {
                    withCredentials: true
                }
            ).then((response) => {
                console.log(response);
                let data = response.data;
                if(data.Status === 1)
                {
                    let VehicleData = data.Payload.VehicleData;
                    console.log("Vehicle Data:");
                    console.log(VehicleData);
                    this.setState({PlayerVehicleData : VehicleData});
                }
            }
            );
        }
    }
    rendererSetup() {
        console.log(this.RendererMount.offsetWidth);
        console.log(window.innerHeight);
        this.Renderer = null;
        this.RendererElement = this.RendererMount;
        if(this.RendererElement !== null && this.RendererElement !== undefined)
        {
            this.RendererElementDimensions = {
                width: this.RendererMount.offsetWidth,
                height: window.innerHeight - 56
            }
            this.Renderer = RenderEngine.Globals.CreateRenderer(this.RendererElementDimensions.width, this.RendererElementDimensions.height, this.RendererElement);
            RenderEngine.Globals.CreateScene();
            RenderEngine.Globals.CreateGLTFLoader();
            RenderEngine.Globals.InitLights();
            RenderEngine.Globals.CreatePerspectiveCamera(
                45.0,
                this.RendererElementDimensions.width / this.RendererElementDimensions.height,
                0.001,
                1000.0
            );
            
            RenderEngine.Globals.GetCamera().position.set(0.0, 0.0, -10.0);
            RenderEngine.Globals.CreateOrbitControls();
            RenderEngine.Globals.RenderLoop();
        }
        else
        {
            console.log("Could not find the renderer context");
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        this.LoggedIn = nextProps.stateLoggedIn;
        return true;
    }
    render() {
        if(this.LoggedIn) {
            return (
                <>                        
                    <div
                        style={{float: "left", width: "50%", height: "100%", backgroundColor: "#FFFF00", marginRight: "10px"}}
                        ref={ (ref) => { this.RendererMount = ref} }>
                    </div>
                    <div style={{float: "left", width: "500px", overflowY: "overflow"}}>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.FloatingLabel controlId="floatingSelect" label="Vehicle Name">
                                    <Form.Select aria-label=""onChange={this.onChangeFuncs.VehicleSelect}>
                                        {
                                            this.state.PlayerVehicleData.map(
                                                (object, index) => {
                                                    return (<option key={index} value={index}>{object.VehicleName}</option>);
                                                }
                                            )
                                        }
                                        <option></option>
                                    </Form.Select>
                                </Form.FloatingLabel>
                            </Form.Group>
                        </Form>
                    </div>
                </>
            );
        }
        else
        {
            return (
                <>
                    <h3>Access Denied!</h3>
                    You are not allowed to view this as you are not loggedin!
                </>
            );
        }
    }

    onChangeFuncs = {
        VehicleSelect : function(event) {
            //console.log(event.nativeEvent.target.selectedIndex);
            let i = event.nativeEvent.target.selectedIndex
            console.log(
                this.state.PlayerVehicleData[i].VehicleName
            );
        }
    }
}

export default VehicleWindow;