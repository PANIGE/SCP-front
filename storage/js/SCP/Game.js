import {GameBase} from "/storage/js/framework/GameBase.js";
import {SpriteText} from "/storage/js/framework/objects/graphic/spriteText.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { MapContainer } from "/storage/js/SCP/map/mapContainer.js";
import { Tile } from "/storage/js/SCP/map/Tile.js";
import { MapParser } from "/storage/js/scp/map/parser.js"
import { Context } from "/storage/js/SCP/Context.js";
import { Player } from "/storage/js/SCP/Entities/player.js";


export class Game extends GameBase {
    Context;
    FrameRate;
    FrameTimeSprite;

    Load(canvas) {
        this.FrameRate = new SpriteText(Vector2.Zero, new Vector2(100,20), -4, 0, "0Fps", "Arial", 1, Color.White)
        this.FrameTimeSprite = new SpriteText(new Vector2(0,20), new Vector2(100,20), -4, 0, "0ms", "Arial", 1, Color.White)
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
        this.Context.Player = new Player();
        this.SpriteManager.Add(this.Context.Player);
        this.SpriteManager.Add(cont);


        //Debug Purpose
        this.SpriteManager.Add(this.FrameRate);
        this.SpriteManager.Add(this.FrameTimeSprite);

    
    }


    HandleEvents() {
        this.FrameRate.Text = `FPS: ${Math.floor(1000/(Date.now() - this.LastFrame))}fps `;
        this.FrameTimeSprite.Text = `FrameTime: ${Math.floor((Date.now() - this.LastFrame))}ms `;
        let speed = ((Date.now() - this.LastFrame) / 16) * 5;
        this.LastFrame = Date.now();
        let keys = this.PressedKeys;

        if (this.NewPressedKeys.f) {
            this.Context.Player.FlashLight = !this.Context.Player.FlashLight;
        }

        if (keys.shift) {
            speed = speed*2;
        }
        
        if (keys.z) {
            this.Context.PlayerPosition.Y -= speed;
        }
        if (keys.s) {
            this.Context.PlayerPosition.Y += speed;
        }
        if (keys.q) {
            this.Context.PlayerPosition.X -= speed;
        }
        if (keys.d) {
            this.Context.PlayerPosition.X += speed;
        }
        super.HandleEvents();
    }


}

