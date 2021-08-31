import * as THREE from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { Collider } from "./collider";

export class Movement implements IComponent {
  Entity: ObjectEntity;
  private _transform: Transform;
  private _decceleration: THREE.Vector3;
  private _acceleration: THREE.Vector3;
  private _velocity: THREE.Vector3;
  private _collider: Collider;
  _run: boolean;
  _jump: boolean;
  _forward: boolean;
  _backward: boolean;
  _left: boolean;
  _right: boolean;
  private _stateMachine: FiniteStateMachine;

  constructor(decelleration, acceleration, velocity) {
    this._decceleration = decelleration;
    this._acceleration = acceleration;
    this._velocity = velocity;
  }
  
  awake(): void {
    if (this.Entity.hasComponent(Collider)) {
      this._collider = this.Entity.getComponent(Collider)
    }
    if(this.Entity.hasComponent(FiniteStateMachine)) {
      this._stateMachine = this.Entity.getComponent(FiniteStateMachine)
    }
    this._transform = this.Entity.getComponent(Transform)
  }

  update(deltaTime: number): void {
    const acc = this._acceleration.clone();
    const collision = this._collider && this._collider.collision

    // Old Collision Handling
    // if (this._collider && this._collider.collision) {
    //   this._velocity.multiplyScalar(-1)
    //   acc.multiplyScalar(0)
    // }

    // if (this._collider && this._collider.collision) {
    //   this._forward = !this._forward
    //   this._backward = !this._backward
    // }

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this._decceleration.x,
      velocity.y * this._decceleration.y,
      velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(deltaTime);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this.Entity._target;

    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.scene.quaternion.clone();


    if (this._run) {
      acc.multiplyScalar(3.0);
    }

    if (this._stateMachine && this._stateMachine._currentState && this._stateMachine._currentState.name == 'attack') {
      acc.multiplyScalar(0.2);
    }

    if (this._forward) {
      velocity.z += acc.z * deltaTime;
    }
    if (this._backward) {
      velocity.z -= acc.z * deltaTime;
    }

    // Another way of handling collision
    // if(this._forward && collision) {
    //   velocity.z -= acc.z * deltaTime
    // } else if (this._forward) {
    //   velocity.z += acc.z * deltaTime;
    // }

    // if(this._backward && collision) {
    //   velocity.z += acc.z * deltaTime
    // } else if (this._backward) {
    //   velocity.z -= acc.z * deltaTime;
    // }

    if (this._left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 2.0 * Math.PI * deltaTime * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 2.0 * -Math.PI * deltaTime * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.scene.quaternion.copy(_R);


    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.scene.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.scene.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * deltaTime);
    forward.multiplyScalar(velocity.z * deltaTime);

    const newPosition = new THREE.Vector3();
    newPosition.copy(this._transform.position);
    newPosition.add(forward)
    newPosition.add(sideways)

    if(this._collider && !this._collider.isColliding(newPosition)) {
      this._transform.position.add(forward);
      this._transform.position.add(sideways);
    }
  }

}
