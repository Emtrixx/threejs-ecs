import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import * as CANNON from "cannon-es";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import BasicCharacterControllerInput from "../CharacterController/BasicCharacterControllerInput";
import { ZombieInput } from "../Zombie/ZombieInput";
import { OLDCollider } from "./OLDcollider";
import { Input } from "./input";
import { Movement } from "./movement-component";
import { Collider } from "../../components/collider/collider";
import { BoxCollider } from "../../components/collider/boxCollider";

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
        return this.health > 0
    }

    receiveDamage(damage) {
        this.health = Math.max(0, this.health - damage)
        if(this.health == 0) {
            console.log('Dead')
            this.Entity.getComponent(SpatialGridController).removeFromGrid()
            const collider = this.Entity.getComponent(BoxCollider)
            collider.remove();
            collider.dimension = new CANNON.Vec3(2,0.5,2);
            collider.offset = new CANNON.Vec3(0,0,0);
            collider.onLoad();
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