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
import { Color, Frustum, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import Stats from 'stats.js'
import { Grid } from './grid';
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { CustomEvent, CustomMouseEvent, EventManager, EventPayload } from './event-manager';
import { Events } from './events';
import { Physics } from './physics';
import { InputManager } from './input-manager';

type Controls = OrbitControls | TrackballControls;

export enum RenderPassType {
    OutlinePassOne,
    OutlinePassTwo,
}

export class SceneManager {
    public camera: PerspectiveCamera | OrthographicCamera;
    private modules: Module[];
    private controls: Controls;
    private renderer: WebGLRenderer;
    public scene: Scene;
    private grid: Grid;
    private composer: EffectComposer | undefined;
    public intersectables: Array<Object3D> = []; 
    private frustum: Frustum = new Frustum();
    private stats: Stats;
    private inputManager: InputManager;
    public renderPassMap: Map<RenderPassType, Pass>;

    constructor() {
        this.modules = [];
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.grid = new Grid(2, 10, 0xFFFFFF, 500);
        this.scene = new Scene();
        this.stats = new Stats();
        this.renderPassMap = new Map();
        this.inputManager = InputManager.instance;
        this.setupScene();
        this.setupLights();
        this.setupRenderer();
        this.addEvents();
        this.setupDebugInfo();
        this.bindKeys();
        this.render();
    }

    bindKeys() {
        this.inputManager.addKey('ControlLeft');
        this.inputManager.addKey('ShiftLeft');
    }

    setupScene() {
        document.body.appendChild(this.renderer.domElement);
        this.renderer.outputEncoding = THREE.LinearEncoding;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 2.3;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene.background = new THREE.Color(0x2F2F2F);
        this.scene.add(this.camera);
        this.grid.attach(this.scene);
    }

    setupLights() {
        const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.2);
        const spotLight = new THREE.SpotLight(0xFFeeb1, 0.8);
        this.scene.add(hemisphereLight);
        this.camera.add(spotLight);
    }

    setupRenderer() {
        const fxaaPass = new ShaderPass(FXAAShader);
        const outlinePassFirst = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
        const outlinePassSecond = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
        fxaaPass.uniforms[ 'resolution' ].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        outlinePassFirst.edgeStrength = 10;
        outlinePassSecond.edgeStrength = 10;
        outlinePassFirst.visibleEdgeColor = new Color(0xFFFFFF);
        outlinePassFirst.hiddenEdgeColor = new Color(0xFFFFFF);
        outlinePassSecond.visibleEdgeColor = new Color(0xFFA500);
        outlinePassSecond.hiddenEdgeColor = new Color(0xFFA500);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(outlinePassFirst);
        this.composer.addPass(outlinePassSecond);
        this.composer.addPass(fxaaPass);
        this.renderPassMap.set(RenderPassType.OutlinePassOne, outlinePassFirst);
        this.renderPassMap.set(RenderPassType.OutlinePassTwo, outlinePassSecond);
        // this.frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    }

    setupDebugInfo() {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    addEvents() {
        let controlsInitChange = true;
        const vector2 = new Vector2();

        window.addEventListener('resize', () => {
            if (this.camera instanceof PerspectiveCamera)
                this.camera.aspect = window.innerWidth / window.innerHeight;

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer?.setSize(window.innerWidth, window.innerHeight);
            this.camera.updateProjectionMatrix();
        });

        window.addEventListener('mousemove', (event: MouseEvent) => {
            vector2.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * -2 + 1);
            const intersection = Physics.getIntersection(this.intersectables, this.camera, vector2);
            EventManager.dispatch(Events.MouseMove, new EventPayload<MouseEvent, CustomMouseEvent>(event, { normalizedPosition: vector2, intersection }));
        });

        window.addEventListener('click', (event: MouseEvent) => {
            vector2.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * -2 + 1);
            const intersection = Physics.getIntersection(this.intersectables, this.camera, vector2);
            EventManager.dispatch(Events.MouseClick, new EventPayload<MouseEvent, CustomMouseEvent>(event, { normalizedPosition: vector2, intersection }));
        });

        this.controls.addEventListener('change', (event) => {
            if (controlsInitChange) {
                controlsInitChange = false;
                return;
            }
            
            EventManager.dispatch(Events.CameraMove, new EventPayload<MouseEvent, CustomEvent>(event, {}));
        });

        window.addEventListener('mouseup', (event) => {
            EventManager.dispatch(Events.MouseUp, new EventPayload<MouseEvent, CustomEvent>(event, {}));
        });

        window.addEventListener('wheel', (event) => {
            EventManager.dispatch(Events.MouseWheel, new EventPayload<MouseEvent, CustomEvent>(event, {}));
        });
    }

    /**
     * Renders the scene.
     */
    render() {
        requestAnimationFrame(() => this.render());
        this.controls.update();
        this.composer!.render();
        this.stats.update();
        this.inputManager.update();
    }

    /**
     * Adds new object to the scene and updates list of intersectable objects.
     * @param object {Object3D} Scene object.
     */
    addObject(object: Object3D) {
        this.scene.add(object);
        this.updateIntersectables();
    }

    /**
     * Updates list of raycastable objects.
     */
    updateIntersectables() {
        this.intersectables = Array<Object3D>().flatMap.call(this.scene.children, (object: Object3D) => {
            if (!(object instanceof Mesh))
                return [];

            object.geometry.computeBoundsTree();
            return [object];
        }) as Object3D[];
    }
}