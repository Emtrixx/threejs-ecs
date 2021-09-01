import * as THREE from "three";
import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import { BasicCharacterControllerProxy, ZombieFSM } from "../CharacterAnimation/FiniteStateMachine";
import { AttackController } from "../components/attackController";
import { Collider } from "../components/collider";
import { Loader } from "../components/loader";
import { Movement } from "../components/movement-component";
import { Stats } from "../components/stats";
import { ZombieInput } from "./ZombieInput";

export class Zombie extends ObjectEntity {
  name: string;
  constructor(params) {
    super();
    this.name = 'zombie'
    this.params = params
  }

  awake() {
    const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    const acceleration = new THREE.Vector3(1, 0.25, 50.0);
    acceleration.multiplyScalar(0.5)
    const velocity = new THREE.Vector3(0, 0, 0);
    
    this.addComponent(new Transform(this.spawnpoint()))
    const p = './models/zombie/'
    this.addComponent(new Loader("./models/zombie/Zombie.glb", [p+'idle.glb', p+'walk.glb', p+'run.glb', p+'attack.glb', p+'death.glb']))
    this.addComponent(new Movement(decceleration, acceleration, velocity))
    this.addComponent(new ZombieInput)
    this.addComponent(new SpatialGridController({grid: this.params.grid}))
    this.addComponent(new Stats(100, 100))
    this.addComponent(new Collider(3))
    this.addComponent(new AttackController())
    this.addComponent(new ZombieFSM(new BasicCharacterControllerProxy(this.animations)))
    super.awake()
  }

  update(deltaTime) {
    if (!this.target) {
      return;
    }
    super.update(deltaTime)
  }

  onLoad() {
    this.target.scene.scale.set(4,4,4)
    this.params.scene.add(this.target.scene);
    this.getComponent(ZombieFSM).SetState('idle')
  }

  spawnpoint(): Vector3 {
    const x = Math.random() * 80
    const y = 0
    const z = Math.random() * 80
    
    const position = new THREE.Vector3(x,y,z)
    return position
  }
}
