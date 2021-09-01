import { CharacterFSM } from "../FiniteStateMachine";

export abstract class State {
    protected parent: CharacterFSM;
    public name;
    
    constructor(parent: CharacterFSM) {
      this.parent = parent;
    }

    public enter(prevState): void {}
    public exit(): void {}
    public update(deltaTime): void {}
  };