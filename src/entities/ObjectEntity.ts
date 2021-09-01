import Entity from "../utils/ecs/Entity"
import * as THREE from "three";

export abstract class ObjectEntity extends Entity {
    
    params: any;
    target: any;
    animations = {}

    constructor() {
        super()
    }

    onLoad() {}

}