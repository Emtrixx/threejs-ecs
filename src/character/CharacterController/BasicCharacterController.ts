import * as THREE from "three";
import * as CANNON from "cannon-es";
import BasicCharacterControllerInput from "./BasicCharacterControllerInput";
import FiniteStateMachine, { BasicCharacterControllerProxy, CharacterFSM } from "../CharacterAnimation/FiniteStateMachine";
import { Transform } from "../../components/transform";
import { Movement } from "../components/movement-component";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { Loader } from "../components/loader";
import { Vector3 } from "three";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import { OLDCollider } from "../components/OLDcollider";
import { AttackController } from "../components/attackController";
import { Stats } from "../components/stats";
import { ThirdPersonCamera } from "../ThirdPersonCamera";
import { LightController } from "../components/lightController";
import { Collider } from "../../components/collider/collider";
import { BoxCollider } from "../../components/collider/boxCollider";


export default class BasicCharacterController extends ObjectEntity {
    name: string;
    constructor(params) {
      super()
      this.name = 'player'
      this.params = params;
      const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      decceleration.multiplyScalar(4)
      const acceleration = new THREE.Vector3(1, 0.25, 50.0);
      acceleration.multiplyScalar(4)
      const velocity = new THREE.Vector3(0, 0, 0);
  
      this.addComponent(new Transform())
      const p = './models/character/'
      this.addComponent(new Loader(p+'player.glb', [p+'idle.glb', p+'walk.glb', p+'run.glb', p+'attack.glb', p+'death.glb']))
      this.addComponent(new BasicCharacterControllerInput());
      this.addComponent(new BoxCollider(this.params.pworld, 3, new CANNON.Vec3(0,3.51,0), new CANNON.Vec3(1.2,3.2,1.2)));
      this.addComponent(new Movement(decceleration, acceleration, velocity))
      this.addComponent(new SpatialGridController({grid: this.params.grid}))
      this.addComponent(new Stats(100, 40))
      this.addComponent(new AttackController())
  
    }
    
    awake() {
      this.addComponent(new LightController(this.params.light));
      this.addComponent(new CharacterFSM(new BasicCharacterControllerProxy(this.animations)))
      super.awake()
    }
    
    update(deltaTime) {
      if (!this.target) {
        return;
      }
      super.update(deltaTime)
      
    }
    
    onLoad() {
      this.target.scene.scale.set(4,4,4)
      this.params.scene.add(this.target.scene);
      // console.log(this.target.scene);
      // add physics
      this.getComponent(BoxCollider).onLoad();
      this.getComponent(Movement).activatePhysics();
      //Animation
      this.getComponent(CharacterFSM).SetState('idle')
      this.addComponent(new ThirdPersonCamera(this.params.camera))
    }
  }