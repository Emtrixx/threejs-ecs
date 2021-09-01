import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import { AttackController } from "../components/attackController";
import { Movement } from "../components/movement-component";
import { Stats } from "../components/stats";
import { AttackState } from "./states/AttackState";
import { DeathState } from "./states/DeathState";
import { IdleState } from "./states/IdleState";
import { RunState } from "./states/RunState";
import { State } from "./states/State";
import { WalkState } from "./states/WalkState";

export default class FiniteStateMachine implements IComponent {
  Entity: Entity;
  states: object = {};
  currentState: State | null;
  movement: Movement;
  //wird in loader gesetzt
  mixer: THREE.AnimationMixer
  attack: AttackController;

  constructor() {
    this.states = {};
    this.currentState = null;
  }

  awake(): void {
    this.movement = this.Entity.getComponent(Movement)
    this.attack = this.Entity.getComponent(AttackController)
  }

  update(deltaTime: number): void {
    if (this.currentState) {
        this.currentState.update(deltaTime);
        //mixer update
        this.mixer.update(deltaTime)
      }
  }

  AddState(name, type) {
    this.states[name] = type;
  }

  SetState(name) {
    const prevState = this.currentState;

    if (prevState) {
      if (prevState.name == name) {
        return;
      }
      prevState.exit();
    }

    const state = new this.states[name](this);

    this.currentState = state;
    state.enter(prevState);
  }
}

export class CharacterFSM extends FiniteStateMachine {
  proxy: any;
  constructor(proxy) {
    super();
    this.proxy = proxy;
    this.Init();
  }

  Init() {
    this.AddState('idle', IdleState);
    this.AddState('walk', WalkState);
    this.AddState('run', RunState);
    this.AddState('attack', AttackState);
    this.AddState('death', DeathState);
  }
}

export class ZombieFSM extends FiniteStateMachine {
  proxy: any;
  constructor(proxy) {
    super();
    this.proxy = proxy;
    this.Init();
  }

  Init() {
    this.AddState('idle', IdleState);
    this.AddState('walk', WalkState);
    this.AddState('run', RunState);
    this.AddState('attack', AttackState);
    this.AddState('death', DeathState);
  }
}

export class BasicCharacterControllerProxy {
  animations: object;
  constructor(animations: object) {
    this.animations = animations;
  }
};
