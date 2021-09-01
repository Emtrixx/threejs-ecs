import { ObjectEntity } from "../../entities/ObjectEntity";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { AttackController } from "./attackController";
import { Movement } from "./movement-component";

export class Input implements IComponent {
    Entity: ObjectEntity;

    protected movement: Movement;
    protected attack: AttackController;
    protected stateMachine: FiniteStateMachine;

    awake(): void {
        this.movement = this.Entity.getComponent(Movement)
        this.attack = this.Entity.getComponent(AttackController)
        this.stateMachine = this.Entity.getComponent(FiniteStateMachine)
    }

    update(deltaTime: number): void {}

}