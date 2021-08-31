import * as THREE from "three";
import { Vector3 } from "three";
import { Loader } from "../../character/components/loader";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";

export class DecorativeObject extends ObjectEntity{
    private _filepath: string;
    private _materialFilepath: string;

    constructor(params, filepath: string, materialFilepath: string) {
        super()
        this._params = params;
        this._filepath = filepath
        this._materialFilepath = materialFilepath
        this.addComponent(new Transform())
        this.addComponent(new Loader(this._filepath, [], this._materialFilepath))
    }
    
    awake() {
        super.awake()
    }

    update(deltaTime) {
        if (!this._target) {
          return;
        }
        super.update(deltaTime)
      }

    onLoad() {
        this.getComponent(Transform).position.set(
            (Math.random() * 2 - 1) * 300,
            0,
            (Math.random() * 2 - 1) * 300,
        )
        this._target.scene.scale.set(10,10,10)
        this._params.scene.add(this._target.scene);
    }

    spawnpoint(): Vector3 {
        const x = Math.random() * 30
        const y = 1
        const z = Math.random() * 30
        
        const position = new THREE.Vector3(x,y,z)
        return position
      }
}