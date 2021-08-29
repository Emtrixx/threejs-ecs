import * as THREE from "three";
import { State } from "./State";

export class AttackState extends State {
    _action: any;
    _FinishedCallback: () => void;
    
    constructor(parent) {
      super(parent);
  
      this._action = null;
  
      this._FinishedCallback = () => {
        this._Finished();
      }
    }
   
    enter(prevState: State) {
      this._action = this._parent._proxy._animations['attack'].action;
      const mixer = this._action.getMixer();
      mixer.addEventListener('finished', this._FinishedCallback);
  
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
  
    _Finished() {
      this._Cleanup();
      this._parent.SetState('idle');
    }
  
    _Cleanup() {
      if (this._action) {
        this._action.getMixer().removeEventListener('finished', this._FinishedCallback);
      }
    }
  
    exit() {
      this._Cleanup();
    }
  
    update(_) {
    }
  };