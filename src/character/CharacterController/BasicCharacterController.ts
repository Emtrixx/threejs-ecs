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


export default class BasicCharacterController extends ObjectEntity {
    constructor(params) {
      super()
      this._params = params;
  
      const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      const acceleration = new THREE.Vector3(1, 0.25, 50.0);
      const velocity = new THREE.Vector3(0, 0, 0);

      this.addComponent(new Transform())
      const p = './models/character/'
      this.addComponent(new Loader(p+'player.glb', [p+'idle.glb', p+'walk.glb', p+'run.glb', p+'attack.glb', p+'death.glb']))
      this.addComponent(new BasicCharacterControllerInput());
      this.addComponent(new Movement(decceleration, acceleration, velocity))
      this.addComponent(new SpatialGridController({grid: this._params.grid}))
      this.addComponent(new Collider(4))
    }
    
    awake() {
      this.addComponent(new CharacterFSM(new BasicCharacterControllerProxy(this._animations)))
      super.awake()
    }
  
    update(deltaTime) {
      if (!this._target) {
        return;
      }
      super.update(deltaTime)
    }

    onLoad() {
      this._target.scene.scale.set(5,5,5)
      this._params.scene.add(this._target.scene);
      this.getComponent(CharacterFSM).SetState('idle')
    }
  }