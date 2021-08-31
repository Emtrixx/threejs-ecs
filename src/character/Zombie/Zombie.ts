import * as THREE from "three";
import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import { Collider } from "../components/collider";
import { Loader } from "../components/loader";
import { Movement } from "../components/movement-component";
import { ZombieInput } from "./ZombieInput";

export class Zombie extends ObjectEntity {
  constructor(params) {
    super();
    this._params = params
  }

  awake() {
    const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    const acceleration = new THREE.Vector3(1, 0.25, 50.0);
    const velocity = new THREE.Vector3(0, 0, 0);
    
    this.addComponent(new Transform(this.spawnpoint()))
    this.addComponent(new Loader("./models/Boxhead.gltf", []))
    this.addComponent(new Movement(decceleration, acceleration, velocity))
    this.addComponent(new ZombieInput)
    this.addComponent(new SpatialGridController({grid: this._params.grid}))
    this.addComponent(new Collider(3))
    super.awake()
  }

  update(deltaTime) {
    if (!this._target) {
      return;
    }
    super.update(deltaTime)
  }

  onLoad() {
    this._params.scene.add(this._target.scene);
    
  }

  spawnpoint(): Vector3 {
    const x = Math.random() * 30
    const y = 0
    const z = Math.random() * 30
    
    const position = new THREE.Vector3(x,y,z)
    return position
  }
}
