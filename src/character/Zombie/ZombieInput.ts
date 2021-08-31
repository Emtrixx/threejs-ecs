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

    awake(): void {
        this._movement = this.Entity.getComponent(Movement)
        this._grid = this.Entity.getComponent(SpatialGridController)
    }
    
    update(_): void {
        if(!this.Entity._target) {
            return
        }

        //Should be under transform but threejs lookAt function does the job
        const controlObject = this.Entity._target.scene;

        const near: Array<object> = this._grid.FindNearbyEntities(30)
        for(let i = 0; i<near.length; i++) {
           if(near[i].entity.name == 'player') {
                const pos = new Vector3(near[i].position[0], 0, near[i].position[1])
                controlObject.lookAt(pos)
                this._movement._forward = true;
                return
           }
        } 
        this._movement._forward = false;
    }
}