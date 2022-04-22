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
import { SCP096 } from "/storage/js/SCP/Entities/SCP/096.js";
import { SCP106 } from "/storage/js/SCP/Entities/SCP/106.js";
import { OverlayManager } from "/storage/js/SCP/Overlays/OverlayManager.js";
import { MKeyCard1 } from "/storage/js/SCP/Objects/KeyCards/Key1.js";
import { MKeyCard2 } from "/storage/js/SCP/Objects/KeyCards/Key2.js";
import { MKeyCard3 } from "/storage/js/SCP/Objects/KeyCards/Key3.js";
import { MKeyCard4 } from "/storage/js/SCP/Objects/KeyCards/Key4.js";
import { MKeyCard5 } from "/storage/js/SCP/Objects/KeyCards/Key5.js";
import { MDocument3809 } from "/storage/js/SCP/Objects/Documents/3809.js";
import { MDocument173 } from "/storage/js/SCP/Objects/Documents/173.js";
import { MDocument106 } from "/storage/js/SCP/Objects/Documents/106.js";
import { MDocument096 } from "/storage/js/SCP/Objects/Documents/096.js";
import { MDocumentNuke } from "/storage/js/SCP/Objects/Documents/Nuke.js";
import { MDocumentOBJC } from "/storage/js/SCP/Objects/Documents/OBJC.js";

import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";


export class Game extends GameBase {
    Context;
    Overlays;
    Map;

    Focused;

    CanMove;

    SCP173;
    SCP096;
    SCP106;

    Dead;

    LastFootStem;


    GodMode;

    Load(canvas) {
        this.Dead = false;
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

        this.SCP173 = new SCP173(new Vector2(1500,3500));
        this.SCP096 = new SCP096(new Vector2(1500,14500));
        this.SCP106 = new SCP106();
        this.Map.Add(this.SCP096);
        this.Map.Add(this.SCP173);
        this.Map.Add(this.SCP106);
        this.CanMove = true;

        let key1 = new MKeyCard1();
        key1.Rotation = Math.random()*360;
        key1.Position = new Vector2(1123, 3373);
        this.Map.Add(key1)

        let key2 = new MKeyCard2();
        key2.Rotation = Math.random()*360;
        key2.Position = new Vector2(9626,2624);
        this.Map.Add(key2)
        
        let key3 = new MKeyCard3();
        key3.Rotation = Math.random()*360;
        key3.Position = new Vector2(13495, 11123);
        this.Map.Add(key3)

        let key4 = new MKeyCard4();
        key4.Rotation = Math.random()*360;
        key4.Position = new Vector2(1710, 14373);
        this.Map.Add(key4)

        let key5 = new MKeyCard5();
        key5.Rotation = Math.random()*360;
        key5.Position = new Vector2(1471, 29124);
        this.Map.Add(key5);

        let doc3809 = new MDocument3809();
        doc3809.Rotation = Math.random()*360;
        doc3809.Position = new Vector2(4331, 751);
        this.Map.Add(doc3809);

        let doc106 = new MDocument106();
        doc106.Rotation = Math.random()*360;
        doc106.Position = new Vector2(1375, 3778);
        this.Map.Add(doc106);

        let doc096 = new MDocument096();
        doc096.Rotation = Math.random()*360;
        doc096.Position = new Vector2(9339, 2866);
        this.Map.Add(doc096);

        let doc173 = new MDocument173();
        doc173.Rotation = Math.random()*360;
        doc173.Position = new Vector2(4725, 688);
        this.Map.Add(doc173);

        let docOBJC = new MDocumentOBJC();
        docOBJC.Rotation = Math.random()*360;
        docOBJC.Position = new Vector2(9349, 2670);
        this.Map.Add(docOBJC);


        this.Start();

    }

    Kill(reason, toAvoid) {
        if (this.Dead)
            return;
        this.Dead = true;
        this.CanMove = false;
        this.Scheduler.Clear();

        this.SpriteManager.Add(new Box(new Vector2(0,0), new Vector2(1920,1080), -4, 0,1, new Color(0,0,0)));
        this.SpriteManager.Add(new Sprite(new Vector2(660,240), new Vector2(600,600), -5, 0, "/storage/img/deathScreen.jpg", 1, Color.White));
        this.SpriteManager.Add(new SpriteText(new Vector2(775, 340), new Vector2(470, 20), -6, 0, "The subject got out of an instance of SCP-3809-1, but don't seems to have any influance of the entity, we suppose it didn't had any contect with any candy inside of it\
        <br />" + reason + "<br /><br /> <span style=\"background-color: yellow;color:black;\">"+toAvoid+"</span>", "arial", 1, Color.White));

        let restart = new SpriteText(new Vector2(775, 600), new Vector2(470, 100), -6, 0, "Restart", "arial", 1, Color.White);
        restart.Centered = true;
        restart.OnHover = () => {
            restart.Color = new Color(255,255,0)
            return true;
        }

        restart.OnHoverLost = () => {
            restart.Color = new Color(255,255,255)
            return true;
        }

        restart.OnClick = () => {
            this.RestartEngine();
            return true;
        }
        this.SpriteManager.Add(restart);
    }
    

    Start() {
        this.Scheduler.AddDelayed(() => {
            let bg = new Audio("/storage/sounds/music/BackgroundLoop.ogg");
            bg.loop = true;
            bg.volume = 0.4;
            bg.play();
    
            let intro = new Audio("/storage/sounds/Story/intro.mp3");
            intro.play();
    
            GameBase.Instance.Overlays.ShowMessage("Where the f*ck am i ?! SISTER ! I'M COMING !!!! WHERE ARE YOU !<br><br><b>Z,Q,S,D</b> to move<br><b>F</b> for flashlight<br><b>E</b> to interract<br><b>Space</b> to blink");
        }, 1000);

    }
    


    HandleEvents() {
        let FrameTime = Math.floor((Date.now() - this.LastFrame));
        this.Overlays.FrameRate.Text = `FPS: ${Math.floor(1000/(Date.now() - this.LastFrame))}fps `;
        this.Overlays.FrameTimeSprite.Text = `FrameTime: ${FrameTime}ms `;
        let speed = ((Date.now() - this.LastFrame) / 16) * 5;
        this.LastFrame = Date.now();

        if (this.NewPressedKeys.g) {
            this.GodMode = !this.GodMode;
            this.Overlays.ShowMessage("Godmode is set to : "+this.GodMode)
        }
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
            if (keys.shift && (keys.z || keys.s || keys.q || keys.d)) {
                if (this.Context.Endurance > 0 || this.GodMode) {
                    speed = speed*2;
                    this.Context.Endurance -= (FrameTime) / 30;
                    if (this.Context.Endurance < 0) {
                        this.Context.Endurance = 0;
                    }
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

