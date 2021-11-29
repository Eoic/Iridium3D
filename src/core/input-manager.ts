import { CustomKeyboardEvent, Event, EventManager, EventPayload } from "./event-manager";
import { Events } from "./events";

export interface KeyState {
    isHeld: boolean;
    isPressed: boolean;
    isReleased: boolean;
}

export class InputManager {
    private static _instance: InputManager;
    private keyMap = new Map<string, string>();
    private keyStates = new Map<string, KeyState>();

    constructor() {
        window.addEventListener('keyup', (event) => this.setFromKeyCode(event, false, true));
        window.addEventListener('keydown', (event) => this.setFromKeyCode(event, true, false));
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    /**
     * Adds new key or key combination to process and assigns name to it if such is provided.
     * @param keyCode Code of the key.
     * @param name    Optional name assigned to the key. Used for setting custom key bindings.
     */
    public addKey(keyCode: string, name?: string) {
        if (!name) name = keyCode;
        this.keyMap.set(keyCode, name);

        if (this.keyStates.has(name))
            throw new Error('This key mapping is already defined.');

        this.keyStates.set(name, {
            isHeld: false,
            isPressed: false,
            isReleased: false,
        });
    }

    /**
     * Sets state of the given key referred to keyCode.
     * @param keyCode     Code of the key.
     * @param isPressed   Whether key is pressed.
     * @param isReleased  Whether key is released.
     */
    private setFromKeyCode(event: KeyboardEvent, isPressed: boolean, isReleased: boolean) {
        const keyName = this.keyMap.get(event.code);
        if (!keyName) return;
        this.setKey(event, keyName, isPressed, isReleased);
    }

    /**
     * Updates state of the given key.
     * @param keyName   Name assigned to the key.
     * @param isPressed Is key currently held down.
     */
    private setKey(event: KeyboardEvent,keyName: string, isPressed: boolean, isReleased: boolean) {
        const state = this.keyStates.get(keyName);

        if (state) {
            state.isPressed = isPressed && !state.isHeld;
            state.isHeld = isPressed;
            state.isReleased = isReleased && !state.isHeld;
            EventManager.dispatch(Events.Key, new EventPayload<KeyboardEvent, CustomKeyboardEvent>(event, { keyState: state }));
        }
    }

    /**
     * Resets state of the mapped keys.
     */
    public update() {
        for (const state of Object.values(this.keyStates)) {
            if (state.isPressed) state.isPressed = false;
            else if (state.isReleased) state.isReleased = false;
        }
    }

    /**
     * Checks and returns whether key of the given name is held down.
     * @param keyName Name of the key.
     * @returns       Whether key of the givent name is held down.
     */
    public getKey(keyName: string) {
        const state = this.keyStates.get(keyName);
        if (!state || !state.isHeld) return false;
        return state.isHeld;
    }

    /**
     * Checks and returns whether key of the given name was released and resets its state.
     * @param keyName Name of the key.
     * @returns       Whether key of the given name was relased.
     */
    public getKeyUp(keyName: string) {
        const state = this.keyStates.get(keyName);
        if (!state || !state.isReleased) return false;
        const currentState = state.isReleased;
        state.isReleased = false;
        return currentState;
    }

    /**
     * Checks and returns whether key of the given name was pressed and resets its state.
     * @param keyName Name of the key.
     * @returns       Whether key of the given name was pressed down.
     */
    public getKeyDown(keyName: string) {
        const state = this.keyStates.get(keyName);
        if (!state || !state.isPressed) return false;
        const currentState = state.isPressed;
        state.isPressed = false;
        return currentState;
    }
}