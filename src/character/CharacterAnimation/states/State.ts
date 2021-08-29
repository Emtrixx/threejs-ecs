import { CharacterFSM } from "../FiniteStateMachine";

export abstract class State {
    protected _parent: CharacterFSM;
    public name: string
    
    constructor(parent: CharacterFSM) {
      this._parent = parent;
    }

    public enter(prevState): void {}
    public exit(): void {}
    public update(deltaTime): void {}
  };