import { Camera, Mesh, Object3D, Raycaster, Vector2 } from "three"

export class Physics {
    static raycaster: Raycaster = new Raycaster();

    static getIntersection = (objects: Object3D[], camera: Camera, position: Vector2) => {
        this.raycaster.firstHitOnly = true;
        this.raycaster.setFromCamera({ x: position.x, y: position.y }, camera);
        return this.raycaster.intersectObjects(objects, false).shift();
    }
}

