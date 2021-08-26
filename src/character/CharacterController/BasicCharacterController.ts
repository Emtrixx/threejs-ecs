import * as THREE from "three";
import BasicCharacterControllerInput from "./BasicCharacterControllerInput";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import Entity from "../../utils/ecs/Entity";
import { objmodel } from "../components/objmodel-component";


export default class BasicCharacterController extends Entity {

    _input: BasicCharacterControllerInput;
    _stateMachine: FiniteStateMachine;
    _decceleration: THREE.Vector3;
    _acceleration: THREE.Vector3;
    _velocity: THREE.Vector3;
    _params: any;
    _target: any;
  
    constructor(params) {
      super()
      this._params = params;
      this._input = new BasicCharacterControllerInput();
      this._stateMachine = new FiniteStateMachine();
  
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
      this._velocity = new THREE.Vector3(0, 0, 0);
      this.awake()
    }
  
    awake() {
      console.log('test')
      this.addComponent(new objmodel(this._target, this._params))
    }
  
    update(timeInSeconds) {
      // this._stateMachine.Update(timeInSeconds, this._input);
      if (!this._target) {
        return;
      }
  
      const velocity = this._velocity;
      const frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
          Math.abs(frameDecceleration.z), Math.abs(velocity.z));
  
      velocity.add(frameDecceleration);
      
      //add to scene because gltf uses this syntax
      const controlObject = {scene: null}
      controlObject.scene = this._target;

      const _Q = new THREE.Quaternion();
      const _A = new THREE.Vector3();
      const _R = controlObject.scene.quaternion.clone();
  
      const acc = this._acceleration.clone();
      if (this._input._keys.shift) {
        acc.multiplyScalar(2.0);
      }
  
      // if (this._stateMachine._currentState.Name == 'dance') {
      //   acc.multiplyScalar(0.0);
      // }
  
      if (this._input._keys.forward) {
        velocity.z += acc.z * timeInSeconds;
      }
      if (this._input._keys.backward) {
        velocity.z -= acc.z * timeInSeconds;
      }
      if (this._input._keys.left) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
      if (this._input._keys.right) {
        _A.set(0, 1, 0);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
        _R.multiply(_Q);
      }
  
      controlObject.scene.quaternion.copy(_R);
  
      const oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.scene.position);
  
      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.scene.quaternion);
      forward.normalize();
  
      const sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.scene.quaternion);
      sideways.normalize();
  
      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.z * timeInSeconds);
  
      controlObject.scene.position.add(forward);
      controlObject.scene.position.add(sideways);
  
      oldPosition.copy(controlObject.scene.position);
  
      // if (this._mixer) {
      //   this._mixer.update(timeInSeconds);
      // }
    }
  }