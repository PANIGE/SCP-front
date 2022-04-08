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
        let element = super.Draw();
        if (element == null)
            return;
        let img = document.createElement("img");
        for (let index = element.attributes.length - 1; index >= 0; --index) {
            img.attributes.setNamedItem(element.attributes[index].cloneNode());
        }
        img.style.imageRendering = "pixelated";
        img.setAttribute("src", this.Texture);
        if (element.parentNode != null)
            element.parentNode.replaceChild(img, element);
        return img;
        
    }
}