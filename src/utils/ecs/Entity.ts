import IComponent from "./IComponent";
import { IUpdate, IAwake } from "../lifecycle/Ilifecylce";

export default abstract class Entity implements IAwake, IUpdate {
  protected _name: String;
  protected _id: String;
  protected _components: Array<IComponent> = [];

  public get components(): Array<IComponent> {
    return this._components;
  }

  create(name: String) {
    this._name = name;
  }

  public addComponent(component: IComponent): void {
    this._components.push(component);
    component.Entity = this;
  }

  public removeComponent<C extends IComponent>(constr: { new(...args: any[]): C }): void {
    let toRemove: IComponent | undefined;
    let index: number | undefined;

    for (let i = 0; i < this._components.length; i++) {
      const component = this._components[i];
      if (component instanceof constr) {
        toRemove = component;
        index = i;
        break;
      }
    }

    if (toRemove && index) {
      toRemove.Entity = null;
      this._components.splice(index, 1);
    }
  }

  public getComponent<C extends IComponent>(constr: { new(...args: any[]): C }): C {
    // --- ADD --- //
    for (const component of this._components) {
      if (component instanceof constr) {
        return component as C;
      }
    }
    throw new Error(
      `Component ${constr.name} not found on Entity ${this.constructor.name}`
    );
    // --- ADD --- //
  }

  public hasComponent<C extends IComponent>(constr: { new(...args: any[]): C }): boolean {
    for (const component of this._components) {
      if (component instanceof constr) {
        return true
      }
    }

    return false
  }
  
  public awake() {
    for(const component of this._components){
      component.awake()
    }
  }

  public update(deltaTime: number): void {
    for(const component of this._components) {
      component.update(deltaTime)
    }
  }
}
