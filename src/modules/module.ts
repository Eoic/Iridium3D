import { SceneManager } from '../core/scene-manager';

export class Module {
    protected sceneManager: SceneManager;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
    }
}