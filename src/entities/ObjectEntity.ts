import Entity from "../utils/ecs/Entity"

export abstract class ObjectEntity extends Entity {
    
    _params: any;
    _target: any;

    constructor() {
        super()
    }

}