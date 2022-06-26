import * as THREE from "three";
import { BoxCollider } from "../character/components/boxCollider";
import { ObjectEntity } from "../entities/ObjectEntity";
import IComponent from "../utils/ecs/IComponent";
import { Collider } from "./collider";

export class Transform implements IComponent {
    Entity: ObjectEntity;

    position : THREE.Vector3;
    rotation : THREE.Euler;
    scale : THREE.Vector3;
    collider: Collider;

    constructor(position = new THREE.Vector3(), rotation = new THREE.Euler, scale = new THREE.Vector3(1,1,1)) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    awake(): void {
        if(!this.Entity.target) {
            return
        }
        this.Entity.target.scene.position.set(this.position.x, this.position.y, this.position.z)
        if(this.Entity.hasComponent(Collider)) {
            this.collider = this.Entity.getComponent(Collider);
        }
    }
    
    update(_): void {
        if(this.collider) {
            const position = this.collider.body.position;
            this.position.copy(new THREE.Vector3(position.x, position.y, position.z));
        }
        this.Entity.target.scene.position.set(this.position.x, this.position.y, this.position.z)
    }
}