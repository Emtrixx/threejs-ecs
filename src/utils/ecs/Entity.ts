import IComponent from "./IComponent";
import { IUpdate, IAwake, IonLoad } from "../lifecycle/Ilifecylce";

export default abstract class Entity implements IAwake, IUpdate, IonLoad {
  // protected name: String;
  // protected id: String;
  public components: Array<IComponent> = [];



  // create(name: String) {
  //   this.name = name;
  // }

  public addComponent(component: IComponent): void {
    this.components.push(component);
    component.Entity = this;
  }

  public removeComponent<C extends IComponent>(constr: { new(...args: any[]): C }): void {
    let toRemove: IComponent | undefined;
    let index: number | undefined;

    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];
      if (component instanceof constr) {
        toRemove = component;
        index = i;
        break;
      }
    }

    if (toRemove && index) {
      toRemove.Entity = null;
      this.components.splice(index, 1);
    }
  }

  public getComponent<C extends IComponent>(constr: { new(...args: any[]): C }): C {
    for (const component of this.components) {
      if (component instanceof constr) {
        return component as C;
      }
    }
    throw new Error(
      `Component ${constr.name} not found on Entity ${this.constructor.name}`
    );
  }

  public hasComponent<C extends IComponent>(constr: { new(...args: any[]): C }): boolean {
    for (const component of this.components) {
      if (component instanceof constr) {
        return true
      }
    }

    return false
  }
  
  public awake() {
    for(const component of this.components){
      component.awake()
    }
  }

  onLoad(): void {}

  public update(deltaTime: number): void {
    for(const component of this.components) {
      component.update(deltaTime)
    }
  }

}
