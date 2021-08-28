import * as THREE from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";
import { Movement } from "../components/movement-component";

export class ZombieInput implements IComponent {
    Entity: ObjectEntity;
    private _playerTransform: Transform;

    private _movement: Movement;
    private _following: boolean
    private _transform: Transform;

    awake(): void {
        this._following = true
        this._transform = this.Entity.getComponent(Transform)
        this._movement = this.Entity.getComponent(Movement)
        this._playerTransform = this.Entity._params.player.getComponent(Transform)
    }
    
    update(_): void {
        if(!this.Entity._target) {
            return
        }
        //Should be under transform but threejs lookAt function does the job
        const controlObject = this.Entity._target.scene;
        controlObject.lookAt(this._playerTransform.position);

        if(this._transform.position.distanceTo(this._playerTransform.position)< 30) {
            this._movement._forward = true;
        } else {
            this._movement._forward = false;
        }

        
    }

}