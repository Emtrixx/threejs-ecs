import { Transform } from "../../../components/transform";
import Entity from "../../../utils/ecs/Entity";
import IComponent from "../../../utils/ecs/IComponent";
import { SpatialHashGrid } from "../../../utils/SpatialHashGrid";

export class SpatialGridController implements IComponent {
    Entity: Entity;
    grid: SpatialHashGrid;
    client: any;
    private transform: Transform;

    constructor(params: {grid}) {
        this.grid = params.grid;
    }
    
    update(deltaTime: number): void {  
        this.client.position[0] = this.transform.position.x
        this.client.position[1] = this.transform.position.z

        this.grid.UpdateClient(this.client)
    }

    awake() {
        this.transform = this.Entity.getComponent(Transform)
        const pos = [
            this.transform.position.x,
            this.transform.position.z,
        ];

        //width and height hardcoded
        this.client = this.grid.NewClient(pos, [1, 1]);
        this.client.entity = this.Entity;
    }

    // OnPosition(msg) {
    //     this.client.position = [msg.value.x, msg.value.z];
    //     this.grid.UpdateClient(this.client);
    // }

    FindNearbyEntities(range): Array<any> {
        const results = this.grid.FindNear(
            [this.transform.position.x, this.transform.position.z], [range, range]);

        return results.filter(c => c.entity != this.Entity);
    }

    removeFromGrid() {
        this.grid.Remove(this.client)
    }
};
