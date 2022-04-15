import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Drawable } from "/storage/js/framework/objects/graphic/drawable.js";

export class SpriteText extends Drawable {

    Text;
    Font;

    Centered;

    constructor(Position, Size, Depth, Rotation, Text, Font, Alpha, Color) {
        super(Position, Size, Depth, Rotation, Alpha, Color);
        this.Text = Text;
        this.Font = Font;
        this.Centered = false;
    }

    Draw() {
        let txt = super.Draw("p");
        if (txt == null)
            return;
        txt.style.fontFamily = this.Font;
        txt.innerHTML = this.Text;
        txt.style.fontSize = this.Size.Y * GameBase.Instance.GetRatioMultiplier() + "px";
        txt.style.color = `rgb(${this.Color.R}, ${this.Color.G}, ${this.Color.B})`;
        if (this.Centered) {
            txt.style.textAlign = "center";
        }
        return txt;
        
    }
}