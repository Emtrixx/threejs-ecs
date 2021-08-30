import { ObjectEntity } from "../../entities/ObjectEntity";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";

export class AttackController implements IComponent{
    Entity: ObjectEntity;
    private _stateMachine: FiniteStateMachine;
    _primary: boolean;

    constructor() {
        this._primary = false
    }
    awake(): void {
        this._stateMachine = this.Entity.getComponent(FiniteStateMachine)
    }
    update(deltaTime: number): void {
        if (this._primary) {
            this._stateMachine.SetState('attack')


        }
    }
}