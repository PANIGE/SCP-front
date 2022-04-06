import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {Vector2, Color} from "/storage/js/framework/data.js";

var gameBase = new GameBase();

window.onload = () => {
    let Canvas = document.getElementById("GameWindow");
    gameBase.Load(Canvas);
}

