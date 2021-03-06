import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Drawable } from "/storage/js/framework/objects/graphic/drawable.js";

export class Sprite extends Drawable {

    Texture; // String to image



    constructor(Position, Size, Depth, Rotation, Texture, Alpha, Color) {
        super(Position, Size, Depth, Rotation, Alpha, Color);
        this.Texture = Texture;
    }

    Draw() {
        let element = super.Draw("img");
        if (element == null)
            return;
        element.style.imageRendering = "pixelated";
        element.setAttribute("src", this.Texture);
        return element;
        
    }
}