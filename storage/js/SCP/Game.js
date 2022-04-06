import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";

export class Game extends GameBase {
    Load(canvas) {
        super.Load(canvas);


        let sprite = new cursor("cursor.png");
        this.SpriteManager.Add(sprite);

        let sp1 = new Sprite(new Vector2(0,0), new Vector2(500,500), 0, 0, "https://cdn.discordapp.com/attachments/632906378423566346/929132515342581800/pdp46.png", 1, new Color(255,255,255) );
        let sp2 = new Sprite(new Vector2(500,0), new Vector2(500,500), 0, 0, "https://cdn.discordapp.com/attachments/632906378423566346/942024438927470622/unknown.png", 1, new Color(255,255,255) );
        let cont = new Container(new Vector2(200,150), new Vector2(1000,500), 0,0, Color.White);
        cont.Add(sp1);
        cont.Add(sp2);
        this.SpriteManager.Add(cont);
    }
}

