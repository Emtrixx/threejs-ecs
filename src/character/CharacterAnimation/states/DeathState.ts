import * as THREE from "three";
import { CharacterFSM } from "../FiniteStateMachine";
import { State } from "./State";

export class DeathState extends State {
    _action: any;
    constructor(parent: CharacterFSM) {
      super(parent);
      this.name = 'death'
      this._action = null;
    }
  
    enter(prevState): void {
      this._action = this._parent._proxy._animations['death'].action;
  
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.name].action;
  
        this._action.reset();  
        this._action.setLoop(THREE.LoopOnce, 1);
        this._action.clampWhenFinished = true;
        this._action.crossFadeFrom(prevAction, 0.2, true);
        this._action.play();
      } else {
        this._action.play();
      }
    }
  
    exit() {
    }
  
    update(_) {
    }
  };