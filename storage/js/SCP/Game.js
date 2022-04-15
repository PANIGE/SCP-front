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
import { SCP173 } from "/storage/js/SCP/Entities/SCP/173.js";
import { OverlayManager } from "/storage/js/SCP/Overlays/OverlayManager.js";
import { MKeyCard1 } from "/storage/js/SCP/Objects/KeyCards/Key1.js";
import { MKeyCard2 } from "/storage/js/SCP/Objects/KeyCards/Key2.js";
import { MKeyCard3 } from "/storage/js/SCP/Objects/KeyCards/Key3.js";
import { MKeyCard4 } from "/storage/js/SCP/Objects/KeyCards/Key4.js";
import { MKeyCard5 } from "/storage/js/SCP/Objects/KeyCards/Key5.js";


export class Game extends GameBase {
    Context;
    Overlays;
    Map;

    Focused;

    CanMove;

    Load(canvas) {
        this.Focused = undefined;
        super.Load(canvas);
        
        this.Context = new Context();

        let sprite = new cursor("cursor.png");
        this.SpriteManager.Add(sprite);


        this.Map = new MapContainer();
        
        let raw;
        fetch('/storage/scp.map').then(response => response.text()).then(text => {
            raw = text;
            MapParser(this.Map, raw)
        });
        this.Context.Player = new Player();
        this.SpriteManager.Add(this.Context.Player);
        this.SpriteManager.Add(this.Map);

        this.Overlays = new OverlayManager();
        this.SpriteManager.Add(this.Overlays);

        this.Map.Add(new SCP173(new Vector2(4440,8500)));
        this.CanMove = true;

        let key1 = new MKeyCard1();
        key1.Position = new Vector2(2755, 2497)
        this.Map.Add(key1)

        let key2 = new MKeyCard2();
        key2.Position = new Vector2(2755, 2497)
        this.Map.Add(key2)
        
        let key3 = new MKeyCard3();
        key3.Position = new Vector2(2755, 2497)
        this.Map.Add(key3)

        let key4 = new MKeyCard4();
        key4.Position = new Vector2(2755, 2497)
        this.Map.Add(key4)

        let key5 = new MKeyCard5();
        key5.Position = new Vector2(2755, 2497)
        this.Map.Add(key5)
    
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
        if (this.NewPressedKeys.e && this.Focused != undefined) {
            this.Focused.Interract();
            this.Focused = undefined;
        }

        if (keys[" "]) {
            this.Context.BlinkTime = 0;
        }
        else {
            this.Context.BlinkTime -= (FrameTime) / 60;
            if (this.Context.BlinkTime < -2) {
                this.Context.BlinkTime = 100
            } 
        }

        if (this.CanMove) {
            if (keys.shift&& (keys.z || keys.s || keys.q || keys.d)) {
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
                if (!this.Map.Collide(this.Context.PlayerPosition,0-speed, true)) {
                    this.Context.PlayerPosition.Y -= speed;
                }
                
            }
            if (keys.s) {
                if (!this.Map.Collide(this.Context.PlayerPosition, speed, true)) {
                    this.Context.PlayerPosition.Y += speed;
                }
            }
            if (keys.q) {
                if (!this.Map.Collide(this.Context.PlayerPosition,0-speed, false)) {
                    this.Context.PlayerPosition.X -= speed;
                }
            }
            if (keys.d) {
                if (!this.Map.Collide(this.Context.PlayerPosition,speed, false)) {
                    this.Context.PlayerPosition.X += speed;
                }
            }
        }


        super.HandleEvents();
    }

    MainLoop() {
        
        super.MainLoop();
        
    }

}

