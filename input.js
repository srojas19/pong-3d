export default class Key {
  constructor() {
    this.pressed = {};
    this.LEFT = 37;
    this.UP = 38;
    this.RIGHT = 39;
    this.DOWN = 40;
    this.W = 87;
    this.A = 65;
    this.S = 83;
    this.D = 68;
  }

  isDown(keyCode) {
    return this.pressed[keyCode];
  }
  
  onKeydown(event) {
    this.pressed[event.keyCode] = true;
  }

  onKeyup(event) {
    delete this.pressed[event.keyCode];
  }
}
