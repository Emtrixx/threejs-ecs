import * as THREE from "three";
import { BoxCollider } from "./collider/boxCollider";
import { ObjectEntity } from "../entities/ObjectEntity";
import IComponent from "../utils/ecs/IComponent";
import { Collider } from "./collider/collider";

export class Transform implements IComponent {
    Entity: ObjectEntity;

    position : THREE.Vector3;
    rotation : THREE.Euler;
    scale : THREE.Vector3;
    collider: Collider;
    physics: boolean;

    constructor(position = new THREE.Vector3(), rotation = new THREE.Euler, scale = new THREE.Vector3(1,1,1)) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.physics = false;
    }

    awake(): void {
        if(!this.Entity.target) {
            return
        }
        this.Entity.target.scene.position.set(this.position.x, this.position.y, this.position.z)
        this.Entity.target.scene.quaternion.copy(0, 0, 0, 1);
    }

    activatePhysics() {
        this.collider = this.Entity.getComponent(Collider);
        console.log(this.Entity.target.scene.rotation)
        console.log(this.collider.body.quaternion)


        this.physics = true;
    }
    
    update(_): void {
        if(this.physics) {
            //Position
            const position = this.collider.body.position;
            this.position.set(position.x, position.y, position.z);
            //Rotation
            const quaternion = this.collider.body.quaternion;
            // Currently only controlled here with physics otherwise in movement component
            // this.Entity.target.scene.quaternion.copy(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            this.rotation = this.Entity.target.scene.rotation;
        } 
        this.Entity.target.scene.position.set(this.position.x, this.position.y, this.position.z)
    }
}