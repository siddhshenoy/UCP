import axios from 'axios';
import {React, Component} from 'react';
import { Button, Container, FormControl, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CONSTANTS from './Constants.js';
import { RenderEngine } from './Renderer/RenderEngine.js';
import { Vehicle, VehicleData, VehicleWheelData } from './Renderer/Vehicle.js';
import * as JSONVehicleData from '../Data/VehicleData.json';
import * as JSONVehicleWheelData from  '../Data/VehicleWheelSize.json';
class VehicleWindow extends Component {
    constructor(props) 
    {
        super(props);
        this.state = {};
        // =====================================================================================================================
        // Modal popup states
        // =====================================================================================================================
        this.state.ModalHeader = "";
        this.state.ModalBody = "";
        this.state.ModalShow = false;

        this.stateLoggedIn = props.stateLoggedIn;
        this.selectedVehicle = null;
        this.state.WheelsDisabled = true;
        this.state.SaveDisabled = true;
        this.state.VehicleColorLabelColor = "#000000";
        this.state.PlayerVehicleData = [];
        //this.state.PlayerSelectedVehicle = null;
        this.onChangeFuncs.VehicleSelect = this.onChangeFuncs.VehicleSelect.bind(this);
        this.onChangeFuncs.VehicleWheelSelect = this.onChangeFuncs.VehicleWheelSelect.bind(this);
        this.onClickFuncs.VehicleSave = this.onClickFuncs.VehicleSave.bind(this);
        this.onChangeFuncs.ColorSelect = this.onChangeFuncs.ColorSelect.bind(this);
        this.onChangeFuncs.NitroSelect = this.onChangeFuncs.NitroSelect.bind(this);
        this.adjustTextColor = this.adjustTextColor.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        // this.WheelSelect = null;
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
                let data = response.data;
                if(data.Status === 1)
                {
                    let VehData = data.Payload.VehicleData;
                    this.setState({PlayerVehicleData : VehData});
                }
            }
            );
        }
    }
    rendererSetup() {
        this.Renderer = null;
        this.RendererElement = this.RendererMount;
        if(this.RendererElement !== null && this.RendererElement !== undefined)
        {
            VehicleData.SetVehicleData(JSONVehicleData.default);
            VehicleWheelData.SetVehicleWheelData(JSONVehicleWheelData.default);

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

            this.InitializeLights();
            
        }
        else
        {
            console.log("Could not find the renderer context");
        }
    }
    onClickFuncs = {
        VehicleSave : function(event) {
            axios.post(
                (CONSTANTS.ServerURL + "updatevehicle"),{
                    "UpdateVehicleData" : this.selectedVehicle
                },
                {
                    withCredentials: true
                }
            ).then((response) => {
                let data = response.data;
                if(data !== null) {
                    if(data.Status === 1) {
                        this.showModal("Vehicle Updated!", "Your vehicle data has been updated succesfully, it will be reflected in game now.");
                    }
                    else {
                        this.showModal("Vehicle Not Updated!", "Your was <b>not</b> updated.");
                    }
                }
            });
        }
    }
    onChangeFuncs = {
        NitroSelect : function(event) {
            let SelectedID = event.target.value;
            if(SelectedID !== 0) {
                this.selectedVehicle.ComponentList[ CONSTANTS.GameData.ComponentIdx["NITRO"] ] = SelectedID;
            }
        },
        ColorSelect : function(event) {
            let SelectedID = event.target.value;
            if(SelectedID !== -1) {
                let color = CONSTANTS.GameData.VehicleColors[SelectedID];
                let val = color.toString(16);
                val = ("000000").substring(0, (6- val.length)) + val;

                event.target.style.backgroundColor = "#" + val;
                if(color < 8421504) {
                    this.setState({VehicleColorLabelColor : "#FFFFFF"});
                }
                else {
                    this.setState({VehicleColorLabelColor : "#000000"});
                }
                this.g_Vehicle.SetHexColor(color);

                this.selectedVehicle.Colors[0] = parseInt(SelectedID);
                
            }
        },
        VehicleSelect : function(event) {
            //debugger;
            let SelectedID = event.target.value;
            if(parseInt(SelectedID) !== -1) {
                let VehData = this.state.PlayerVehicleData;
                //let Vehicle = null;
                let Veh = null;
                for(var i = 0; i < VehData.length; i++) {
                    console.log(i + " , " + SelectedID);
                    if(parseInt(VehData[i].ID) === parseInt(SelectedID)) {
                        
                        Veh = VehData[i];
                        this.selectedVehicle = Veh;
                        break;
                    }
                }
                if(Veh != null) {
                    let curVehicle = null;
                    if(this.g_Vehicle != null) this.g_Vehicle.Destroy();
                    this.g_Vehicle = new Vehicle(Veh.VehicleModelName);
                    this.g_Vehicle.SetLoadPath( (CONSTANTS.ServerURL + "Models/VehicleModels/"));
                    this.g_Vehicle.SetWheelPath( (CONSTANTS.ServerURL + "Models/VehicleWheels/"));
                    this.g_Vehicle.SetWheelModPath( (CONSTANTS.ServerURL +"Models/VehicleModWheels/"));
                    curVehicle = this.g_Vehicle;
                    let This = this;
                    this.g_Vehicle.LoadVehicleWithoutWheels(function(vehicle)
                    {

                        //console.log(CONSTANTS.GameData.VehicleColors[Veh.Colors[0]]);
                        vehicle.SetHexColor(CONSTANTS.GameData.VehicleColors[Veh.Colors[0]]);
                        if(Veh.ComponentList[CONSTANTS.GameData.ComponentIdx["WHEELS"]] != 0)
                        {
                            console.log("Vehicle wheels loading");
                            setTimeout(function() {
                                vehicle.ReplaceWheels("ModWheels", CONSTANTS.GameData.ComponentMapList[Veh.ComponentList[CONSTANTS.GameData.ComponentIdx["WHEELS"]]]);
                            }, 250);
                        }
                        else {
                            setTimeout(function() { vehicle.ReplaceWheels("Default", CONSTANTS.GameData.ComponentMapList[Veh.ComponentList[CONSTANTS.GameData.ComponentIdx["WHEELS"]]]); }, 250);
                        }
                        This.WheelSelect.disabled = false;
                        This.WheelSelect.value = Veh.ComponentList[CONSTANTS.GameData.ComponentIdx["WHEELS"]].toString();
                        This.setState({WheelsDisabled: false});
                        This.setState({SaveDisabled: false});
                        This.SelectNitro.value = Veh.ComponentList[CONSTANTS.GameData.ComponentIdx["NITRO"]].toString();
                        This.SelectColor.value = Veh.Colors[0];
                        
                        let val = CONSTANTS.GameData.VehicleColors[Veh.Colors[0]].toString(16);
                        val = ("000000").substring(0, (6- val.length)) + val;
                        This.SelectColor.style.backgroundColor = '#' + val;
                        This.adjustTextColor(Veh.Colors[0]);

                        
                    });

                }
            } else {
                this.WheelSelect.value = "0";
                this.setState({WheelsDisabled: true});
                this.setState({SaveDisabled: true});
            }
        },
        VehicleWheelSelect: function(event) {
            let value = event.target.value;
            this.selectedVehicle.ComponentList[CONSTANTS.GameData.ComponentIdx["WHEELS"]] = parseInt(value);
            console.log(this.selectedVehicle);
            if(value === "0") {
                this.g_Vehicle.ReplaceWheels("Default", "doesntmatter");
            }
            else {
                this.g_Vehicle.ReplaceWheels("ModWheels", CONSTANTS.GameData.ComponentMapList[value]);
            }
        }
    }
    showModal(header,body) {
        this.setState({ModalHeader: header, ModalBody: body, ModalShow: true});
    }
    hideModal() {
        this.setState({ModalShow: false});
    }
    adjustTextColor(colorIndex) {
        if(CONSTANTS.GameData.VehicleColors[colorIndex] < 8421504) {
            this.setState({VehicleColorLabelColor : "#FFFFFF"});
        }
        else {
            this.setState({VehicleColorLabelColor : "#000000"});
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
                                <Form.Label>
                                    <h3>Vehicle</h3>
                                    {
                                        (() => {
                                        if(this.selectedVehicle !== null) {
                                            return (<>
                                                ID: {this.selectedVehicle.ID} <br/>
                                                Name: {this.selectedVehicle.VehicleName}</>
                                            )
                                        }
                                        })()
                                    }
                                </Form.Label>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.FloatingLabel controlId="floatingSelect" label="Vehicle Name">
                                    <Form.Select aria-label=""onChange={this.onChangeFuncs.VehicleSelect}>
                                        {
                                            this.state.PlayerVehicleData.map(
                                                (object, index) => {
                                                    return (<option key={index} value={object.ID}>{object.VehicleName}</option>);
                                                }
                                            )
                                        }
                                        <option value="-1"></option>
                                    </Form.Select>
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.FloatingLabel label="Vehicle Wheels">
                                    <Form.Select aria-label="" ref={(ref) => {this.WheelSelect = ref}} onChange={this.onChangeFuncs.VehicleWheelSelect} disabled={this.state.WheelsDisabled}>
                                        {
                                            CONSTANTS.GameData.WheelComponentNameMap.map(
                                                (object,index) => {
                                                    if(object[1].toLowerCase() === "default")
                                                        return (<option key={index} value={object[0]} selected="true">{object[1]}</option>);
                                                    else
                                                        return (<option key={index} value={object[0]}>{object[1]}</option>);
                                                }
                                            )
                                        }
                                    </Form.Select>
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.FloatingLabel label="Vehicle Color - 1" style={{color: this.state.VehicleColorLabelColor}}>
                                    <Form.Select aria-label="" ref={(ref) => {this.SelectColor = ref}} onChange={this.onChangeFuncs.ColorSelect} disabled={this.state.WheelsDisabled} >
                                        {
                                            
                                            CONSTANTS.GameData.VehicleColors.map(
                                                (object,index) => {
                                                    let val = object.toString(16);
                                                    val = ("000000").substring(0, (6- val.length)) + val;
                                                    return (<option key={index} value={index} style={{backgroundColor: "#"+val }}></option>);
                                                }
                                            )
                                            
                                        }
                                        <option value="-1" selected="true"></option>
                                    </Form.Select>
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.FloatingLabel label="Nitro">
                                    <Form.Select aria-label="" ref={(ref) => {this.SelectNitro = ref}} onChange={this.onChangeFuncs.NitroSelect} disabled={this.state.WheelsDisabled} >
                                        {
                                            
                                            CONSTANTS.GameData.NitroComponentNameMap.map(
                                                (object,index) => {
                                                    return (<option key={index} value={object[0]}>{object[1]}</option>);
                                                }
                                            )
                                            
                                        }
                                    </Form.Select>
                                </Form.FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Button onClick={this.onClickFuncs.VehicleSave} disabled={this.state.SaveDisabled}>Save Vehicle</Button>
                            </Form.Group>
                        </Form>
                    </div>
                    <Modal show={this.state.ModalShow} onHide={this.hideModal}>
                        <Modal.Header closeButton >
                            <Modal.Title>{this.state.ModalHeader}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{this.state.ModalBody}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.hideModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
    InitializeLights() {
        
        var g_Sun = null;
        (() => {
            g_Sun = RenderEngine.Globals.CreateDirectionalLight(
                {
                    lightName: "Sun",
                    lightColor: 0xF0F0F0,
                    lightIntensity: 1.0
                }
            );
            g_Sun.radius = 50.0;
            g_Sun.position.set(10.0, 10.0, 5.0);
            g_Sun.target.position.set(0.0, 0.0, 0.0);
        
            var g_Sun2 = RenderEngine.Globals.CreateDirectionalLight(
                {
                    lightName: "Sun",
                    lightColor: 0xF0F0F0,
                    lightIntensity: 1.0
                }
            );
            g_Sun2.radius = 50.0;
            g_Sun2.position.set(-10.0, 10.0, 5.0);
            g_Sun2.target.position.set(0.0, 0.0, 0.0);
        
            var g_Sun3 = RenderEngine.Globals.CreateDirectionalLight(
                {
                    lightName: "Sun",
                    lightColor: 0xF0F0F0,
                    lightIntensity: 1.0
                }
            );
            g_Sun3.radius = 50.0;
            g_Sun3.position.set(0, 2.0, -20.0);
            g_Sun3.target.position.set(0.0, 0.0, 0.0);
    
        })();
    }
    
}

export default VehicleWindow;