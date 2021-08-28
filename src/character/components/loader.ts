import { Transform } from "../../components/transform";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";

export class Loader implements IComponent {
    Entity: ObjectEntity;
    private _filepath: string;

    constructor(filepath: string) {
        this._filepath = filepath
    }

    awake(): void {
        this.load()
    }

    update(_): void {}

    load() {
        let re = /\.\w+$/m

        if(this._filepath.match(re)[0] == '.gltf') {
            this.gltfLoad()
        } else {
            this.objLoad()
        }
    }

    gltfLoad() {
        const loader = new GLTFLoader();
        loader.load(this._filepath, (gltf) => {
          gltf.scene.traverse((c) => {
            c.castShadow = true;
          });
          this.Entity._target = gltf;;
          this.Entity.onLoad()
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

    objLoad() {
        const loader = new OBJLoader();
        loader.load(
          // resource URL
          this._filepath,
          (object) => {
            //fit to gltf way of having everything on scene property
            const loadedObject = { scene: null };
            loadedObject.scene = object;
           
            this.Entity._target = loadedObject;
            this.Entity.onLoad()
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
}