import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import { AttackController } from "../components/attackController";
import { Movement } from "../components/movement-component";

export default class BasicCharacterControllerInput implements IComponent {
  Entity: Entity;
  private _movement: Movement;
  private _attack: AttackController;

  update(_): void {
    //TODO
  }

  awake() {
    this._movement = this.Entity.getComponent(Movement)
    this._attack = this.Entity.getComponent(AttackController)
    document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
  }

  onKeyDown(e: KeyboardEvent): any {
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
      case "KeyC":
        this._attack._primary = true;
        break;
    }
  }
  onKeyUp(e: KeyboardEvent): any {
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
      case "KeyC":
        this._attack._primary = false;
        break;
    }
  }
}
