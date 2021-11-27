import * as THREE from 'three';
import { Color, Mesh, Scene } from 'three';
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
            side: THREE.DoubleSide,
            depthWrite: false,

            uniforms: {
                uinnerSize1: {
                    value: this.innerSize,
                },
                uinnerSize: {
                    value: this.outerSize,
                },
                uColor: {
                    value: this.color,
                },
                uDistance: {
                    value: this.distance,
                },
            },
            transparent: true,
            vertexShader: gridVertexShader,
            fragmentShader: gridFragmentShader,
            extensions: { derivatives: true },
        });

        this.mesh = new Mesh(geometry, material);
        this.mesh.frustumCulled = false;
    }

    public attach(scene: Scene) {
        scene.add(this.mesh);
    }
}