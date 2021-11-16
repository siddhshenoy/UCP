/**
 * Rendering Engine written to interface ThreeJS and abstract its function
 * Sole purpose of this class is to create a renderer on screen and have lights and GLTF objects in it
 * 
 * Author: Siddharth Shenoy
 * 
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' //'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';

var RenderEngine = {
    Maths : class{
        static DegToRad(deg)
        {
            return ((Math.PI * deg) / 180.0);
        }
        static RadToDeg(rad)
        {
            return ((180.0 * rad) / Math.PI);
        }
    },
    Globals : class {
        static g_RendererSize = [];
        
        static g_Renderer = null;
        static g_Scene = null;
        static g_Camera = null;
        static g_ObjectLoader = null;
        static g_OrbitControls = null;
        
        static g_RendererStatus = false;
        static g_SceneStatus = false;
        static g_CameraStatus = false;
        static g_ObjectLoaderStatus = false;
        static g_OrbitControlsStatus = false;
        
        static g_LightCount = [];
        static g_Lights = [];
        
        static g_RenderFrame = 0;

        static g_LoadingObject = false;
        
        static InitLights() {
            RenderEngine.Globals.g_LightCount["DirectionalLight"] = 0;
            RenderEngine.Globals.g_LightCount["HemisphereLight"] = 0;
        }
        static CreateRenderer(width, height, domElement=undefined)
        {
            RenderEngine.Globals.g_Renderer = new THREE.WebGLRenderer();
            if(RenderEngine.Globals.g_Renderer !== null)
            {
                RenderEngine.Globals.g_RendererSize["width"] = width;
                RenderEngine.Globals.g_RendererSize["height"] = width;
                RenderEngine.Globals.g_Renderer.setSize(width, height);
                if(domElement !== undefined)
                {
                    domElement.appendChild(RenderEngine.Globals.g_Renderer.domElement);
                }
                else
                {
                    document.body.appendChild(RenderEngine.Globals.g_Renderer.domElement);
                }
                RenderEngine.Globals.g_RendererStatus = true;
            }
            return RenderEngine.Globals.g_Renderer;
        }
        static CreateScene()
        {
            RenderEngine.Globals.g_Scene = new THREE.Scene();
            if(RenderEngine.Globals.g_Scene !== null)
            {
                RenderEngine.Globals.g_SceneStatus = true;
            }
            return RenderEngine.Globals.g_Scene;
        }
        static CreatePerspectiveCamera(fov, aspectRatio, near, far)
        {
            RenderEngine.Globals.g_Camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
            if(RenderEngine.Globals.g_Camera !== null)
            {
                RenderEngine.Globals.g_CameraStatus = true;
            }
            return RenderEngine.Globals.g_Camera;
        }
        static RenderLoop()
        {
            //console.log("Rendering..");
            requestAnimationFrame(RenderEngine.Globals.RenderLoop);
            if(RenderEngine.Globals.g_RendererStatus && RenderEngine.Globals.g_CameraStatus && RenderEngine.Globals.g_SceneStatus)
            {
                RenderEngine.Globals.g_RenderFrame = RenderEngine.Globals.g_Renderer.render(RenderEngine.Globals.g_Scene, RenderEngine.Globals.g_Camera);
            }
            if(RenderEngine.Globals.g_OrbitControlsStatus)
            {
                RenderEngine.Globals.g_OrbitControls.update();
            }
        }
        static CreateGLTFLoader()
        {
            RenderEngine.Globals.g_ObjectLoader = new GLTFLoader();
            if(RenderEngine.Globals.g_ObjectLoader !== null)
            {
                RenderEngine.Globals.g_ObjectLoaderStatus = true;
            }
            return RenderEngine.Globals.g_ObjectLoader;
        }
        static CreateHemisphereLight(struct)
        {
            if(struct !== undefined)
            {
                let lightName = struct.lightName;
                let lightColors = (struct.lightColors === undefined) ? ([0xFFFFFF, 0xFFFFFF]) : struct.lightColors;
                let lightIntensity = (struct.lightIntensity === undefined) ? 0.5 : struct.lightIntensity;
                let sLightName = "HemisphereLight";
                if(lightName === undefined)
                {
                    sLightName += RenderEngine.Globals.g_LightCount["HemisphereLight"];
                }
                else
                {
                    sLightName = lightName;
                }
                RenderEngine.Globals.g_LightCount["HemisphereLight"]++;
                RenderEngine.Globals.g_Lights[sLightName] = new THREE.HemisphereLight(lightColors[0], lightColors[1], lightIntensity);
                if(RenderEngine.Globals.g_SceneStatus)
                {
                    RenderEngine.Globals.g_Scene.add(RenderEngine.Globals.g_Lights[sLightName]);
                }
                return RenderEngine.Globals.g_Lights[sLightName];
            }
        }
        static CreateDirectionalLight(struct)
        {
            if(struct !== undefined)
            {
                let lightName = struct.lightName
                let lightColor = (struct.lightColor === undefined) ? 0xFFFFFF : struct.lightColor;
                let lightIntensity = (struct.lightIntensity === undefined) ? 0.5 : struct.lightIntensity;
                let sLightName = "DirectionalLight";
                if(lightName === undefined)
                {
                    sLightName += RenderEngine.Globals.g_LightCount["DirectionalLight"];
                }
                else
                {
                    sLightName = lightName;
                }
                RenderEngine.Globals.g_LightCount["DirectionalLight"]++;
                RenderEngine.Globals.g_Lights[sLightName] = new THREE.DirectionalLight(lightColor, lightIntensity);
                if(RenderEngine.Globals.g_SceneStatus)
                {
                    RenderEngine.Globals.g_Scene.add(RenderEngine.Globals.g_Lights[sLightName]);
                }
                return RenderEngine.Globals.g_Lights[sLightName];
            }
            return null;
        }
        static CreateOrbitControls()
        {
            RenderEngine.Globals.g_OrbitControls = new OrbitControls(RenderEngine.Globals.g_Camera, RenderEngine.Globals.g_Renderer.domElement);
            RenderEngine.Globals.g_OrbitControlsStatus = true;
            return RenderEngine.Globals.g_OrbitControls;
        }
        ///
        ///     Getters
        ///
        static GetCamera()
        {
            return RenderEngine.Globals.g_Camera;
        }
        static GetRenderer()
        {
            return RenderEngine.Globals.g_Renderer;
        }
        static GetScene()
        {
            return RenderEngine.Globals.g_Scene;
        }
        static GetObjectLoader()
        {
            return RenderEngine.Globals.g_ObjectLoader;
        }
    },
    Object3D : class
    {
        constructor(name="")
        {
            this.m_Name = name;
            this.m_Object = null;
            this.m_Children = [];
            this.m_Materials = [];
        }
        GetName()
        {
            return this.m_Name
        }
        GetObject()
        {
            return this.m_Object;
        }
        GetChildren()
        {
            return this.m_Children
        }
        AddChild(o)
        {
            // if(this.m_Object !== null) {
            //     this.m_Object
            // }
            this.m_Children.push(o);
            
        }
        RemoveChild(o) {
            
            for(let k = 0; k < this.m_Children.length; k++) {
                if(this.m_Children[k] === o) {
                    this.m_Children.splice(k,1);
                    break;
                }
            }
        }
        Destroy()
        {
            if(RenderEngine.Globals.g_SceneStatus )
            {
                console.log("RenderEngine: ");
                console.log(RenderEngine.Globals.g_Scene);
                console.log("Removing Object:");
                console.log(this.m_Object);
                for(let i = 0; i < this.m_Materials.length; i++)
                    this.m_Materials[i].dispose();
                for(let i = 0; i < this.m_Children.length; i++) 
                {
                    console.log("Destroying child element:");
                    console.log(this.m_Children[i]);
                    this.m_Children[i].Destroy();
                }
                RenderEngine.Globals.g_Scene.remove(this.m_Object);
                this.m_Object = null;
                console.log("Removed Object");
            }
            else
            {
                console.log("Could not remove the object..");
            }
        }
        GetMaterials()
        {
            return this.m_Materials;
        }
        GetMaterial(matName)
        {
            return this.m_Materials[matName];
        }
        ExtractMaterials(mesh)
        {
            if(mesh !== null)
            {
                if(mesh.material !== undefined)
                {
                    if(mesh.material !== null)
                    {
                        let matName = mesh.material.name;
                        this.m_Materials[matName] = mesh.material;
                    }
                }
                if(mesh.children !== undefined)
                {
                    if(mesh.children !== null)
                    {
                        mesh.children.forEach((meshItem) =>
                        {
                            this.ExtractMaterials(meshItem);
                        });
                    }
                }
            }
        }
        LoadObject(objectPath, postFunction=null)
        {
            if(RenderEngine.Globals.g_ObjectLoaderStatus)
            {
                let This = this;
                let GLTFLoader = RenderEngine.Globals.g_ObjectLoader;
                GLTFLoader.load(objectPath, function(GLTF)
                {
                    This.m_Object = GLTF.scene;
                    if(RenderEngine.Globals.g_SceneStatus)
                    {
                        RenderEngine.Globals.g_Scene.add(This.m_Object);
                        //Check for materials
                        This.ExtractMaterials(This.GetObject());
                        //Execute the postFunction
                        if(postFunction !== null)
                        {
                            if(typeof(postFunction) == "function")
                            {
                                
                                postFunction(This);
                                
                            }
                        }
                    }
                });
            }
        }    
    }
};
export {RenderEngine};