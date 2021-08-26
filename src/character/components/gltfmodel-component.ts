import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";

export class gltfmodel implements IComponent {
  Entity: Entity;
  private _params: any;
  private _target: any;

  constructor(target, params) {
    this._target = target;
    this._params = params;
    this.awake()
  }

  awake(): void {
    this.loader()
  }
  update(deltaTime: number): void {
    //TODO
  }

  loader() {
    const loader = new GLTFLoader();
    loader.load("./models/Boxhead.gltf", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
      });
      gltf.scene.position.set(Math.random() * 20, 0, Math.random() * 20);
      this._target = gltf;
      this._params.scene.add(this._target.scene);
    });
  }
}
