import * as THREE from "three";
import { State } from "./State";

export class AttackState extends State {
    action: any;
    FinishedCallback: () => void;
    
    constructor(parent) {
      super(parent);
      this.name = 'attack'
      this.action = null;
  
      this.FinishedCallback = () => {
        this.Finished();
      }
    }
   
    enter(prevState: State) {
      this.action = this.parent.proxy.animations['attack'].action;
      this.action.setDuration(0.2)
      console.log(this.action);
      const mixer = this.action.getMixer();
      mixer.addEventListener('finished', this.FinishedCallback);
      
      
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
  
    Finished() {
      this.Cleanup();
      this.parent.SetState('idle');
    }
  
    Cleanup() {
      if (this.action) {
        this.action.getMixer().removeEventListener('finished', this.FinishedCallback);
      }
    }
  
    exit() {
      this.Cleanup();
    }
  
    update(_) {
    }
  };