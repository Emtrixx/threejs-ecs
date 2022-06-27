import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Transform } from "../transform";
import { ObjectEntity } from "../../entities/ObjectEntity";
import { SpatialGridController } from "../../game/world/components/SpatialHashGridController";
import IComponent from "../../utils/ecs/IComponent";
import { Collider } from "./collider";

export class BoxCollider extends Collider {
    dimension: CANNON.Vec3;
    transform: Transform;

    constructor(pworld: CANNON.World ,mass: number, offset: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0), dimension: CANNON.Vec3 = null) {    
        super(pworld, mass, offset);
        this.dimension = dimension;
    }
    
    awake(): void {
        this.transform = this.Entity.getComponent(Transform);
    }
    
    onLoad() {
        let dimension = this.dimension;
        if(!dimension) {
            // Get bounding Box from mesh
            const boundingBox = new THREE.Box3().setFromObject(this.Entity.target.scene)
            console.log(this.Entity.target.scene)
            const boundingBoxSize = new THREE.Vector3();
            boundingBox.getSize(boundingBoxSize);
        
            // Create body with specified mass
            dimension = new CANNON.Vec3(boundingBoxSize.x / 2, boundingBoxSize.y / 2, boundingBoxSize.z / 2);
            console.log(dimension);
        }
        this.body.addShape(new CANNON.Box(dimension), this.offset);
    
        // Copy initial transformation from mesh to body
        const position = this.transform.position;
        this.body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
        this.body.quaternion.copy(this.Entity.target.scene.quaternion);
        // this.body.quaternion.copy(this.transform.quaternion);
        // this.body.fixedRotation = true;

        //DEBUG
        // @ts-ignore: cannon helper
        //window.cannonHelper.addVisual(this.body);
    
        this.pworld.addBody(this.body);
    }

    remove(): void {
        super.remove();
        this.body.removeShape(this.body.shapes[0]);
        this.body.angularDamping = 1;
        // @ts-ignore: cannon helper
        //window.cannonHelper.removeVisual(this.body);
    }

    update(_): void {}
}