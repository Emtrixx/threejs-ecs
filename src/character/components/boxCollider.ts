import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Transform } from "../../components/transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import IComponent from "../../utils/ecs/IComponent";
import { Collider } from "../../components/collider";

export class BoxCollider extends Collider {

    constructor(pworld: CANNON.World ,mass: number, offset: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0)) {
        super(pworld, mass, offset);
    }
    
    awake(): void {
        // Get bounding Box from mesh
        const boundingBox = new THREE.Box3().setFromObject(this.Entity.target)
        const boundingBoxSize = new THREE.Vector3();
        boundingBox.getSize(boundingBoxSize);

        // Create body with specified mass
        const dimension = new CANNON.Vec3(boundingBoxSize.x / 2, boundingBoxSize.y / 2, boundingBoxSize.z / 2);
        this.body.addShape(new CANNON.Box(dimension), this.offset);

        // Copy initial transformation from mesh to body
        this.body.position.copy(this.Entity.target.position);
        this.body.quaternion.copy(this.Entity.target.quaternion);

        this.pworld.addBody(this.body);
    }
    update(_): void {}
}