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
        let txt = super.Draw("p");
        if (txt == null)
            return;
        txt.style.fontFamily = this.Font;
        txt.innerHTML = this.Text;
        txt.style.fontSize = this.Size.Y * GameBase.Instance.GetRatioMultiplier();
        txt.style.color = `rgb(${this.Color.R}, ${this.Color.G}, ${this.Color.B})`;
        return txt;
        
    }
}