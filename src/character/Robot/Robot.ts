import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Vector3 } from "three";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import { BasicCharacterControllerProxy, ZombieFSM } from "../CharacterAnimation/FiniteStateMachine";
import { AttackController } from "../components/attackController";
import { OLDCollider } from "../components/OLDcollider";
import { Loader } from "../components/loader";
import { Movement } from "../components/movement-component";
import { Stats } from "../components/stats";
import { ZombieInput } from "../Zombie/ZombieInput";
import { BoxCollider } from "../../components/collider/boxCollider";
import { SoundSource } from "../components/soundSource";

export class Robot extends ObjectEntity {
    name: string;
    constructor(params) {
        super();
        this.name = 'robot'
        this.params = params
    }

    awake() {
        const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        const acceleration = new THREE.Vector3(1, 0.25, 50.0);
        acceleration.multiplyScalar(0.5)
        const velocity = new THREE.Vector3(0, 0, 0);

        this.loadRobot();
        this.addComponent(new Transform())
        this.addComponent(new Movement(decceleration, acceleration, velocity))
        this.addComponent(new ZombieInput)
        this.addComponent(new SpatialGridController({ grid: this.params.grid }))
        this.addComponent(new Stats(80, 20))
        this.addComponent(new BoxCollider(this.params.pworld, 3, new CANNON.Vec3(0, 3.51, 0), new CANNON.Vec3(1.2, 3.2, 1.2)));
        this.addComponent(new AttackController())
        // this.addComponent(new ZombieFSM(new BasicCharacterControllerProxy(this.animations)))
        this.addComponent(new SoundSource('./sounds/zombie/attack.mp3', this.params.listener, 'attack'));
        super.awake()
    }
    loadRobot() {
        const geometry = new THREE.BoxGeometry( 1.2, 4, 1.2 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        this.params.scene.add( cube );
    }

    update(deltaTime) {
        if (!this.target) {
            return;
        }
        super.update(deltaTime)
    }

    onLoad() {
        // this.target.scene.scale.set(4, 4, 4)
        this.params.scene.add(this.target.scene);
        // add physics
        this.getComponent(BoxCollider).onLoad();
        this.getComponent(Movement).activatePhysics();
        this.getComponent(ZombieFSM).SetState('idle')
    }

    // spawnpoint(): Vector3 {
    //     const x = (Math.random() * 2 - 1) * 80
    //     const y = 0
    //     const z = (Math.random() * 2 - 1) * 80

    //     const position = new THREE.Vector3(x, y, z)
    //     return position
    // }
}
