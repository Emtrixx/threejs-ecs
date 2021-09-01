import { Transform } from "../../../components/transform";
import Entity from "../../../utils/ecs/Entity";
import IComponent from "../../../utils/ecs/IComponent";
import { SpatialHashGrid } from "../../../utils/SpatialHashGrid";

export class SpatialGridController implements IComponent {
    Entity: Entity;
    _grid: SpatialHashGrid;
    _client: any;
    private _transform: Transform;

    constructor(params: {grid}) {
        this._grid = params.grid;
    }
    
    update(deltaTime: number): void {  
        this._client.position[0] = this._transform.position.x
        this._client.position[1] = this._transform.position.z

        this._grid.UpdateClient(this._client)
    }

    awake() {
        this._transform = this.Entity.getComponent(Transform)
        const pos = [
            this._transform.position.x,
            this._transform.position.z,
        ];

        //width and height hardcoded
        this._client = this._grid.NewClient(pos, [1, 1]);
        this._client.entity = this.Entity;
    }

    _OnPosition(msg) {
        this._client.position = [msg.value.x, msg.value.z];
        this._grid.UpdateClient(this._client);
    }

    FindNearbyEntities(range): Array<any> {
        const results = this._grid.FindNear(
            [this._transform.position.x, this._transform.position.z], [range, range]);

        return results.filter(c => c.entity != this.Entity);
    }
};
