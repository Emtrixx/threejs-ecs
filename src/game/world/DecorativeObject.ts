import * as CANNON from "cannon-es";
import { OLDCollider } from "../../character/components/OLDcollider";
import { Loader } from "../../character/components/loader";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "./components/SpatialHashGridController";
import { BoxCollider } from "../../components/collider/boxCollider";

export class DecorativeObject extends ObjectEntity{
    private filepath: string;
    private materialFilepath: string;

    constructor(params, filepath: string, materialFilepath: string) {
        super()
        this.params = params;
        this.filepath = filepath
        this.materialFilepath = materialFilepath
        this.addComponent(new Transform())
        this.addComponent(new Loader(this.filepath, [], this.materialFilepath))
        this.addComponent(new BoxCollider(this.params.pworld, 0, new CANNON.Vec3(0,2,0), new CANNON.Vec3(1,4,1)))
    }
    
    awake() {
        this.addComponent(new SpatialGridController({grid: this.params.grid}))
        super.awake()
    }

    update(deltaTime) {
        if (!this.target) {
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
        this.target.scene.scale.set(10,10,10)
        this.params.scene.add(this.target.scene);
        this.getComponent(BoxCollider).onLoad();
    }

    // spawnpoint(): Vector3 {
    //     const x = Math.random() * 60 - 30
    //     const y = 1
    //     const z = Math.random() * 60 - 30
        
    //     const position = new THREE.Vector3(x,y,z)
    //     console.log(position);
    //     return position
    //   }
}