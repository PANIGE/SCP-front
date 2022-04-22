import { cursor } from "/storage/js/framework/objects/graphic/cursor.js";
import { Sprite } from "/storage/js/framework/objects/graphic/sprite.js";
import { Container } from "/storage/js/framework/objects/graphic/container.js";
import { Vector2, Color } from "/storage/js/framework/data.js";
import {SpriteManager} from "/storage/js/framework/objects/SpriteManager.js";
import {Scheduler} from "/storage/js/framework/objects/Scheduler.js"

export class GameBase {

    static Instance; //For Singleton
    SpriteManager;
    Scheduler;
    Canvas;
    Running;
    MousePos;
    PressedKeys;
    NewPressedKeys;
    cache;
    LastFrame;

    Running;

    constructor() {
        this.SpriteManager = new SpriteManager();
        this.Running = true;
        this.MousePos = new Vector2(0,0);
        this.Scheduler = new Scheduler();
        this.PressedKeys = {};
        this.NewPressedKeys = {};
        this.cache = {"img" : [], "col" : {}};
        this.LastFrame =  Date.now();
        this.FrameTime = 16;
    }

    GetRatioMultiplier() {
        let val = window.innerWidth / 1920 ;
        if (1080 * val > window.innerHeight) {
            val = window.innerHeight / 1080;
        }
        return val;
    }

    Cache(src) {
        //The cache is here to preload image and avoid browser to unlaod them
        var img=new Image();
        img.src=src;
        this.cache["img"].push(img);
    }

    Load(e) {
        GameBase.Instance = this;
        this.Canvas = e;
        
        this.Canvas.addEventListener('contextmenu', event => event.preventDefault());
        this.Canvas.addEventListener('mousemove', (e) => {
            var rect = this.Canvas.getBoundingClientRect();
            this.MousePos.X = Math.round((e.clientX - rect.left) * (1/this.GetRatioMultiplier()));
            this.MousePos.Y = Math.round((e.clientY - rect.top) * (1/this.GetRatioMultiplier()));
            this.SpriteManager.HandleHover()
        }, false);

        document.body.addEventListener('mousedown', () => this.SpriteManager.HandleClick(), true); 

        document.body.addEventListener('keydown', (event) => {
            this.PressedKeys[event.key.toLowerCase()] = true;
            this.NewPressedKeys[event.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (event) => {
            delete this.PressedKeys[event.key.toLowerCase()];
        });
        this.Running = setInterval(this.MainLoop, 0);
        
    }

    HandleEvents() {
        this.NewPressedKeys = {};
    }

    KillEngine() {
        clearInterval(this.Running);

    }

    RestartEngine() {
        /*
        this.KillEngine();
        this.SpriteManager = new SpriteManager();
        this.Running = true;
        this.MousePos = new Vector2(0,0);
        this.Scheduler = new Scheduler();
        this.PressedKeys = {};
        this.NewPressedKeys = {};
        this.cache = {"img" : [], "col" : {}};
        this.LastFrame =  Date.now();
        this.FrameTime = 16;

        this.Load(this.Canvas);
        */
       location.reload();
    }


    MainLoop() {
        GameBase.Instance.Canvas.style.height = 1080 * GameBase.Instance.GetRatioMultiplier() + "px";
        GameBase.Instance.Canvas.style.width = 1920 * GameBase.Instance.GetRatioMultiplier()+ "px";
        GameBase.Instance.HandleEvents();
        GameBase.Instance.Scheduler.Update();
        GameBase.Instance.SpriteManager.Update();
        
    }
}