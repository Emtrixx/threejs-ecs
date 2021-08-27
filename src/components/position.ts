import { ObjectEntity } from "../entities/ObjectEntity";
import IComponent from "../utils/ecs/IComponent";

export class Position implements IComponent {
    Entity: ObjectEntity;
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x:number,y:number,z:number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public get position() {
        return [this._x, this._y, this._z]
    }
 
    awake(): void {
        if(!this.Entity._target) {
            return
        }
        this.Entity._target.scene.position.set(this._x,this._y,this._z)
    }


    update(deltaTime: number): void {
        this.Entity._target.scene.position.set(this._x,this._y,this._z)
    }

    set(x:number, y:number, z:number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    add(x:number, y:number, z:number) {
        this._x += x;
        this._y += y;
        this._z += z;
    }
    
}