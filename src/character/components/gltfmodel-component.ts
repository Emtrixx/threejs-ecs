import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";

export class gltfmodel implements IComponent {
  Entity: ObjectEntity;

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
      console.log(gltf);
      this.Entity._target = gltf;
      this.Entity._params.scene.add(this.Entity._target.scene);
    });
  }
}
