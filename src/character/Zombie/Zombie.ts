import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { gltfmodel } from "../components/gltfmodel-component";
import { Movement } from "../components/movement-component";
import { ZombieInput } from "./ZombieInput";

export class Zombie extends ObjectEntity {
  private _playerPosition: Transform;
  constructor(params) {
    super();
    this._params = params
    this.loadModel()
  }

  awake() {
    const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    const acceleration = new THREE.Vector3(1, 0.25, 50.0);
    const velocity = new THREE.Vector3(0, 0, 0);
    // this.addComponent(new Transform())
    this.addComponent(new Movement(decceleration, acceleration, velocity))
    this.addComponent(new ZombieInput)
    this._playerPosition = this._params.player.getComponent(Transform)
    super.awake()
  }

  update(deltaTime) {
    if (!this._target) {
      return;
    }
    super.update(deltaTime)
  }

  onLoad() {
    this.addComponent(new Transform(this._target.scene.position, this._target.scene.rotation, this._target.scene.scale))
    this._params.scene.add(this._target.scene);
    this._params.loadingBar.visible = false;
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load("./models/Boxhead.gltf", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
      });
      this._target = gltf;
      this.onLoad()
    },
      // called while loading is progressing
      xhr => {

        this._params.loadingBar.update('Zombie', xhr.loaded, xhr.total);

      },
      // called when loading has errors
      err => {

        console.error(err);

      });
  }
}
