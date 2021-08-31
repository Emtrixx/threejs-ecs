import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";

export class Collider implements IComponent {
    Entity: Entity;
    private _grid: SpatialGridController;
    private _radius: number;
    private _transform: Transform;
    collision: boolean = false;
    private _nearestPosition: Vector3

    constructor(radius: number) {
        this._radius = radius;
        this._nearestPosition = new Vector3()
    }
    
    awake(): void {
        this._grid = this.Entity.getComponent(SpatialGridController)
        this._transform = this.Entity.getComponent(Transform)
    }
    update(deltaTime: number): void {
        // const near = this._grid.FindNearbyEntities(this._radius + 2)
        // for(const entity of near) {
        //     this._nearestPosition.set(entity.position[0], 0, entity.position[1])
        //     if(this._transform.position.distanceTo(this._nearestPosition) < this._radius) {
        //         this.collision = true;
        //     } else {
        //         this.collision = false
        //     }
        // }
    }
    
    isColliding(position): boolean {
        const near = this._grid.FindNearbyEntities(this._radius + 10)
        for(const entity of near) {
            this._nearestPosition.set(entity.position[0], 0, entity.position[1])
            if(position.distanceTo(this._nearestPosition) < this._radius) {
                return true;
            } 
        }
        return false
    }
}