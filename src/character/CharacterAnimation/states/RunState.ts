import { State } from "./State";

export class RunState extends State {


    constructor(parent) {
        super(parent);
        this.name = 'run'
    }

    enter(prevState) {
        const curAction = this._parent._proxy._animations['run'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.name].action;

            curAction.enabled = true;

            if (prevState.name == 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.1, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    exit() {
    }

    update() {
        const move = this._parent._movement
        if (move._forward || move._backward) {
            if (!move._run) {
                this._parent.SetState('walk');
            }
            return;
        }
        this._parent.SetState('idle');
    }
};