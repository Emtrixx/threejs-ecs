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
    private modelFilepath: string;
    private animationFilepathArray: string[];
    private mixer: THREE.AnimationMixer;
    private manager: THREE.LoadingManager;
    private materialFilepath: string;

    constructor(modelFilepath: string, animationFilepathArray: Array<string> = [], material: string = "") {
        this.modelFilepath = modelFilepath
        this.animationFilepathArray = animationFilepathArray
        this.materialFilepath = material;
    }

    awake(): void {
        this.manager = this.Entity.params.manager
        this.loadModel()
    }

    update(_): void { }

    loadModel() {
        let re = /\.\w+/m

        const path = this.modelFilepath.match(re)[0]

        if (path == '.gltf' || path == '.glb') {
            this.gltfLoad(this.modelFilepath)
        } else if (path == '.obj') {
            if (this.materialFilepath.length > 1) {
                this.objMaterialLoad()
            } else {
                this.objLoad(this.modelFilepath)
            }
        }
    }

    gltfLoad(filepath) {
        const loader = new GLTFLoader(this.manager);
        loader.load(filepath, (gltf) => {
            gltf.scene.traverse((c) => {
                c.castShadow = true;
            });
            this.Entity.target = gltf;
            this.loadAnimations()
        },
            // called while loading is progressing
            xhr => {

                this.Entity.params.loadingBar.update('character', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );
    }

    objLoad(filepath) {
        const loader = new OBJLoader(this.manager);
        loader.load(
            // resource URL
            filepath,
            (object) => {
                //fit to gltf way of having everything on scene property
                const loadedObject = { scene: null };
                loadedObject.scene = object;
                this.Entity.target = loadedObject;
                this.loadAnimations()
            },
            // called while loading is progressing
            xhr => {

                this.Entity.params.loadingBar.update('character', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );
    }

    objMaterialLoad() {
        var mtlLoader = new MTLLoader(this.manager);

        mtlLoader.load(this.materialFilepath, materials => {
            materials.preload();
            var objLoader = new OBJLoader(this.manager);
            objLoader.setMaterials(materials);
            objLoader.load(this.modelFilepath, object => {
                object.traverse((c: any) => {
                    c.castShadow = true;
                    if(c.material) {
                        if(c.material.length > 1) {
                            for(let material of c.material ) {
                                material.shininess = 1
                            }
                        } else {
                            c.material.shininess = 1
                        }
                    }
                });
                const loadedObject = { scene: null };
                loadedObject.scene = object;
                this.Entity.target = loadedObject;
                this.loadAnimations()
            },
            // called while loading is progressing
            xhr => {

                this.Entity.params.loadingBar.update('character', xhr.loaded, xhr.total);

            },
            // called when loading has errors
            err => {

                console.error(err);

            }
        );

        });
    }

    loadAnimations(): void {
        if (this.animationFilepathArray.length > 0) {
            this.Entity.getComponent(FiniteStateMachine).mixer = new THREE.AnimationMixer(this.Entity.target.scene);
            this.mixer = this.Entity.getComponent(FiniteStateMachine).mixer
            for (const animationPath of this.animationFilepathArray) {
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
        const loader = new FBXLoader(this.manager)
        loader.load(animationPath,
            animation => {
                const clip = animation.animations[0];
                const action = this.mixer.clipAction(clip);
                this.Entity.animations[name] = {
                    clip,
                    action
                }
            })
    }

    gltfAnimationLoad(animationPath: string): void {
        const nameReg = /(\w+)(?:\.gl)/m
        const name = animationPath.match(nameReg)[1]
        const loader = new GLTFLoader(this.manager)
        loader.load(animationPath,
            animation => {
                const clip = animation.animations[0];
                const action = this.mixer.clipAction(clip);
                this.Entity.animations[name] = {
                    clip,
                    action
                }
            })
    }
}