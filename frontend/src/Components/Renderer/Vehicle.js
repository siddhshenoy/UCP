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
        this.ModelName = ModelName;
        this.VehicleObject = null;
        this.VehicleData = null;
        this.VehicleWheelData = null;
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
            this.VehicleObject = new RenderEngine.Object();
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
                
                for(var i = 0; i < this.VehicleData.WheelData.Wheels.length; i++)
                {
                    this.VehicleObject.Wheels.push(new RenderEngine.Object());
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
            this.VehicleObject = new RenderEngine.Object();
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
            this.VehicleObject.Wheels.push(new RenderEngine.Object());
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
    SetHexColor(color)
    {
        if(this.VehicleObject !== null && this.VehicleObject !== undefined)
        {
            if(this.VehicleObject.GetMaterial("PrimaryColor") !== undefined) {
            this.VehicleObject.GetMaterial("PrimaryColor").color.setHex(color);
            }
        }
    }
    SetRGBColor(r, g, b)
    {
        if(this.VehicleObject !== null)
        {
            let color = (r << 16 | g << 8 | b)
            this.VehicleObject.GetMaterial("PrimaryColor").color.setHex(color);
        }
    }
    Destroy() {
        this.VehicleObject.Destroy();
    }
}

export { Vehicle, VehicleData, VehicleWheelData};