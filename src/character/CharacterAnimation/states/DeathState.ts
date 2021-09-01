import * as THREE from "three";
import { CharacterFSM } from "../FiniteStateMachine";
import { State } from "./State";

export class DeathState extends State {
    action: any;
    constructor(parent: CharacterFSM) {
      super(parent);
      this.name = 'death'
      this.action = null;
    }
  
    enter(prevState): void {
      this.action = this.parent.proxy.animations['death'].action;
  
      if (prevState) {
        const prevAction = this.parent.proxy.animations[prevState.name].action;
  
        this.action.reset();  
        this.action.setLoop(THREE.LoopOnce, 1);
        this.action.clampWhenFinished = true;
        this.action.crossFadeFrom(prevAction, 0.2, true);
        this.action.play();
      } else {
        this.action.play();
      }
    }
  
    exit() {
    }
  
    update(_) {
    }
  };