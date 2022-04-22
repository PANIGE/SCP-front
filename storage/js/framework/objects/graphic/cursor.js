import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Sprite } from "/storage/js/framework/objects/graphic/sprite.js";

export class cursor extends Sprite {


    constructor(Texture) {
        super(new Vector2(0,0), new Vector2(50,50), -10, 0, Texture, 1, new Color(255,255,255))
  
    }

    OnClick() {
        return false;
    }

    Update() {
        //console.log(GameBase.Instance.MousePos)
        this.Position = new Vector2(GameBase.Instance.MousePos.X - this.Size.X/2,GameBase.Instance.MousePos.Y - this.Size.Y/2) ;
    }

    
}