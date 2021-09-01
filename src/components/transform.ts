import * as THREE from "three";
import { ObjectEntity } from "../entities/ObjectEntity";
import IComponent from "../utils/ecs/IComponent";

export class Transform implements IComponent {
    Entity: ObjectEntity;

    position : THREE.Vector3;
    rotation : THREE.Euler;
    scale : THREE.Vector3;

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
    }
    
    update(_): void {
        this.Entity.target.scene.position.set(this.position.x, this.position.y, this.position.z)
    }
}