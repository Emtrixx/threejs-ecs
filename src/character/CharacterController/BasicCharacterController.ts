import * as THREE from "three";
import BasicCharacterControllerInput from "./BasicCharacterControllerInput";
import FiniteStateMachine, { BasicCharacterControllerProxy, CharacterFSM } from "../CharacterAnimation/FiniteStateMachine";
import { Transform } from "../../components/transform";
import { Movement } from "../components/movement-component";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { Loader } from "../components/loader";
import { Vector3 } from "three";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import { Collider } from "../components/collider";
import { AttackController } from "../components/attackController";
import { Stats } from "../components/stats";


export default class BasicCharacterController extends ObjectEntity {
    name: string;
    constructor(params) {
      super()
      this.name = 'player'
      this.params = params;
  
      const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      decceleration.multiplyScalar(4)
      const acceleration = new THREE.Vector3(1, 0.25, 50.0);
      acceleration.multiplyScalar(3)
      const velocity = new THREE.Vector3(0, 0, 0);

      this.addComponent(new Transform())
      const p = './models/character/'
      this.addComponent(new Loader(p+'player.glb', [p+'idle.glb', p+'walk.glb', p+'run.glb', p+'attack.glb', p+'death.glb']))
      this.addComponent(new BasicCharacterControllerInput());
      this.addComponent(new Movement(decceleration, acceleration, velocity))
      this.addComponent(new SpatialGridController({grid: this.params.grid}))

      this.addComponent(new Stats(100, 40))
      this.addComponent(new AttackController())
    }
    
    awake() {
      this.addComponent(new CharacterFSM(new BasicCharacterControllerProxy(this.animations)))
      this.addComponent(new Collider(3))
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
      this.getComponent(CharacterFSM).SetState('idle')
    }
  }