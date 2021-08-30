import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";
import * as THREE from "three";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export class Loader implements IComponent {
    Entity: ObjectEntity;
    private _modelFilepath: string;
    private _animationFilepathArray: string[];
    private _mixer: THREE.AnimationMixer;
    private _manager: THREE.LoadingManager;
    private _materialFilepath: any;

    constructor(modelFilepth: string, animationFilepathArray: Array<string>) {
        this._modelFilepath = modelFilepth
        this._animationFilepathArray = animationFilepathArray
    }

    awake(): void {
        this._manager = this.Entity._params.manager
        this.loadModel()
    }

    update(_): void { }

    loadModel() {
        let re = /\.\w+$/m
        let path =this._modelFilepath.match(re)[0];

        if (path == '.gltf' || path == '.glb') {
            this.gltfLoad(this._modelFilepath)
        } else if (path == '.obj') {
           
            if (this._materialFilepath.length > 1) {
                this.objMaterialLoad()
            } else {
                this.objLoad(this._modelFilepath)
            }
        }

    }

    gltfLoad(filepath) {
        const loader = new GLTFLoader(this._manager);
        loader.load(filepath, (gltf) => {
            gltf.scene.traverse((c) => {
                c.castShadow = true;
            });
            this.Entity._target = gltf;
            this.loadAnimations()
        },
            // called while loading is progressing
            xhr => {

                this.Entity._params.loadingBar.update('character', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );
    }

    objLoad(filepath) {
        const loader = new OBJLoader(this._manager);
        loader.load(
            // resource URL
            filepath,
            (object) => {
                //fit to gltf way of having everything on scene property
                const loadedObject = { scene: null };
                loadedObject.scene = object;
                this.Entity._target = loadedObject;
                this.loadAnimations()
            },
            // called while loading is progressing
            xhr => {

                this.Entity._params.loadingBar.update('character', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );
    }

    objMaterialLoad() {
        var mtlLoader = new MTLLoader(this._manager);
        
                
        mtlLoader.load(this._materialFilepath, materials => {
            
            materials.preload();

          
            var objLoader = new OBJLoader(this._manager);
            objLoader.setMaterials(materials);
            objLoader.load(this._modelFilepath, object => {
                const loadedObject = { scene: null };
                loadedObject.scene = object;
                this.Entity._target = loadedObject;
                this.loadAnimations()
            },
            // called while loading is progressing
            xhr => {

                this.Entity._params.loadingBar.update('character', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );

        });
    }

    loadAnimations(): void {
        if (this._animationFilepathArray.length > 0) {
            this.Entity.getComponent(FiniteStateMachine)._mixer = new THREE.AnimationMixer(this.Entity._target.scene);
            this._mixer = this.Entity.getComponent(FiniteStateMachine)._mixer
            for (const animationPath of this._animationFilepathArray) {
                let re = /\.\w+$/m
                if (animationPath.match(re)[0] == '.gltf' || animationPath.match(re)[0] == '.glb') {
                    this.gltfAnimationLoad(animationPath)
                } else {
                    this.fbxAnimationLoad(animationPath)
                }
            }
        }
    }

    fbxAnimationLoad(animationPath: string): void {
        const nameReg = /(\w+)(?:\.fbx)/m
        const name = animationPath.match(nameReg)[1]
        const loader = new FBXLoader(this._manager)
        loader.load(animationPath,
            animation => {
                const clip = animation.animations[0];
                const action = this._mixer.clipAction(clip);
                this.Entity._animations[name] = {
                    clip,
                    action
                }
            })
    }

    gltfAnimationLoad(animationPath: string): void {
        const nameReg = /(\w+)(?:\.gl)/m
        const name = animationPath.match(nameReg)[1]
        const loader = new GLTFLoader(this._manager)
        loader.load(animationPath,
            animation => {
                const clip = animation.animations[0];
                const action = this._mixer.clipAction(clip);
                this.Entity._animations[name] = {
                    clip,
                    action
                }
            })
    }

    mtlLoad(materialPath) {
        const loader = new MTLLoader(this._manager)
        loader.load(materialPath,
            materialObject => {
                materialObject.preload()
                // console.log(materialObject);
            })
    }
}