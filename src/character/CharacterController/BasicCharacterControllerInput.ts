export default class BasicCharacterControllerInput {
  _keys: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
  };
  constructor() {
    this._Init();
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener("keydown", (e) => this._onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this._onKeyUp(e), false);
  }
  _onKeyDown(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this._keys.forward = true;
        break;
      case "KeyA":
        this._keys.left = true;
        break;
      case "KeyS":
        this._keys.backward = true;
        break;
      case "KeyD":
        this._keys.right = true;
        break;
      case "Space":
        this._keys.space = true;
        break;
      case "ShiftLeft":
        this._keys.shift = true;
        break;
    }
  }
  _onKeyUp(e: KeyboardEvent): any {
    switch (e.code) {
      case "KeyW":
        this._keys.forward = false;
        break;
      case "KeyA":
        this._keys.left = false;
        break;
      case "KeyS":
        this._keys.backward = false;
        break;
      case "KeyD":
        this._keys.right = false;
        break;
      case "Space":
        this._keys.space = false;
        break;
      case "ShiftLeft":
        this._keys.shift = false;
        break;
    }
  }
}
