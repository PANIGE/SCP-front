import { cursor } from "/storage/js/framework/objects/graphic/cursor.js";
import { Sprite } from "/storage/js/framework/objects/graphic/sprite.js";
import { Vector2, Color } from "/storage/js/framework/data.js";
import {SpriteManager} from "/storage/js/framework/objects/SpriteManager.js";

export class GameBase {

    static Instance; //For Singleton
    SpriteManager;
    Scheduler;
    Context;
    Canvas;
    Running;
    MousePos;

    constructor() {
        this.SpriteManager = new SpriteManager();
        this.Running = true;
        this.MousePos = new Vector2(0,0);
    }

    GetRatioMultiplier() {
        let val = window.innerWidth / 1920 ;
        if (1080 * val > window.innerHeight) {
            val = window.innerHeight / 1080;
        }
        return val;
    }

    Load(e) {
        GameBase.Instance = this;
        this.Canvas = e;
        console.log(this.GetRatioMultiplier());

        setInterval(this.MainLoop, 16);
        
        this.Canvas.addEventListener('mousemove', (e) => {
            var rect = this.Canvas.getBoundingClientRect();
            this.MousePos.X = Math.round((e.clientX - rect.left) * (1/this.GetRatioMultiplier()));
            this.MousePos.Y = Math.round((e.clientY - rect.top) * (1/this.GetRatioMultiplier()));
            this.SpriteManager.HandleHover()
        }, false);

        document.body.addEventListener('mousedown', () => this.SpriteManager.HandleClick(), true); 

        let sprite = new cursor("cursor.png");
        let sp2 = new Sprite(new Vector2(0,0), new Vector2(500,500), 0, 0, "https://gateway.deltada.sh/bm/beatmapset/3/thumb", 0.5, new Color(255,255,255) );
        //sp2.MoveTo(new Vector2(500,500), 3000);
        //sp2.RotateTo(180, 5000);
        sp2.OnHover = () => {
            sp2.SizeTo(new Vector2(600, 600), 100);
        }
        sp2.OnHoverLost = () => {
            sp2.SizeTo(new Vector2(500, 500), 100)
        }
        this.SpriteManager.Add(sprite);
        this.SpriteManager.Add(sp2);
    }

    MainLoop() {
        GameBase.Instance.Canvas.style.height = 1080 * GameBase.Instance.GetRatioMultiplier() + "px";
        GameBase.Instance.Canvas.style.width = 1920 * GameBase.Instance.GetRatioMultiplier()+ "px";

        GameBase.Instance.SpriteManager.Update();

    }
}