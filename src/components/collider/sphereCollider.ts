import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Collider } from "./collider";

export class SphereCollider extends Collider {
    radius: number;

    constructor(pworld: CANNON.World ,mass: number, radius: number = null, offset: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0)) {
        super(pworld, mass, offset);
        this.radius = radius;
    }
    
    awake(): void {
        let radius = this.radius;
        if(!this.radius) {
            radius = this.Entity.target.scene.geometry.parameters.radius
        }
    
        // Create body with specified mass
        this.body.addShape(new CANNON.Sphere(radius), this.offset);
    
        // Copy initial transformation from mesh to body
        this.body.position.copy(this.Entity.target.scene.position);
        // this.body.quaternion.copy(this.Entity.target.quaternion);
    
        this.pworld.addBody(this.body);
    }
    
    onLoad() {
        
    }

    update(_): void {}
}