import { Loader } from "../../character/components/loader";
import Entity from "../../utils/ecs/Entity";

export class DecorativeObject extends Entity {

    constructor(filePath: string) {
        super()
        this.addComponent(new Loader(filePath))
    }
}