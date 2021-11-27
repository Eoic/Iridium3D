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
import { Grid } from './grid';


type Controls = OrbitControls | TrackballControls;

export class SceneManager {
    public camera: PerspectiveCamera | OrthographicCamera;
    private modules: Module[];
    private controls: Controls;
    private renderer: WebGLRenderer;
    private scene: Scene;
    private spotLight: THREE.SpotLight;
    private grid: Grid;

    constructor() {
        this.modules = [];
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.spotLight = new THREE.SpotLight(0xFFeeb1, 0.8);
        this.scene = new Scene();
        this.grid = new Grid(2, 10, 'white', 200);
        this.setupScene();
        this.addEvents();
        this.render();
    }

    setupScene() {
        document.body.appendChild(this.renderer.domElement);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 2.3;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene.background = new THREE.Color(0x2f2f2f);


        const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.2);
        // this.spotLight.castShadow = true;
        this.scene.add(hemiLight);
        this.scene.add(this.spotLight);
        this.scene.add(this.camera);
        
        this.grid.attach(this.scene);
    }

    addEvents() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            if (this.camera instanceof PerspectiveCamera)
                this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.updateProjectionMatrix();
        });
    }

    render() {
        this.spotLight.position.set(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z,
        );

        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }

    addObject(object: Object3D) {
        this.scene.add(object);
    }

    // Methods which are not supposed to be called directly but instead after some action (e.g. after adding / removing object).

    // update scene intersectables and recompute bounding trees.
    updateIntersectables() {

    }
}