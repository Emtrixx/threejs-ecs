import { State } from "./State";

export class WalkState extends State {
    constructor(parent) {
        super(parent);
        this.name = 'walk'
    }

    enter(prevState) {
        const curAction = this.parent.proxy.animations['walk'].action;
        if (prevState) {
            const prevAction = this.parent.proxy.animations[prevState.name].action;
            curAction.enabled = true;

            if (prevState.name == 'run') {
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
        const move = this.parent.movement
        if (move.forward || move.backward) {
            if (move.run) {
                this.parent.SetState('run');
            }
            return;
        }
        this.parent.SetState('idle');
    }
};