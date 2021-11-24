import { Vector3 } from "three";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { AttackController } from "../components/attackController";
import { Input } from "../components/input";
import { Movement } from "../components/movement-component";

export class ZombieInput implements IComponent {
    Entity: ObjectEntity;

    protected movement: Movement;
    protected attack: AttackController;
    protected stateMachine: FiniteStateMachine;
    private grid: SpatialGridController;
    private counter: number;
    private rand: number;
    controlObject: any;

    
    awake(): void {
        this.movement = this.Entity.getComponent(Movement)
        this.attack = this.Entity.getComponent(AttackController)
        this.stateMachine = this.Entity.getComponent(FiniteStateMachine)
        this.rand = Math.random() * 10
        this.grid = this.Entity.getComponent(SpatialGridController)
        this.counter = 0
    }
    
    update(deltaTime): void {
        if(!this.Entity.target && !this.stateMachine.currentState) {
            return
        }
        if(deltaTime < 3) {
            this.controlObject = this.Entity.target.scene;
        }
        this.counter = (this.counter + deltaTime) % 10 

        //Should be under transform but threejs lookAt function does the job

        const near: Array<any> = this.grid.FindNearbyEntities(30)
        for(let i = 0; i<near.length; i++) {
           if(near[i].entity.name == 'player') {
                const pos = new Vector3(near[i].position[0], 0, near[i].position[1])
                this.controlObject.lookAt(pos)
                if(this.controlObject.position.distanceTo(pos) < 4 && this.stateMachine.currentState && this.stateMachine.currentState.name != 'attack') {
                    this.movement.forward = true;
                    this.attack.primary = true;
                    return
                }
                this.movement.forward = true;
                this.movement.run = true
                return
           }
        } 

        this.movement.run = false
        // this.rand = Math.random() * 4
        if (this.counter  > this.rand) {
            this.movement.right = true
            this.movement.forward = false;
        } else {
            this.movement.right = false
            this.movement.forward = true
        }
    }
}