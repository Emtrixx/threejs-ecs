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

    constructor(radius: number) {
        this._radius = radius;
    }
    
    awake(): void {
        this._grid = this.Entity.getComponent(SpatialGridController)
        this._transform = this.Entity.getComponent(Transform)
    }
    update(deltaTime: number): void {
        // const near = this._grid.FindNearbyEntities(this._radius)
        // // console.log(near);
        // for(const entity of near) {
        //     if(this._transform.position.distanceTo(entity.entity.getComponent(Transform).position) < 5) {
        //          this.collison =true;}}
            }
        
    
    lookForFutureCollison(futurPositon: THREE.Vector3){
        const near = this._grid.FindNearbyEntities(this._radius)
        // console.log(near);
        for(const entity of near) {
            
            if(futurPositon.distanceTo(entity.entity.getComponent(Transform).position) < 5) {
                 return true;
            }
        
    }
         return false;
    }
}
