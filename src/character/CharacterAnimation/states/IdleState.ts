import { State } from "./State";

export class IdleState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'idle';
    }

    enter(prevState) {
        const idleAction = this._parent._proxy._animations['idle'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.25, true);
            idleAction.play();
        } else {
            // console.log(idleAction);
            idleAction.play();
        }
    }

    exit() {
    }

    update() {
        const move = this._parent._movement;
        if (move._forward || move._backward) {
            this._parent.SetState('walk');
        } 
        // else if (move.) {
        //     this._parent.SetState('attack');
        // }
    }
};