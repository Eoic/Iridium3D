/**
 * - Setup initial scene.
 * - Render.
 * - Dispatch events.
 * - Provide access to modules and core objects (e.g. scene camera).
 * - Provide methods for updating scene state (e.g. recompute bounding trees for raycasting, get intersectable objects)
 */

import * as THREE from 'three';
import { Module } from '../modules/module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Camera, Light, Object3D, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';


type Controls = OrbitControls | TrackballControls;

export class SceneManager {
    public camera: PerspectiveCamera | OrthographicCamera;
    private modules: Module[];
    private controls: Controls;
    private renderer: WebGLRenderer;
    private scene: Scene;

    constructor() {
        this.modules = [];
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10_000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.scene = new Scene();
        this.setupScene();
        this.addEvents();
        this.render();
    }

    setupScene() {
        const cameraLight = new THREE.SpotLight(0xFFFFFF, 0.1, 300, 1, 0, 1)
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene.background = new THREE.Color(0x2f2f2f);
        this.camera.add(cameraLight);

        let light;
        let val = 0.5

        light = new THREE.DirectionalLight(0xffffff, 0.6 * val);
        light.position.set(128, 128, 0);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.8 * val);
        light.position.set(-128, 128, 0);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.5 * val);
        light.position.set(128, -128, 0);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.8 * val);
        light.position.set(-128, -128, 0);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.6 * val);
        light.position.set(0, 0, -128);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xffffff, 0.6 * val);
        light.position.set(0, 0, 128);
        this.scene.add(light);

        this.scene.add(this.camera);
    }

    addEvents() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.updateProjectionMatrix();
        });
    }

    render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }

    addObject(object: Object3D) {
        this.scene.add(object);
    }
}