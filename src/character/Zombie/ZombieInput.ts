import * as THREE from "three";
import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import IComponent from "../../utils/ecs/IComponent";
import BasicCharacterController from "../CharacterController/BasicCharacterController";
import { Movement } from "../components/movement-component";

export class ZombieInput implements IComponent {
    Entity: ObjectEntity;

    private movement: Movement;
    private grid: SpatialGridController;
    private counter: number;
    private rand: number;

    constructor() {
        this.rand = Math.random() * 10
        console.log(this.rand)
    }

    awake(): void {
        this.movement = this.Entity.getComponent(Movement)
        this.grid = this.Entity.getComponent(SpatialGridController)
        this.counter = 0
    }
    
    update(deltaTime): void {
        if(!this.Entity.target) {
            return
        }
        this.counter = (this.counter + deltaTime) % 10 

        //Should be under transform but threejs lookAt function does the job
        const controlObject = this.Entity.target.scene;

        const near: Array<any> = this.grid.FindNearbyEntities(30)
        for(let i = 0; i<near.length; i++) {
           if(near[i].entity.name == 'player') {
                const pos = new Vector3(near[i].position[0], 0, near[i].position[1])
                controlObject.lookAt(pos)
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