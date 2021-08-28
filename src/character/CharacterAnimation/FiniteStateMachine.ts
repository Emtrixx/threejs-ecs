import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";

export default class FiniteStateMachine implements IComponent {
  Entity: Entity;
  _states: {};
  _currentState: any;
  constructor() {
    this._states = {};
    this._currentState = null;
  }
  awake(): void {
    throw new Error("Method not implemented.");
  }
  update(deltaTime: number): void {
    throw new Error("Method not implemented.");
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }
}
