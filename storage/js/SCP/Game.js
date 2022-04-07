import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { MapContainer } from "/storage/js/SCP/map/mapContainer.js";
import { Tile } from "/storage/js/SCP/map/Tile.js";
import { MapParser } from "/storage/js/scp/map/parser.js"
import { Context } from "/storage/js/SCP/Context.js";


export class Game extends GameBase {
    Context;

    Load(canvas) {
        super.Load(canvas);
        this.Context = new Context();

        let sprite = new cursor("cursor.png");
        this.SpriteManager.Add(sprite);


        let cont = new MapContainer();
        
        let raw;
        fetch('/storage/scp.map').then(response => response.text()).then(text => {
            raw = text;
            MapParser(cont, raw)
        });
        

        this.SpriteManager.Add(cont);
    
    }


    HandleEvents() {

    }

    MainLoop() {

        super.MainLoop();
    }
}

