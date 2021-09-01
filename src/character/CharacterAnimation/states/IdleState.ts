import { State } from "./State";

export class IdleState extends State {
    constructor(parent) {
        super(parent);
        this.name = 'idle'
    }

    enter(prevState) {
        const idleAction = this.parent.proxy.animations['idle'].action;
        if (prevState) {
            const prevAction = this.parent.proxy.animations[prevState.name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.25, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    exit() {
    }

    update() {
        const move = this.parent.movement;
        const attack = this.parent.attack
        if (move.forward || move.backward) {
            this.parent.SetState('walk');
        } 
        else if(attack.primary) {
            this.parent.SetState('attack');
        }
    }
};