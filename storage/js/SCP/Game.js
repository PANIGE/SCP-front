import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { MapContainer } from "/storage/js/SCP/map/mapContainer.js";
import { Tile } from "/storage/js/SCP/map/Tile.js";
import { Context } from "/storage/js/SCP/Context.js";

export class Game extends GameBase {
    Context;

    Load(canvas) {
        super.Load(canvas);
        this.Context = new Context();

        let sprite = new cursor("cursor.png");
        this.SpriteManager.Add(sprite);


        let cont = new MapContainer();
        
        for (let x = 0; x < 2000; x++) { 
            for (let y = 1; y < 150; y++) { 
                if (Math.floor(Math.random() * 50) == 1) {
                    cont.AddTile(new Tile("/storage/img/TileFloor1-1.png"), new Vector2(x, y));
                }
                else {
                    cont.AddTile(new Tile("/storage/img/TileFloor1.png"), new Vector2(x, y))
                }
                
            }
        }

        for (let x = 0; x < 9; x++) { 
            for (let y = 0; y < 1; y++) { 
                if (Math.floor(Math.random() * 10) == 1) {
                    cont.AddTile(new Tile("/storage/img/TileWall1-1.png"), new Vector2(x, y))
                }
                else {
                    cont.AddTile(new Tile("/storage/img/TileWall1.png"), new Vector2(x, y))
                }
                
            }
        }

        for (let x = 9; x < 20; x++) { 
            for (let y = 0; y < 1; y++) { 
                if (Math.floor(Math.random() * 10) == 1) {
                    cont.AddTile(new Tile("/storage/img/TileWall2-1.png"), new Vector2(x, y))
                }
                else {
                    cont.AddTile(new Tile("/storage/img/TileWall2.png"), new Vector2(x, y))
                }
            }
        }
        
        cont.MoveTo(new Vector2(-5000, -5000), 15000)

        this.SpriteManager.Add(cont);
    
    }


    HandleEvents() {

    }

    MainLoop() {

        super.MainLoop();
    }
}

