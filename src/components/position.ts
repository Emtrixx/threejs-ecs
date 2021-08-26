import Entity from "../utils/ecs/Entity";
import IComponent from "../utils/ecs/IComponent";

export class Position implements IComponent {
    Entity: Entity;

    awake(): void {
        throw new Error("Method not implemented.");
    }

    update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
    
}