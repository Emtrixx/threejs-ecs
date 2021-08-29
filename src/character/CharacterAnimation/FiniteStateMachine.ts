import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import { Movement } from "../components/movement-component";
import { AttackState } from "./states/AttackState";
import { DeathState } from "./states/DeathState";
import { IdleState } from "./states/IdleState";
import { RunState } from "./states/RunState";
import { State } from "./states/State";
import { WalkState } from "./states/WalkState";

export default class FiniteStateMachine implements IComponent {
  Entity: Entity;
  _states: object = {};
  _currentState: State | null;
  _movement: Movement;

  constructor() {
    this._states = {};
    this._currentState = null;
  }

  awake(): void {
    this._movement = this.Entity.getComponent(Movement)
  }

  update(deltaTime: number): void {
    if (this._currentState) {
        this._currentState.update(deltaTime);
      }
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.name == name) {
        return;
      }
      prevState.exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.enter(prevState);
  }
}

export class CharacterFSM extends FiniteStateMachine {
  _proxy: any;
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
    // this._AddState('attack', AttackState);
    // this._AddState('death', DeathState);
  }
}

export class BasicCharacterControllerProxy {
  _animations: object;
  constructor(animations: object) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
};
