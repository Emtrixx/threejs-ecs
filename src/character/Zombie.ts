import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Entity from "../utils/ecs/Entity";
import { gltfmodel } from "./components/gltfmodel-component";

export class Zombie extends Entity {
  _target: GLTF;
  _params: any;
  constructor(params) {
    super();
    this._params = params;
    console.log(params.player);
  }

  awake() {
    this.addComponent(new gltfmodel(this._target, this._params))
  }

  update(deltaTime) {
    if (!this._target) {
      return;
    }

    const controlObject = this._target;
    controlObject.scene.lookAt(this._params.player._target.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.scene.quaternion);
    forward.normalize();

    forward.multiplyScalar(1 * deltaTime);

    controlObject.scene.position.add(forward);
  }
}
