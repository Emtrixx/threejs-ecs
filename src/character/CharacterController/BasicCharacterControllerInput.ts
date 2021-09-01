import Entity from "../../utils/ecs/Entity";
import IComponent from "../../utils/ecs/IComponent";
import { AttackController } from "../components/attackController";
import { Movement } from "../components/movement-component";

export default class BasicCharacterControllerInput implements IComponent {
  Entity: Entity;
  private movement: Movement;
  private attack: AttackController;

  update(_): void {
    //TODO
  }

  awake() {
    this.movement = this.Entity.getComponent(Movement)
    this.attack = this.Entity.getComponent(AttackController)
    document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
  }

  onKeyDown(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this.movement.forward = true;
        break;
      case "KeyA":
        this.movement.left = true;
        break;
      case "KeyS":
        this.movement.backward = true;
        break;
      case "KeyD":
        this.movement.right = true;
        break;
      case "Space":
        this.movement.jump = true;
        break;
      case "ShiftLeft":
        this.movement.run = true;
        break;
      case "KeyC":
        this.attack.primary = true;
        break;
    }
  }
  onKeyUp(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this.movement.forward = false;
        break;
      case "KeyA":
        this.movement.left = false;
        break;
      case "KeyS":
        this.movement.backward = false;
        break;
      case "KeyD":
        this.movement.right = false;
        break;
      case "Space":
        this.movement.jump = false;
        break;
      case "ShiftLeft":
        this.movement.run = false;
        break;
      case "KeyC":
        this.attack.primary = false;
        break;
    }
  }
}
