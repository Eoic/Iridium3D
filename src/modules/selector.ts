import { Module } from './module';
import { OutlinePassOrder, SceneManager } from '../core/scene-manager';
import { CustomKeyboardEvent, CustomMouseEvent, EventManager, EventPayload } from '../core/event-manager';
import { Events } from '../core/events'

export class Selector extends Module {
    private cameraMoved: boolean;
    private mouseReleased: boolean;
    private multiSelect: boolean;

    public constructor(sceneManager: SceneManager) {
        super(sceneManager);
        this.cameraMoved = false;
        this.mouseReleased = true;
        this.multiSelect = false;
        this.addEvents();
    }

    addEvents() {
        EventManager.on(Events.Key, (event: EventPayload<KeyboardEvent, CustomKeyboardEvent>) => {
            if (event.originalData.code == 'ControlLeft')
                if (event.customData.keyState.isPressed)
                    this.multiSelect = true;
                else if (event.customData.keyState.isReleased)
                    this.multiSelect = false;
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
            this.sceneManager.updateOutlinePass(OutlinePassOrder.First, (outlinePass) => {
                if (event.customData.intersection && !event.customData.intersection.object.userData.isSelected)
                    outlinePass.selectedObjects = [event.customData.intersection.object];
                else outlinePass.selectedObjects = [];

                if (this.mouseReleased)
                    this.cameraMoved = false;
            });
        });

        EventManager.on(Events.MouseClick, (event: EventPayload<MouseEvent, CustomMouseEvent>) => {
            this.sceneManager.updateOutlinePass(OutlinePassOrder.Second, (outlinePass) => {
                if (event.customData.intersection && !this.cameraMoved && this.mouseReleased) {
                    const object = event.customData.intersection?.object;

                    if (!this.multiSelect)
                        this.sceneManager.scene.children.forEach(sceneObject => sceneObject.userData.isSelected = false)

                    object.userData.isSelected = true;

                    outlinePass.selectedObjects = this.sceneManager.scene.children.filter(sceneObject => sceneObject.userData.isSelected);
                    this.cameraMoved = false;

                    this.sceneManager.updateOutlinePass(OutlinePassOrder.First, (outlinePass) => {
                        outlinePass.selectedObjects = outlinePass.selectedObjects.filter(selectedObject => selectedObject.id !== object.id);
                    });

                    return;
                }
    
                if (!this.cameraMoved) {
                    this.sceneManager.scene.children.forEach(sceneObject => sceneObject.userData.isSelected = false);
                    outlinePass.selectedObjects = [];
                }
    
                this.cameraMoved = false;
            });
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