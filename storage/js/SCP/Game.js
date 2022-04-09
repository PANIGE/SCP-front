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
import { OverlayManager } from "/storage/js/SCP/Overlays/OverlayManager.js";


export class Game extends GameBase {
    Context;
    Overlays;

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
        this.Context.Player = new Player();
        this.SpriteManager.Add(this.Context.Player);
        this.SpriteManager.Add(cont);

        this.Overlays = new OverlayManager();
        this.SpriteManager.Add(this.Overlays);
    
    }


    HandleEvents() {
        let FrameTime = Math.floor((Date.now() - this.LastFrame));
        this.Overlays.FrameRate.Text = `FPS: ${Math.floor(1000/(Date.now() - this.LastFrame))}fps `;
        this.Overlays.FrameTimeSprite.Text = `FrameTime: ${FrameTime}ms `;
        let speed = ((Date.now() - this.LastFrame) / 16) * 5;
        this.LastFrame = Date.now();
        let keys = this.PressedKeys;
        if (this.NewPressedKeys.f) {
            this.Context.Player.FlashLight = !this.Context.Player.FlashLight;
        }
        
        if (keys[" "]) {
            this.Context.BlinkTime = -2;
        }
        else {
            this.Context.BlinkTime -= (FrameTime) / 60;
            if (this.Context.BlinkTime < -2) {
                this.Context.BlinkTime = 100
            } 
        }


        if (keys.shift) {
            if (this.Context.Endurance > 0) {
                speed = speed*2;
                this.Context.Endurance -= (FrameTime) / 30;
            }
            
        }
        else {
            if (this.Context.Endurance <= 100)
                this.Context.Endurance += (FrameTime) / 90;
            
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

