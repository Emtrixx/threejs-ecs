import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Position } from "../../components/position";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";

export class objmodel implements IComponent {
  Entity: ObjectEntity;
  public _object: any;
  constructor() {
    
  }

  awake(): void {
    this.loader();
  }

  update(deltaTime: number): void {
    //todo
  }

  loader() {
    const loader = new OBJLoader();

    loader.load(
      // resource URL
      "./models/soccerPlayer.obj",
      (object) => {
        //fit to gltf way of having everything on scene property
        this._object = { scene: null };
        this._object.scene = object;
        const p = this.Entity.getComponent(Position).position;
        this._object.scene.position.set(p[0], p[2], p[3]);
        this.Entity._params.scene.add(this._object.scene);
        this.Entity._target = this._object;
      }
    );
  }
}
