import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";

export class Collider implements IComponent {
    Entity: Entity;
    private grid: SpatialGridController;
    private radius: number;
    private transform: Transform;
    collision: boolean = false;
    private nearestPosition: Vector3

    constructor(radius: number) {
        this.radius = radius;
        this.nearestPosition = new Vector3()
    }
    
    awake(): void {
        this.grid = this.Entity.getComponent(SpatialGridController)
        this.transform = this.Entity.getComponent(Transform)
    }
    update(deltaTime: number): void {
        // const near = this.grid.FindNearbyEntities(this.radius + 2)
        // for(const entity of near) {
        //     this.nearestPosition.set(entity.position[0], 0, entity.position[1])
        //     if(this.transform.position.distanceTo(this.nearestPosition) < this.radius) {
        //         this.collision = true;
        //     } else {
        //         this.collision = false
        //     }
        // }
    }
    
    isColliding(position): boolean {
        const near = this.grid.FindNearbyEntities(this.radius + 10)
        for(const entity of near) {
            this.nearestPosition.set(entity.position[0], 0, entity.position[1])
            if(position.distanceTo(this.nearestPosition) < this.radius) {
                return true;
            } 
        }
        return false
    }
}