import * as THREE from "three";
import * as CANNON from "cannon-es"
import { Loader } from "../../character/components/loader";
import { CharacterFSM, BasicCharacterControllerProxy } from "../../character/CharacterAnimation/FiniteStateMachine";
import BasicCharacterControllerInput from "../../character/CharacterController/BasicCharacterControllerInput";
import { AttackController } from "../../character/components/attackController";
import { BoxCollider } from "../../components/collider/boxCollider";
import { LightController } from "../../character/components/lightController";
import { Movement } from "../../character/components/movement-component";
import { Stats } from "../../character/components/stats";
import { ThirdPersonCamera } from "../../character/ThirdPersonCamera";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../world/components/SpatialHashGridController";
import { Transform } from "../../components/transform";
import { Collider } from "../../components/collider/collider";
import { SphereCollider } from "../../components/collider/sphereCollider";


export default class Ball extends ObjectEntity {
    name: string;
    constructor(params) {
      super()
      this.name = 'ball'
      this.params = params;
      this.addMesh();

      this.addComponent(new Transform(new THREE.Vector3(0, 20, 0)));
      this.addComponent(new SphereCollider(params.pworld, 2));
      //this.addComponent(new SpatialGridController({grid: this.params.grid}))
    }

    addMesh() {
        const ballRadius = 2;
        const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
        const ball = new THREE.Mesh(ballGeometry, new THREE.MeshLambertMaterial({color: 0xff0000}));
        ball.castShadow = true;
        const object = { scene: null };
        object.scene = ball;
        this.target = object;
        console.log('Ball awake')


        // const directionalVectorDC = new THREE.Vector3(0, 0, 1);
        // const velocityVectorWC = directionalVectorDC.unproject(this.params.camera).sub(this.params.camera.position);
        // velocityVectorWC.normalize();
        // velocityVectorWC.multiplyScalar(800);
    }
    
    awake() {
      super.awake()
      
    }
    
    update(deltaTime) {
      if (!this.target) {
        return;
      }
      super.update(deltaTime)
      
    }
    
    onLoad() {
        this.params.scene.add(this.target.scene);
        this.getComponent(Transform).activatePhysics();
    }
  }