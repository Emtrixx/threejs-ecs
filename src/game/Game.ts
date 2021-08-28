import Entity from "../utils/ecs/Entity";
import { Settings } from "../settings/settings";
import World from "./world/World";

export class Game extends Entity {
    private _lastTimestamp: number;
    public entities: Entity[] = [];

    public awake(): void {
        super.awake()

        this.entities.push(new World)

        for (const entity of this.entities){
            entity.awake()
        }

        window.requestAnimationFrame(() => {
            this._lastTimestamp = Date.now()
            
            this.update()
        })
    }

    public update(): void {
        const deltaTime = (Date.now() - this._lastTimestamp) / 1000

        //Update components
        super.update(deltaTime)

        //update children
        for (const entity of this.entities){
            entity.update(deltaTime)
          }

        this._lastTimestamp = Date.now()
        
        window.requestAnimationFrame(() => this.update())
    }
}