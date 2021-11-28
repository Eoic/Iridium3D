import * as THREE from 'three';
import { Color, Mesh, Object3D, Scene } from 'three';
import gridFragmentShader from '../shaders/grid/grid-fragment.glsl';
import gridVertexShader from '../shaders/grid/grid-vertex.glsl';

export class Grid {
    private color: Color;
    private innerSize: number;
    private outerSize: number;
    private distance: number;
    private mesh: Mesh;

    constructor(innerSize = 100, outerSize = 10, color = 0xFFFFFF, distance = 10_000) {
        this.color = new THREE.Color(color);
        this.innerSize = innerSize;
        this.outerSize = outerSize;
        this.distance = distance;

        const geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: this.color },
                uDistance: { value: this.distance },
                uInnerSize: { value: this.innerSize },
                uOuterSize: { value: this.outerSize },
            },
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: gridVertexShader,
            fragmentShader: gridFragmentShader,
            extensions: { derivatives: true },
        });

        this.mesh = new Mesh(geometry, material);
        this.mesh.frustumCulled = false;
    }

    public attach(scene: Scene) {
        const wrapper = new Object3D();
        wrapper.add(this.mesh);
        scene.add(wrapper);
    }
}