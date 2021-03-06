import { RenderEngine } from "./RenderEngine.js";

class VehicleData
{
    static vData = null;
    static SetVehicleData(data)
    {
        VehicleData.vData = data;
    }
    static GetVehicleData()
    {
        return VehicleData.vData.Vehicles;
    }
    static GetVehicleDataForVehicle(VehicleModelName)
    {
        let res = VehicleData.vData.Vehicles[VehicleModelName];
        return res;
    }
}
class VehicleWheelData
{
    static vWheelData = null;
    static SetVehicleWheelData(data)
    {
        VehicleWheelData.vWheelData = data;
    }
    static GetVehicleWheelData()
    {
        return VehicleWheelData.vWheelData;
    }
    static GetVehicleWheelDataForVehicle(VehicleModelName)
    {
        let res = VehicleWheelData.vWheelData.Wheels[VehicleModelName];
        return res;
    }
}

class Vehicle
{
    constructor(ModelName,)
    {
        this.LoadPath = null;
        this.WheelPath = null;
        this.WheelModPath = null;
        this.ModPath = null;
        this.ModelName = ModelName;
        this.VehicleObject = null;
        this.VehicleData = null;
        this.VehicleWheelData = null;
        this.VehicleColor = null;
        this.CurrentWheelName = "DEFAULT";
    }
    SetLoadPath(path) {
        this.LoadPath = path;
    }
    SetWheelPath(path) {
        this.WheelPath = path;
    }
    SetWheelModPath(path) {
        this.WheelModPath = path;
    }
    SetModPath(path) {
        this.ModPath = path;
    }
    SetModelName(ModelName)
    {
        this.ModelName = ModelName;
    }
    GetModelName()
    {
        return this.ModelName;
    }
    GetObject()
    {
        return this.VehicleObject;
    }
    LoadVehicle(postLoadFunction=null)
    {
        if(this.VehicleObject === null) {
            this.VehicleObject = new RenderEngine.Object3D();
            let ModelName = this.ModelName;
            //console.log("Loading file from : " + (this.LoadPath + this.ModelName + ".glb"));
            this.VehicleObject.LoadObject((this.LoadPath  + this.ModelName + ".glb"), (object) => {
                //console.log(object);
                object.GetObject().position.set(0.0, 0.0, 0.0);
                object.GetObject().rotation.set(0.0, RenderEngine.Maths.DegToRad(180.0), 0.0);
                // Glass Material loop, max permission glass mats are 5
                for(let j = 0; j < 5; j++) {
                    let glassMatString = ("GlassMaterial" + j);
                    if(object.GetMaterial(glassMatString) !== undefined)
                    {
                        object.GetMaterial(glassMatString).transparent = true;
                        object.GetMaterial(glassMatString).opacity = 0.2;
                    }
                }
                //object.GetObject().scale.set(1.1, 1.1, 1.1);
                let wheelPrefix = "DefaultWheel_";
                this.VehicleData = VehicleData.GetVehicleDataForVehicle(ModelName);
                this.VehicleWheelData = VehicleWheelData.GetVehicleWheelDataForVehicle(ModelName);
                //console.log(this.VehicleWheelData);
                this.VehicleObject.Wheels = [];
                this.VehicleObject.Spoiler = null;
                this.VehicleObject.Nitro = null;
                this.VehicleObject.SideSkirts = [];
                for(var i = 0; i < this.VehicleData.WheelData.Wheels.length; i++)
                {
                    this.VehicleObject.Wheels.push(new RenderEngine.Object3D());
                    this.VehicleObject.Wheels[i].WheelIndex = i;
                    this.VehicleObject.Wheels[i].WheelData = this.VehicleData.WheelData.Wheels[i];
                    this.VehicleObject.Wheels[i].WheelSizeData = this.VehicleWheelData;
                }
                for(let i = 0; i < this.VehicleData.WheelData.Wheels.length; i++)
                {
                    let DefaultWheelPath = (this.WheelPath) + wheelPrefix + ModelName + ".glb";
                    this.VehicleObject.Wheels[i].LoadObject(DefaultWheelPath, function(wheelObject) {
                        
                        let x = wheelObject.WheelData.WheelPosition[0];
                        let y = wheelObject.WheelData.WheelPosition[1];
                        let z = wheelObject.WheelData.WheelPosition[2];
                        //console.log(`${x} ${y} ${z}`);
                        wheelObject.GetObject().position.set(x, y, z);
                        if(wheelObject.WheelData.WheelName.indexOf("Left") != -1)
                        {
                            wheelObject.GetObject().rotation.set(0.0, RenderEngine.Maths.DegToRad(180.0) , 0.0);
                        }
                        
                        //console.log(wheelObject.GetObject().rotation);
                    })
                }
                if(postLoadFunction !== undefined)
                {
                    if(postLoadFunction !== null)
                    {
                        if(typeof(postLoadFunction) == "function")
                        {
                            postLoadFunction();
                        }
                    }
                }

            });
        }
    }
    LoadVehicleWithoutWheels(postLoadFunction=null)
    {
        if(this.VehicleObject === null) {
            this.VehicleObject = new RenderEngine.Object3D();
            let ModelName = this.ModelName;
            //console.log("Loading file from : " + (this.LoadPath + this.ModelName + ".glb"));
            this.VehicleObject.LoadObject((this.LoadPath + this.ModelName + ".glb"), (object) => {
                //console.log(object);
                object.GetObject().position.set(0.0, 0.0, 0.0);
                object.GetObject().rotation.set(0.0, RenderEngine.Maths.DegToRad(180.0), 0.0);
                object.GetMaterial("GlassMaterial0").transparent = true;
                object.GetMaterial("GlassMaterial0").opacity = 0.2;
                if(object.GetMaterial("GlassMaterial1") !== undefined)
                {
                    object.GetMaterial("GlassMaterial1").transparent = true;
                    object.GetMaterial("GlassMaterial1").opacity = 0.2;
                }
                //object.GetObject().scale.set(1.1, 1.1, 1.1);
                let wheelPrefix = "DefaultWheel_";
                this.VehicleData = VehicleData.GetVehicleDataForVehicle(ModelName);
                this.VehicleWheelData = VehicleWheelData.GetVehicleWheelDataForVehicle(ModelName);
                //console.log(this.VehicleWheelData);
                this.VehicleObject.Wheels = [];
                this.VehicleObject.Spoiler = null;
                this.VehicleObject.Nitro = null;
                this.VehicleObject.SideSkirts = [];
                if(postLoadFunction !== undefined)
                {
                    if(postLoadFunction !== null)
                    {
                        if(typeof(postLoadFunction) == "function")
                        {
                            postLoadFunction(this);
                        }
                    }
                }

            });
        }
    }
    ReplaceWheels(WheelName, WheelModelName)
    {
        //debugger;
        let wheelPrefix = "DefaultWheel_";
        this.CurrentWheelName = WheelName;
        //console.log("Replace Wheels===");
        //console.log("Wheel Size: "  + this.VehicleObject.Wheels.length);
        //console.log(this.VehicleObject.Wheels);
        if(this.VehicleObject.Wheels !== undefined) {
            for(let i = 0; i < this.VehicleObject.Wheels.length; i++)
            {
                //console.log(this.VehicleObject.Wheels[i]);
                //console.log("Destroying Wheel %d",i);
                this.VehicleObject.Wheels[i].Destroy();
                this.VehicleObject.Wheels[i] = null;
            }
        }
        for(let i = 0; i < this.VehicleObject.Wheels.length; i++)
        {
            this.VehicleObject.Wheels.pop();
        }
        this.VehicleObject.Wheels = [];
        //console.log("this.VehicleObject: ");
        //console.log(this.VehicleObject.Wheels);
        for(var i = 0; i < this.VehicleData.WheelData.Wheels.length; i++)
        {
            this.VehicleObject.Wheels.push(new RenderEngine.Object3D());
            this.VehicleObject.Wheels[i].WheelIndex = i;
            this.VehicleObject.Wheels[i].WheelData = this.VehicleData.WheelData.Wheels[i];
            this.VehicleObject.Wheels[i].WheelSizeData = this.VehicleWheelData;
            this.VehicleObject.AddChild(this.VehicleObject.Wheels[i]);
            //this.VehicleObject.Wheels[i].WheelSizeData = this.VehicleWheelData.
        }
        let WheelLoadPath = "";
        if(WheelName == "Default")
        {
            WheelLoadPath = this.WheelPath + wheelPrefix + this.ModelName + ".glb";
        }
        else
        {
            WheelLoadPath = this.WheelModPath  + WheelModelName + ".glb";
        }
        //console.log("WheelLoadPath: '" + WheelLoadPath + "'");
        for(let i = 0; i < this.VehicleData.WheelData.Wheels.length; i++)
        {
            // let DefaultWheelPath = "Models/VehicleWheels/" + wheelPrefix + WheelModelName + ".glb";
            this.VehicleObject.Wheels[i].LoadObject(WheelLoadPath, function(wheelObject) {
                
                let x = wheelObject.WheelData.WheelPosition[0];
                let y = wheelObject.WheelData.WheelPosition[1];
                let z = wheelObject.WheelData.WheelPosition[2];
                //console.log(`${x} ${y} ${z}`);
                wheelObject.GetObject().position.set(x, y, z);
                if(wheelObject.WheelData.WheelName.indexOf("Left") != -1)
                {
                    wheelObject.GetObject().rotation.set(0.0, RenderEngine.Maths.DegToRad(180.0) , 0.0);
                }
                if(WheelName != "Default")
                {
                    
                    //console.log(wheelObject.WheelSizeData);
                    if(wheelObject.WheelData.WheelName.indexOf("Front") != -1) {
                        let scale_x =  wheelObject.WheelSizeData.WheelSize["Front"][0];
                        let scale_y =  wheelObject.WheelSizeData.WheelSize["Front"][1];
                        let scale_z =  wheelObject.WheelSizeData.WheelSize["Front"][2];
                        if(WheelName == "Offroad")
                            scale_x = 1.0;
                        wheelObject.GetObject().scale.set(scale_x, scale_y, scale_z);   
                    }
                    else if(wheelObject.WheelData.WheelName.indexOf("Rear") != -1) {
                        let scale_x =  wheelObject.WheelSizeData.WheelSize["Rear"][0];
                        let scale_y =  wheelObject.WheelSizeData.WheelSize["Rear"][1];
                        let scale_z =  wheelObject.WheelSizeData.WheelSize["Rear"][2];
                        if(WheelName == "Offroad")
                            scale_x = 1.0;
                        wheelObject.GetObject().scale.set(scale_x, scale_y, scale_z);
                    }
                }
                
                //console.log(wheelObject.GetObject().rotation);
            });
        }
    }
    /*
    ReplaceSideSkirts(SideSkirtName) {
        let SideSkirtObject = [];
        let data = this.VehicleData.ModsData.ModData;
        if(data !== null) {
            for(let i = 0; i < data.length; i++) {
                if(data[i].ModName.toLowerCase() == "sideskirtleft" || data[i].ModName.toLowerCase() == "sideskirtright")
                {
                    SideSkirtObject.push(data[i]);
                }
            }
        }
        for(let i = 0; i < SideSkirtObject.length; i++) {
            if(SideSkirtObject[i] !== null) {
                if(this.VehicleObject.Spoiler !== null) {
                    this.VehicleObject.RemoveChild(this.VehicleObject.Spoiler);
                    this.VehicleObject.Spoiler.Destroy();
                    this.VehicleObject.Spoiler = null;
                }
				this.VehicleObject.Spoiler = new RenderEngine.Object3D();
				this.VehicleObject.AddChild(this.VehicleObject.Spoiler);
                let This = this;
				this.VehicleObject.Spoiler.LoadObject((this.ModPath + SpoilerName + ".glb"), function(loadedSpoiler) {
					let pX = SpoilerObject.ModPosition[0];
					let pY = SpoilerObject.ModPosition[1];
					let pZ = SpoilerObject.ModPosition[2];
					let rX = RenderEngine.Maths.DegToRad(SpoilerObject.ModRotation[0]);
					let rY = RenderEngine.Maths.DegToRad(SpoilerObject.ModRotation[1] + 180);
					let rZ = RenderEngine.Maths.DegToRad(SpoilerObject.ModRotation[2]);
					loadedSpoiler.GetObject().position.set(pX, pY, pZ);
					loadedSpoiler.GetObject().rotation.set(rX, rY, rZ);
                    let PrimaryColorMat = loadedSpoiler.GetMaterial("PrimaryColor");
                    if(PrimaryColorMat !== undefined) {
                        if(PrimaryColorMat !== null) {
                            PrimaryColorMat.color.setHex(This.VehicleColor);
                        }
                    }
				});

			} else {
				console.group();
				console.log("SPOILER LOAD FAILED");
				console.log("The spoiler named %s could not be loaded as the vehicle did not have any spoiler data!", SpoilerName);
				console.groupEnd();
			}
        }
    }*/
    ReplaceNitros(NitroName) {
        let NitroObject = null;
        let data = this.VehicleData.ModsData.ModData;
        console.group();
		console.log("ReplaceNitros:");
		console.log("this.VehicleData: ");
		console.log(this.VehicleData);
        console.groupEnd();
        if(data !== null) {
			for(var i = 0; i < data.length; i++) {
				if(data[i].ModName !== "") {
					if(data[i].ModName.toLowerCase() === "nitro") {
						NitroObject = data[i];
						break;
					}
				}
			}
			if(NitroObject !== null) {
                if(this.VehicleObject.Nitro !== null) {
                    this.VehicleObject.RemoveChild(this.VehicleObject.Nitro);
                    this.VehicleObject.Nitro.Destroy();
                    this.VehicleObject.Nitro = null;
                }
				this.VehicleObject.Nitro = new RenderEngine.Object3D();
				this.VehicleObject.AddChild(this.VehicleObject.Nitro);
				this.VehicleObject.Nitro.LoadObject((this.ModPath + NitroName + ".glb"), function(loadedNitro) {
					let pX = NitroObject.ModPosition[0];
					let pY = NitroObject.ModPosition[1];
					let pZ = NitroObject.ModPosition[2];
					let rX = RenderEngine.Maths.DegToRad(NitroObject.ModRotation[0]);
					let rY = RenderEngine.Maths.DegToRad(NitroObject.ModRotation[1] + 180);
					let rZ = RenderEngine.Maths.DegToRad(NitroObject.ModRotation[2]);
					loadedNitro.GetObject().position.set(pX + 0.15, pY, pZ);
					loadedNitro.GetObject().rotation.set(rX, rY, rZ);
				});

			} else {
				console.group();
				console.log("NITRO LOAD FAILED");
				console.log("The spoiler named %s could not be loaded as the vehicle did not have any nitro data!", NitroName);
				console.groupEnd();
			}
		}
    }
    ReplaceSpoiler(SpoilerName) {
        
        let SpoilerObject = null;
        let data = this.VehicleData.ModsData.ModData;
		console.group();
		console.log("ReplaceSpoiler:");
		console.log("this.VehicleData: ");
		console.log(this.VehicleData);
		console.groupEnd();
		if(data !== null) {
			for(var i = 0; i < data.length; i++) {
				if(data[i].ModName !== "") {
					if(data[i].ModName.toLowerCase() === "spoiler") {
						SpoilerObject = data[i];
						break;
					}
				}
			}
			if(SpoilerObject !== null) {
                if(this.VehicleObject.Spoiler !== null) {
                    this.VehicleObject.RemoveChild(this.VehicleObject.Spoiler);
                    this.VehicleObject.Spoiler.Destroy();
                    this.VehicleObject.Spoiler = null;
                }
				this.VehicleObject.Spoiler = new RenderEngine.Object3D();
				this.VehicleObject.AddChild(this.VehicleObject.Spoiler);
                let This = this;
				this.VehicleObject.Spoiler.LoadObject((this.ModPath + SpoilerName + ".glb"), function(loadedSpoiler) {
					let pX = SpoilerObject.ModPosition[0];
					let pY = SpoilerObject.ModPosition[1];
					let pZ = SpoilerObject.ModPosition[2];
					let rX = RenderEngine.Maths.DegToRad(SpoilerObject.ModRotation[0]);
					let rY = RenderEngine.Maths.DegToRad(SpoilerObject.ModRotation[1] + 180);
					let rZ = RenderEngine.Maths.DegToRad(SpoilerObject.ModRotation[2]);
					loadedSpoiler.GetObject().position.set(pX, pY, pZ);
					loadedSpoiler.GetObject().rotation.set(rX, rY, rZ);
                    let PrimaryColorMat = loadedSpoiler.GetMaterial("PrimaryColor");
                    if(PrimaryColorMat !== undefined) {
                        if(PrimaryColorMat !== null) {
                            PrimaryColorMat.color.setHex(This.VehicleColor);
                        }
                    }
				});

			} else {
				console.group();
				console.log("SPOILER LOAD FAILED");
				console.log("The spoiler named %s could not be loaded as the vehicle did not have any spoiler data!", SpoilerName);
				console.groupEnd();
			}
		}
    }
    SetHexColor(color)
    {
        this.VehicleColor = color;
        if(this.VehicleObject !== null && this.VehicleObject !== undefined)
        {
            if(this.VehicleObject.GetMaterial("PrimaryColor") !== undefined) {
                this.VehicleObject.GetMaterial("PrimaryColor").color.setHex(color);
                if(this.VehicleObject.Spoiler !== undefined) {
                    if(this.VehicleObject.Spoiler !== null) {
                        let PrimaryColorMat = this.VehicleObject.Spoiler.GetMaterial("PrimaryColor");
                        if(PrimaryColorMat !== undefined) {
                            if(PrimaryColorMat !== null) {
                                PrimaryColorMat.color.setHex(this.VehicleColor);
                            }
                        }
                    }
                }
            }
        }
    }
    SetRGBColor(r, g, b)
    {
        if(this.VehicleObject !== null)
        {
            let color = (r << 16 | g << 8 | b);
            this.VehicleColor = color;
            this.VehicleObject.GetMaterial("PrimaryColor").color.setHex(color);
        }
    }
    Destroy() {
        this.VehicleObject.Destroy();
    }
}

export { Vehicle, VehicleData, VehicleWheelData};