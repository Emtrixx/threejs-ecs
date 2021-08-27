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
    }
    
    update(deltaTime: number): void {
        if(!this.Entity._target) {
            return
        }
        this._transform = this.Entity.getComponent(Transform)
        this._movement = this.Entity.getComponent(Movement)
        this._playerTransform = this.Entity._params.player.getComponent(Transform)
        
        //Should be under transform
        const controlObject = this.Entity._target.scene;
        controlObject.lookAt(this._playerTransform.position);

        if(this._transform.position.distanceTo(this._playerTransform.position)< 10) {
            this._movement._forward = true;
        } else {
            this._movement._forward = false;
        }

        
    }

}