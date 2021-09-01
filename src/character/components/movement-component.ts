import * as THREE from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { Collider } from "./collider";

export class Movement implements IComponent {
  Entity: ObjectEntity;
  private transform: Transform;
  private stateMachine: FiniteStateMachine;
  private collider: Collider;
  private decceleration: THREE.Vector3;
  private acceleration: THREE.Vector3;
  private velocity: THREE.Vector3;
  run: boolean;
  jump: boolean;
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;

  constructor(decelleration, acceleration, velocity) {
    this.decceleration = decelleration;
    this.acceleration = acceleration;
    this.velocity = velocity;
  }
  
  awake(): void {
    if (this.Entity.hasComponent(Collider)) {
      this.collider = this.Entity.getComponent(Collider)
    }
    if(this.Entity.hasComponent(FiniteStateMachine)) {
      this.stateMachine = this.Entity.getComponent(FiniteStateMachine)
    }
    this.transform = this.Entity.getComponent(Transform)
  }

  update(deltaTime: number): void {
    const acc = this.acceleration.clone();
    const collision = this.collider && this.collider.collision

    // Old Collision Handling
    // if (this.collider && this.collider.collision) {
    //   this.velocity.multiplyScalar(-1)
    //   acc.multiplyScalar(0)
    // }

    // if (this.collider && this.collider.collision) {
    //   this.forward = !this.forward
    //   this.backward = !this.backward
    // }

    const velocity = this.velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this.decceleration.x,
      velocity.y * this.decceleration.y,
      velocity.z * this.decceleration.z
    );
    frameDecceleration.multiplyScalar(deltaTime);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this.Entity.target;

    const Q = new THREE.Quaternion();
    const A = new THREE.Vector3();
    const R = controlObject.scene.quaternion.clone();


    if (this.run) {
      acc.multiplyScalar(3.0);
    }

    if (this.stateMachine && this.stateMachine.currentState && this.stateMachine.currentState.name == 'attack') {
      acc.multiplyScalar(0.2);
    }

    if (this.forward) {
      velocity.z += acc.z * deltaTime;
    }
    if (this.backward) {
      velocity.z -= acc.z * deltaTime;
    }

    // Another way of handling collision
    // if(this.forward && collision) {
    //   velocity.z -= acc.z * deltaTime
    // } else if (this.forward) {
    //   velocity.z += acc.z * deltaTime;
    // }

    // if(this.backward && collision) {
    //   velocity.z += acc.z * deltaTime
    // } else if (this.backward) {
    //   velocity.z -= acc.z * deltaTime;
    // }

    if (this.left) {
      A.set(0, 1, 0);
      Q.setFromAxisAngle(A, 2.0 * Math.PI * deltaTime * this.acceleration.y);
      R.multiply(Q);
    }
    if (this.right) {
      A.set(0, 1, 0);
      Q.setFromAxisAngle(A, 2.0 * -Math.PI * deltaTime * this.acceleration.y);
      R.multiply(Q);
    }

    controlObject.scene.quaternion.copy(R);


    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.scene.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.scene.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * deltaTime);
    forward.multiplyScalar(velocity.z * deltaTime);

    const newPosition = new THREE.Vector3();
    newPosition.copy(this.transform.position);
    newPosition.add(forward)
    newPosition.add(sideways)

    if(this.collider && !this.collider.isColliding(newPosition)) {
      this.transform.position.add(forward);
      this.transform.position.add(sideways);
    }
  }

}
