import Entity from "./Entity";
import { IUpdate, IAwake } from "../lifecycle/Ilifecylce";
export default interface IComponent extends IAwake, IUpdate  {
    Entity : Entity | null
}