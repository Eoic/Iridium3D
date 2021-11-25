import { Vector2 } from 'three';

export interface CustomMouseEvent {
    normalizedPosition: Vector2
}

export class EventPayload<OriginalEvent, CustomEvent> {
    private _originalData: OriginalEvent | undefined;
    private _customData: CustomEvent | undefined;
    
    public get originalData() {
        return this._originalData;
    }

    public get customData() {
        return this._customData;
    }

    public constructor(originalData?: OriginalEvent, customData?: CustomEvent) {
        this._originalData = originalData;
        this._customData = customData;
    }
}

export class Event {
    private _name!: string;
    private _callbacks!: Array<(event?: EventPayload<any, any>) => void>;

    public get name() {
        return this._name;
    }

    public get callbacks() {
        return this._callbacks;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set callbacks(value: Array<(event?: EventPayload<any, any>) => void>) {
        this._callbacks = value;
    }

    constructor(name: string) {
        this.name = name;
        this.callbacks = [];
    }

    /**
     * Adds new callback method to the callbacks list.
     * @param callback Callback method, called when this event is invoked.
     */
    public registerCallback<OriginalEvent, CustomEvent>(callback: (event?: EventPayload<OriginalEvent, CustomEvent>) => void) {
        this.callbacks.push(callback);
    }
}

export class EventManager {
    private static events = new Map<string, Event>();

    /**
     * Adds new event to the event manager. If event with the given name already
     * exists, new callback is added for the existing event object.
     * @param name      Event name.
     * @param callback  Event callback.
     */
    public static on<OriginalEvent, CustomEvent>(name: string, callback: (event?: EventPayload<OriginalEvent, CustomEvent>) => void) {
        if (this.events.has(name)) {
            const event = this.events.get(name);
            event?.registerCallback(callback);
            return;
        }

        const event = new Event(name);
        event.registerCallback(callback);
        this.events.set(name, event);
    }

    /**
     * Triggers event with the given name (if such exists).
     * @param name Event name.
     * @param eventData Event data.
     */
    public static dispatch<OriginalEvent, CustomEvent>(name: string, eventData?: EventPayload<OriginalEvent, CustomEvent>) {
        if (!this.events.has(name)) {
            console.error(`Cannot dispatch event "${name}" because it does not exist on this event listener.`);
            return;
        }

        this.events.get(name)?.callbacks.forEach((callback: (eventData?: EventPayload<OriginalEvent, CustomEvent>) => void) => {
            callback(eventData);
        });
    }
}