import { Vector3 } from "three";
import { ObjectEntity } from "../entities/ObjectEntity";
import Entity from "../utils/ecs/Entity";
import IComponent from "../utils/ecs/IComponent";

export class ThirdPersonCamera implements IComponent {
    Entity: ObjectEntity;
    camera: any;
    currentPosition: Vector3;
    currentLookat: Vector3;

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera
        this.currentPosition = new Vector3();
        this.currentLookat = new Vector3();
    }

    awake(): void {
        // throw new Error("Method not implemented.");
    }
    update(deltaTime: number): void {
        if(!this.Entity.target) {
            return
        }
        const idealOffset = this.calculateIdealOffset();
        const idealLookat = this.calculateIdealLookat();

        // const t = 0.05;
        // const t = 4.0 * timeElapsed;
        const t = 1.0 - Math.pow(0.01, deltaTime);

        this.currentPosition.lerp(idealOffset, t);
        this.currentLookat.lerp(idealLookat, t);

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookat);
    }

    calculateIdealOffset(): Vector3 {
        const idealOffset = new Vector3(-0, 10, -15);
        idealOffset.applyQuaternion(this.Entity.target.scene.quaternion);
        idealOffset.add(this.Entity.target.scene.position);
        return idealOffset;
    }

    calculateIdealLookat(): Vector3 {
        const idealLookat = new Vector3(0, 5, 20);
        idealLookat.applyQuaternion(this.Entity.target.scene.quaternion);
        idealLookat.add(this.Entity.target.scene.position);
        return idealLookat;
    }



}