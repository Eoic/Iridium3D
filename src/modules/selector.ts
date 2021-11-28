import { Module } from './module';
import { SceneManager } from '../core/scene-manager';
import { CustomMouseEvent, Event, EventManager, EventPayload } from '../core/event-manager';
import { Events } from '../core/events';
import { Color, Material, Mesh, MeshBasicMaterial, Object3D } from 'three';

export class Selector extends Module {
    private cameraMoved: boolean;
    private mouseReleased: boolean;

    public constructor(sceneManager: SceneManager) {
        super(sceneManager);
        this.cameraMoved = false;
        this.mouseReleased = true;
        this.addEvents();
    }

    /**
     * 
     * if (cameraMoved) {
     *     if (mouseUp) {
     *         cameraMoved = false;
     *     } 
     * } else {
     *     
     * }
     * 
     */

    addEvents() {
        EventManager.on(Events.CameraMove, () => {
            this.cameraMoved = true;
            this.mouseReleased = false;
        });

        EventManager.on(Events.MouseUp, () => {
            this.mouseReleased = true;
        });

        EventManager.on(Events.MouseMove, (event: EventPayload<MouseEvent, CustomMouseEvent>) => {
            if (event.customData.intersection)
                this.sceneManager!.outlinePassFirst.selectedObjects = [event.customData.intersection.object];
            else this.sceneManager!.outlinePassFirst.selectedObjects = [];

            if (this.mouseReleased)
                this.cameraMoved = false;
        });

        EventManager.on(Events.MouseClick, (event: EventPayload<MouseEvent, CustomMouseEvent>) => {
            console.log('Camera', this.cameraMoved);
            console.log('Released', this.mouseReleased);

            if (event.customData.intersection && !this.cameraMoved && this.mouseReleased) {
                const object = event.customData.intersection?.object;
                object.userData.isSelected = !object.userData.isSelected;
                this.sceneManager.outlinePassSecond.selectedObjects = this.sceneManager.scene.children.filter(sceneObject => sceneObject.userData.isSelected);
                this.cameraMoved = false;
                return;
            }

            if (!this.cameraMoved) {
                this.sceneManager.scene.children.forEach(sceneObject => sceneObject.userData.isSelected = false);
                this.sceneManager.outlinePassSecond.selectedObjects = [];
            }

            this.cameraMoved = false;
        });
    }

    select() {
        
    }

    deselect() {

    }

    selectAll() {

    }

    deselectAll() {

    }
}