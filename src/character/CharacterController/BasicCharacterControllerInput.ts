import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import { Movement } from "../components/movement-component";

export default class BasicCharacterControllerInput implements IComponent {
  Entity: Entity;
  _keys: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
  };
  private _movement: Movement;

  constructor() {
  }

  update(deltaTime: number): void {
    for(const key in this._keys) {
      if(this._keys[key]) {
        console.log(key);
      }
    }
  }

  awake() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };

    this._movement = this.Entity.getComponent(Movement)

    document.addEventListener("keydown", (e) => this._onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this._onKeyUp(e), false);
  }
  _onKeyDown(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this._movement._forward = true;
        break;
      case "KeyA":
        this._movement._left = true;
        break;
      case "KeyS":
        this._movement._backward = true;
        break;
      case "KeyD":
        this._movement._right = true;
        break;
      case "Space":
        this._movement._jump = true;
        break;
      case "ShiftLeft":
        this._movement._run = true;
        break;
    }
  }
  _onKeyUp(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this._movement._forward = false;
        break;
      case "KeyA":
        this._movement._left = false;
        break;
      case "KeyS":
        this._movement._backward = false;
        break;
      case "KeyD":
        this._movement._right = false;
        break;
      case "Space":
        this._movement._jump = false;
        break;
      case "ShiftLeft":
        this._movement._run = false;
        break;
    }
  }
}
