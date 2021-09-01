import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import BasicCharacterControllerInput from "../CharacterController/BasicCharacterControllerInput";
import { ZombieInput } from "../Zombie/ZombieInput";
import { Collider } from "./collider";
import { Input } from "./input";
import { Movement } from "./movement-component";

export class Stats implements IComponent {
    Entity: Entity;
    maxHealth: number;
    health: number;
    strength: number;
    experience: number;

    constructor(maxHealth: number, strength: number) {
        this.maxHealth = maxHealth
        this.health = maxHealth
        this.strength = strength
        this.experience = 0
    }

    isAlive(): boolean {
        console.log(this.health);
        return this.health > 0
    }

    receiveDamage(damage) {
        this.health = Math.max(0, this.health - damage)
        if(this.health == 0) {
            console.log('Dead')
            this.Entity.getComponent(SpatialGridController).removeFromGrid()
            this.Entity.removeComponent(SpatialGridController)
            this.Entity.removeComponent(Movement)
            this.Entity.removeComponent(ZombieInput)
            this.Entity.removeComponent(BasicCharacterControllerInput)
            this.Entity.getComponent(FiniteStateMachine).SetState('death') 
        }
    }

    awake(): void {
        // throw new Error("Method not implemented.");
    }
    update(deltaTime: number): void {
        // throw new Error("Method not implemented.");
    }

}