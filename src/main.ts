import './styles.scss';
import * as THREE from 'three';
import './extensions/raycasting';
import { SceneManager } from './core/scene-manager';
import { Selector } from './modules/selector';
import { Module } from './modules/module';
import { SceneTree } from './modules/scene-tree';
import { Navigator } from './modules/navigator';

const sceneManager = new SceneManager();
const sphereGeometry =  new THREE.SphereBufferGeometry(1, 10, 10);
const cubeGeometry = new THREE.BoxBufferGeometry(2, 2);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00F00F, flatShading: true });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(10, 0, 0);


sceneManager.camera.position.set(10, 10, 10);

sceneManager.addObject(sphere);
sceneManager.addObject(cube);

class Root {
    modules: (typeof Module)[];
    modulesMap: Map<string, Module>;

    constructor() {
        this.modulesMap = new Map<string, Module>();
        this.modules = [
            Selector,
            Navigator,
            SceneTree
        ]

    }

    setupModules() {
        this.modules.forEach(module => {
            this.modulesMap.set(module.name, new module(sceneManager));
        });
    }
}

const root = new Root();
root.setupModules();