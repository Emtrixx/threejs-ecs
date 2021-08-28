import * as THREE from "three";
import BasicCharacterControllerInput from "./BasicCharacterControllerInput";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { Transform } from "../../components/transform";
import { Movement } from "../components/movement-component";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { Loader } from "../components/loader";


export default class BasicCharacterController extends ObjectEntity {

    _input: BasicCharacterControllerInput;
    _stateMachine: FiniteStateMachine;
  
    constructor(params) {
      super()
      this._params = params;
      this._stateMachine = new FiniteStateMachine();
  
      const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      const acceleration = new THREE.Vector3(1, 0.25, 50.0);
      const velocity = new THREE.Vector3(0, 0, 0);

      this.addComponent(new Transform())
      this.addComponent(new Loader("./models/soccerPlayer.obj"))
      this.addComponent(new BasicCharacterControllerInput());
      this.addComponent(new Movement(decceleration, acceleration, velocity))
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
      const p = this.getComponent(Transform).position;
      this._target.scene.position.set(p[0], p[2], p[3]);
      this._params.scene.add(this._target.scene);
    }
  }