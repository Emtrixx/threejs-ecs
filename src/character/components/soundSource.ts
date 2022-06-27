import * as THREE from "three";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import IComponent from "../../utils/ecs/IComponent";
import { IObserver, ISubscriber } from "../../utils/events";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { AttackController } from "./attackController";
import { Input } from "./input";
import { Movement } from "./movement-component";

export class SoundSource implements IComponent, ISubscriber {
    Entity: ObjectEntity;

    protected stateMachine: FiniteStateMachine;
    controlObject: any;
    sound: THREE.PositionalAudio;
    eventName: string;

    constructor(soundPath: string, listener: THREE.AudioListener, eventName: string) {
        this.eventName = eventName;
        const audioLoader = new THREE.AudioLoader();
        this.sound = new THREE.PositionalAudio( listener );
        audioLoader.load( soundPath,  buffer => {
            this.sound.setBuffer( buffer );
            this.sound.setRefDistance( 20 );
            this.sound.setVolume( 0.5 );
        });
    }
    
    addObserver(observer: IObserver): void {
        observer.subscribe(this);
    }

    notify(name: String): void {
        if (name === this.eventName) {
            this.sound.play();
        }
    }

    awake(): void {
        this.stateMachine = this.Entity.getComponent(FiniteStateMachine);
        this.addObserver(this.stateMachine);
    }

    update(_): void {}
}
