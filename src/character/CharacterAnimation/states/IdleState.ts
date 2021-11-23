import { AttackController } from "../../components/attackController";
import { Movement } from "../../components/movement-component";
import { State } from "./State";

export class IdleState extends State {
    move: Movement;
    attack: AttackController;
    constructor(parent) {
        super(parent);
        this.name = 'idle'
        this.move = parent.movement;
        this.attack = parent.attack;
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
        if (this.move.forward || this.move.backward) {
            this.parent.SetState('walk');
        } 
        else if(this.attack.primary) {
            this.parent.SetState('attack');
        }
    }
};