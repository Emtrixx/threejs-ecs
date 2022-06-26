import { ObjectEntity } from "../entities/ObjectEntity";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import IComponent from "../utils/ecs/IComponent";

export class Collider implements IComponent {
    Entity: ObjectEntity;
    mass: number;
    offset: CANNON.Vec3;
    pworld: CANNON.World;
    body: CANNON.Body;

    constructor(pworld: CANNON.World ,mass: number, offset: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0)) {
        this.mass = mass;
        this.offset = offset;
        this.pworld = pworld;
        this.body = new CANNON.Body({ mass });
    }

    awake(): void {}
    
    update(_): void {}
}