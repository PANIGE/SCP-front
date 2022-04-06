import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Drawable } from "/storage/js/framework/objects/graphic/drawable.js";

export class Sprite extends Drawable {

    Texture; // String to image

    get EffectivePosition() {
        if (this.Parent == null) {
            return this.Position;
        }
        return new Vector2(this.Parent.EffectivePosition.X + this.Position.X, 
            this.Parent.EffectivePosition.Y + this.Position.Y)
    }

    constructor(Position, Size, Depth, Rotation, Texture, Alpha, Color) {
        super(Position, Size, Depth, Rotation, Alpha, Color);
        this.Texture = Texture;
    }

    Draw() {
        let element = super.Draw();
        let img = document.createElement("img");
        for (let index = element.attributes.length - 1; index >= 0; --index) {
            img.attributes.setNamedItem(element.attributes[index].cloneNode());
        }
        img.setAttribute("src", this.Texture);
        element.parentNode.replaceChild(img, element);
        
    }
}