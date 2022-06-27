import { ObjectEntity } from "../../entities/ObjectEntity";
import IComponent from "../../utils/ecs/IComponent";
import FiniteStateMachine from "../CharacterAnimation/FiniteStateMachine";
import { AttackController } from "../components/attackController";
import { Movement } from "../components/movement-component";
import { Stats } from "../components/stats";

export default class BasicCharacterControllerInput implements IComponent {
  Entity: ObjectEntity;

  protected movement: Movement;
  protected attack: AttackController;
  protected stateMachine: FiniteStateMachine;
  stats: Stats;

  update(_): void {
    //TODO
  }

  awake() {
    this.movement = this.Entity.getComponent(Movement)
    this.attack = this.Entity.getComponent(AttackController)
    this.stateMachine = this.Entity.getComponent(FiniteStateMachine)
    document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
  }

  // onDeath() {
  //   document.removeEventListener("keydown", (e) => this.onKeyDown(e));
  //   document.removeEventListener("keyup", (e) => this.onKeyUp(e));
  //   console.log('asdasda');
  // }

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
        if(this.stateMachine.currentState.name != 'attack') {
          this.attack.primary = true;
        }
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
