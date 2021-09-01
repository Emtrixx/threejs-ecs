import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import { math } from "../../utils/math";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { Stats } from "./stats";

export class AttackController implements IComponent {
    Entity: ObjectEntity;
    private stateMachine: FiniteStateMachine;
    _primary: boolean;
    private grid: SpatialGridController;

    constructor() {
        this._primary = false
    }
    awake(): void {
        this.stateMachine = this.Entity.getComponent(FiniteStateMachine)
        this.grid = this.Entity.getComponent(SpatialGridController)
    }

    update(deltaTime: number): void {
        if (this._primary) {
            this.stateMachine.SetState('attack')
            this.primaryAttack()
            this._primary = false
        }
    }

    primaryAttack() {
        const near = this.grid.FindNearbyEntities(5)
        const attackable = near.filter(e => {
            return e.entity.hasComponent(Stats)
        })

        for(const a of attackable) {
            const target = a.entity
            const targetPosition = new Vector3(a.position[0], 0, a.position[1])
            
            const dirToTarget = targetPosition.sub(this.Entity.getComponent(Transform).position)
            dirToTarget.normalize()
            
            const forward = new Vector3(0, 0, 1);
            forward.applyQuaternion(this.Entity._target.scene.quaternion)
            forward.normalize();
            
            let damage = this.Entity.getComponent(Stats).strength
            
            
            const dot = forward.dot(dirToTarget);
            if (math.in_range(dot, 0.9, 1.1)) {
                console.log(dot);
                target.getComponent(Stats).receiveDamage(damage)
            }

        }
    }
}