import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";


export class Tile extends Sprite {
    constructor(Texture) {
        super(Vector2.Zero, Vector2.Zero, 5, 0,Texture, 1, Color.White);
    }
}