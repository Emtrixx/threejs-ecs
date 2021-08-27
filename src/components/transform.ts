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
        if(!this.Entity._target) {
            return
        }
        this.Entity._target.scene.position.set(this.position.x, this.position.y, this.position.z)
        // this.Entity._target.scene.position.set(0,0,0)
    }
    
    
    update(deltaTime: number): void {
        this.Entity._target.scene.position.set(this.position.x, this.position.y, this.position.z)
    }
    


    // get(): Array<number> {
    //     return [this._x, this._y, this._z]
    // }
    // set(x:number, y:number, z:number): void {
    //     this._x = x;
    //     this._y = y;
    //     this._z = z;
    // }

    // add(x:number, y:number, z:number): void {
    //     this._x += x;
    //     this._y += y;
    //     this._z += z;
    // }
    
}