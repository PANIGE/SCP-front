import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Drawable } from "/storage/js/framework/objects/graphic/drawable.js";

export class SpriteText extends Drawable {

    Text;
    Font;


    constructor(Position, Size, Depth, Rotation, Text, Font, Alpha, Color) {
        super(Position, Size, Depth, Rotation, Alpha, Color);
        this.Texture = Text;
        this.Font = Font;
    }

    Draw() {
        let element = super.Draw();
        if (element == null)
            return;
        let txt = document.createElement("p");
        for (let index = element.attributes.length - 1; index >= 0; --index) {
            txt.attributes.setNamedItem(element.attributes[index].cloneNode());
        }
        txt.style.fontFamily = this.Font;
        txt.innerHTML = this.Text;
        txt.style.fontSize = this.Size.Y;
        txt.style.color = `rgb(${this.Color.R}, ${this.Color.G}, ${this.Color.B})`;
        
        if (element.parentNode != null)
            element.parentNode.replaceChild(txt, element);
        return txt;
        
    }
}