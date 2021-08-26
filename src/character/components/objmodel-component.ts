import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";

export class objmodel implements IComponent {
    Entity: Entity;
    _target: any;
    _params: any;

    constructor(target, params) {
        this._target = target;
        this._params = params;
        this.awake()
    }

    awake(): void {
        this.loader()
    }
    update(deltaTime: number): void {
        //todo
    }

    loader() {
        const loader = new OBJLoader();

      loader.load(
        // resource URL
        './models/soccerPlayer.obj',
         object => {
          this._target = object;
          this._params.scene.add(this._target);      
        })
    }

}