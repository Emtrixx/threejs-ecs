import * as THREE from "three";
import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import IComponent from "../../utils/ecs/IComponent";
import BasicCharacterController from "../CharacterController/BasicCharacterController";
import { Movement } from "../components/movement-component";

export class ZombieInput implements IComponent {
    Entity: ObjectEntity;

    private _movement: Movement;
    private _grid: SpatialGridController;
    private counter: number;
    private rand: number;

    constructor() {
        this.rand = Math.random() * 10
        console.log(this.rand)
    }

    awake(): void {
        this._movement = this.Entity.getComponent(Movement)
        this._grid = this.Entity.getComponent(SpatialGridController)
        this.counter = 0
    }
    
    update(deltaTime): void {
        if(!this.Entity._target) {
            return
        }
        this.counter = (this.counter + deltaTime) % 10 

        //Should be under transform but threejs lookAt function does the job
        const controlObject = this.Entity._target.scene;

        const near: Array<any> = this._grid.FindNearbyEntities(30)
        for(let i = 0; i<near.length; i++) {
           if(near[i].entity.name == 'player') {
                const pos = new Vector3(near[i].position[0], 0, near[i].position[1])
                controlObject.lookAt(pos)
                this._movement._forward = true;
                this._movement._run = true
                return
           }
        } 

        this._movement._run = false
        // this.rand = Math.random() * 4
        if (this.counter  > this.rand) {
            this._movement._right = true
            this._movement._forward = false;
        } else {
            this._movement._right = false
            this._movement._forward = true
        }
    }
}