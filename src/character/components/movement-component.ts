import * as console from "console";
import * as THREE from "three";
import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";
import { Collider } from "./collider";

export class Movement implements IComponent {
    Entity: ObjectEntity;
    private _transform: Transform;
    private _decceleration: THREE.Vector3;
    private _acceleration: THREE.Vector3;
    private _velocity: THREE.Vector3;
    _run: boolean;
    _jump: boolean;
    _forward: boolean;
    _backward: boolean;
    _left: boolean;
    _right: boolean;

    constructor(decelleration, acceleration, velocity) {
        this._decceleration = decelleration;
        this._acceleration = acceleration;
        this._velocity = velocity;
    }

    awake(): void {
    }
    
    update(deltaTime: number): void {
      this._transform = this.Entity.getComponent(Transform)
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


        const acc = this._acceleration.clone();
        if (this._run) {
          acc.multiplyScalar(2.0);
        }

        // if (this._stateMachine._currentState.name == 'dance') {
        //   acc.multiplyScalar(0.0);
        // }

        if (this._forward) {
          velocity.z += acc.z * deltaTime;
        }
        if (this._backward) {
          velocity.z -= acc.z * deltaTime;
        }
        if (this._left) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, 4.0 * Math.PI * deltaTime * this._acceleration.y);
          _R.multiply(_Q);
        }
        if (this._right) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * deltaTime * this._acceleration.y);
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

        sideways.multiplyScalar(velocity.x * deltaTime);
        forward.multiplyScalar(velocity.z * deltaTime);

        let newPosition: Vector3 = new Vector3( 0,0,0);
        
        
        if (this._transform){
          newPosition.copy(this._transform.position )
        }
        else{
        
        }

       

        newPosition.add(forward)
        newPosition.add(sideways);
        if (this.Entity.getComponent(Collider).lookForFutureCollison(newPosition)){
          forward.multiplyScalar(-1);
           this._transform.position.add(forward);
        //  this._transform.position.add(sideways);


        }
        else{
          this._transform.position.add(forward);
          this._transform.position.add(sideways);
            
        }


        
        //without transform component
        // this.Entity._target.scene.position.add(forward)
        // this.Entity._target.scene.position.add(sideways)

        oldPosition.copy(controlObject.scene.position);
    }

}
