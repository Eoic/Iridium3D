import { Camera, Mesh, Object3D, Raycaster, Vector2 } from "three"

export class Physics {
    static raycaster: Raycaster = new Raycaster();
    // static getIntersectables = (objects: Object3D) => {
    //     return [].filter.call(objects, (object) => )
    // }

    // TODO: References to intersectable object should not be updated every time.
    static getFirstIntersection = (objects: Object3D[], camera: Camera, position: Vector2) => {
        this.raycaster.firstHitOnly = true;
        this.raycaster.setFromCamera({ x: position.x, y: position.y }, camera);

        const intersectableObjects = [].flatMap.call(objects, (object: Object3D) => {
            if (!(object instanceof Mesh))
                return [];

            // TODO: Should not be calculated on every hit.
            object.geometry.computeBoundsTree();
            return object;
        });

        return this.raycaster.intersectObjects(intersectableObjects as Object3D[], false).shift();
    }
}

