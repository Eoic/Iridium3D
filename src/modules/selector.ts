import { Module } from './module';
import { RenderPassType, SceneManager } from '../core/scene-manager';
import { CustomKeyboardEvent, CustomMouseEvent, EventManager, EventPayload } from '../core/event-manager';
import { Events } from '../core/events'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { Object3D } from 'three';

/**
 * Ctrl - select multiple.
 * Shift - deselect on clicked.
 */

export class Selector extends Module {
    private hoverOutline: OutlinePass | undefined;
    private selectionOutline: OutlinePass | undefined;
    private cameraMoved: boolean;
    private mouseReleased: boolean;
    private multiSelect: boolean;
    private multiDeselect: boolean;

    public constructor(sceneManager: SceneManager) {
        super(sceneManager);
        this.cameraMoved = false;
        this.multiSelect = false;
        this.multiDeselect = false;
        this.mouseReleased = true;
        this.hoverOutline = sceneManager.renderPassMap.get(RenderPassType.OutlinePassOne) as OutlinePass;
        this.selectionOutline = sceneManager.renderPassMap.get(RenderPassType.OutlinePassTwo) as OutlinePass;
        this.addEvents();
    }

    addEvents() {
        EventManager.on(Events.Key, (event: EventPayload<KeyboardEvent, CustomKeyboardEvent>) => {
            switch (event.originalData.code) {
                case 'ControlLeft':
                    this.multiSelect = event.customData.keyState.isHeld;
                    break;
                case 'ShiftLeft':
                    this.multiDeselect = event.customData.keyState.isHeld;
                    break;
            }
        });

        EventManager.on(Events.MouseWheel, () => {
            this.cameraMoved = false;
        });

        EventManager.on(Events.CameraMove, () => {
            this.cameraMoved = true;
            this.mouseReleased = false;
        });

        EventManager.on(Events.MouseUp, () => {
            this.mouseReleased = true;
        });

        EventManager.on(Events.MouseMove, (event: EventPayload<MouseEvent, CustomMouseEvent>) => {
            if (this.hoverOutline) {
                if (event.customData.intersection && !event.customData.intersection.object.userData.isSelected)
                    this.hoverOutline.selectedObjects = [event.customData.intersection.object];
                else this.hoverOutline.selectedObjects = [];
            }

            if (this.mouseReleased)
                this.cameraMoved = false;
        });

        EventManager.on(Events.MouseClick, (event: EventPayload<MouseEvent, CustomMouseEvent>) => {
            if (event.customData.intersection && !this.cameraMoved && this.mouseReleased) {
                const object = event.customData.intersection?.object;
                
                if (!this.multiDeselect)
                    this.select(object);
                else this.deselect(object)
                
                return;
            }

            if (!this.cameraMoved && !this.multiSelect) 
                this.deselectAll(this.selectionOutline)

            this.cameraMoved = false;
        });
    }

    select(object: Object3D) {
        if (!this.multiSelect)
            this.sceneManager.scene.children.forEach(sceneObject => sceneObject.userData.isSelected = false)

        object.userData.isSelected = true;
        
        if (this.selectionOutline)
            this.selectionOutline.selectedObjects = this.sceneManager.scene.children.filter(sceneObject => sceneObject.userData.isSelected);
        
        if (this.hoverOutline)
            this.hoverOutline.selectedObjects = this.hoverOutline?.selectedObjects.filter(selectedObject => selectedObject.id !== object.id);
        
        this.cameraMoved = false;
    }

    deselect(object: Object3D) {
        object.userData.isSelected = false;

        if (this.selectionOutline)
            this.selectionOutline.selectedObjects = this.sceneManager.scene.children.filter(sceneObject => sceneObject.userData.isSelected);
    
        if (this.hoverOutline)
            this.hoverOutline.selectedObjects = [object]
    }

    selectAll() {
        
    }

    deselectAll(outlinePass) {
        this.sceneManager.scene.children.forEach(sceneObject => sceneObject.userData.isSelected = false);
        outlinePass.selectedObjects = [];
    }
}