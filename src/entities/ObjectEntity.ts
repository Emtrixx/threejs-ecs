import Entity from "../utils/ecs/Entity"
import * as THREE from "three";

export abstract class ObjectEntity extends Entity {
    
    _params: any;
    _target: any;

    constructor() {
        super()
    }

}