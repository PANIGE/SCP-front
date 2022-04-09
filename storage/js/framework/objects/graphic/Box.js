import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Drawable } from "/storage/js/framework/objects/graphic/drawable.js";

export class Box extends Drawable {

    Texture; // String to image



    constructor(Position, Size, Depth, Rotation, Alpha, Color) {
        super(Position, Size, Depth, Rotation, Alpha, Color);
    }

    Draw() {
        let element = super.Draw();
        if (element == null)
            return;
        element.style.backgroundColor = `rgb(${this.Color.R}, ${this.Color.G}, ${this.Color.B})`;
        return element;
        
    }
}