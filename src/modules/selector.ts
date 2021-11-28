import { Module } from './module';
import { Events } from '../core/events';
import { OutlinePassOrder, SceneManager } from '../core/scene-manager';
import { CustomMouseEvent, EventManager, EventPayload } from '../core/event-manager';

export class Selector extends Module {
    private cameraMoved: boolean;
    private mouseReleased: boolean;

    public constructor(sceneManager: SceneManager) {
        super(sceneManager);
        this.cameraMoved = false;
        this.mouseReleased = true;
        this.addEvents();
    }

    addEvents() {
        EventManager.on(Events.CameraMove, () => {
            this.cameraMoved = true;
            this.mouseReleased = false;
        });

        EventManager.on(Events.MouseUp, () => {
            this.mouseReleased = true;
        });

        EventManager.on(Events.MouseMove, (event: EventPayload<MouseEvent, CustomMouseEvent>) => {
            this.sceneManager.updateOutlinePass(OutlinePassOrder.First, (outlinePass) => {
                if (event.customData.intersection)
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
                    object.userData.isSelected = !object.userData.isSelected;
                    outlinePass.selectedObjects = this.sceneManager.scene.children.filter(sceneObject => sceneObject.userData.isSelected);
                    this.cameraMoved = false;
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