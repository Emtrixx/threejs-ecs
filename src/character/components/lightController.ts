import { DirectionalLight } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";

export class LightController implements IComponent {
    Entity: ObjectEntity;
    light: DirectionalLight;
    transform: Transform;

    constructor(light: DirectionalLight) {
        this.light = light;
    }

    awake(): void {
        this.transform = this.Entity.getComponent(Transform);
    }

    update(_): void {
        const pos = this.transform.position
        this.light.position.set(pos.x + 20, pos.y +100, pos.z + 10);
        this.light.target.position.set(pos.x, pos.y, pos.z);
    }

}