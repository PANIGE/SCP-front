import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Box} from "/storage/js/framework/objects/graphic/Box.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import {SpriteText} from "/storage/js/framework/objects/graphic/spriteText.js";


export class OverlayManager extends Container {
    
    FrameRate;
    FrameTimeSprite;
    PlayerPos;
    BlinkMeter;
    SprintMeter;

    FlashIcon;

    BlinkMask;

    InterractIcon;

    constructor() {
        super(Vector2.Zero, new Vector2(1920,1080), -4, 0, 1, Color.White);
    }

    Update() {
        let blink;
        if (GameBase.Instance.Context.BlinkTime<= 0 ){
            blink = 0;
            this.BlinkMask.Alpha = 1;
        }
        else {
            blink = GameBase.Instance.Context.BlinkTime;
            this.BlinkMask.Alpha = 0;
        }
        this.BlinkMeter.Size.X = (blink / 100) * 498;
        this.SprintMeter.Size.X = (GameBase.Instance.Context.Endurance / 100) * 498;
        this.PlayerPos.Text = `(${Math.floor(GameBase.Instance.Context.PlayerPosition.X)}, ${Math.floor(GameBase.Instance.Context.PlayerPosition.Y)})`
        this.FlashIcon.Alpha = GameBase.Instance.Context.Player.FlashLight ? 1:0;

        if (GameBase.Instance.Focused != undefined) {
            this.InterractIcon.Alpha = 1;
            this.InterractIcon.Position = new Vector2(
                (GameBase.Instance.Focused.EffectivePosition.X - (GameBase.Instance.Focused.Size.X/2) + 960) / 2,
                (GameBase.Instance.Focused.EffectivePosition.Y - (GameBase.Instance.Focused.Size.Y/2) + 540) / 2,
            );
            
        }
        else {
            this.InterractIcon.Alpha = 0;
        }
    }

    Load() {
        this.FrameRate = new SpriteText(Vector2.Zero, new Vector2(200,20), -4, 0, "0Fps", "Arial", 1, Color.White);
        this.FrameTimeSprite = new SpriteText(new Vector2(0,20), new Vector2(200,20), -4, 0, "0ms", "Arial", 1, Color.White);
        this.PlayerPos = new SpriteText(new Vector2(0,40), new Vector2(200,20), -4, 0, "(0,0)", "Arial", 1, Color.White);
        this.InterractIcon = new Sprite(new Vector2(10,890), new Vector2(60,60), 0,0,"/storage/img/HUD/interract.png",0, Color.White);
        this.Add(this.FrameRate);
        this.Add(this.FrameTimeSprite);
        this.Add(this.PlayerPos);
        this.Add(this.InterractIcon);

        this.FlashIcon = new Sprite(new Vector2(10,890), new Vector2(40,40), 0,0,"/storage/img/HUD/FlashIcon.png",0, Color.White);
        this.Add(this.FlashIcon)

        this.Add(new Sprite(new Vector2(10,950), new Vector2(40,40), 0,0,"/storage/img/HUD/BlinkIcon.png",1, Color.White))
        this.Add(new Box(new Vector2(60,950), new Vector2(500,40), 0, 0, 1, new Color(100,100,100)));
        this.Add(new Box(new Vector2(61,951), new Vector2(498,38), -0.5, 0, 1, new Color(50,50,50)));

        this.Add(new Sprite(new Vector2(10,1010), new Vector2(40,40), 0,0,"/storage/img/HUD/SprintIcon.png",1, Color.White))
        this.Add(new Box(new Vector2(60,1010), new Vector2(500,40), 0, 0, 1, new Color(100,100,100)));
        this.Add(new Box(new Vector2(61,1011), new Vector2(498,38), -0.5, 0, 1, new Color(50,50,50)));

        this.BlinkMeter = new Box(new Vector2(61,951), new Vector2(498,38), -0.5, 0, 0.7, Color.White);
        this.SprintMeter = new Box(new Vector2(61,1011), new Vector2(498,38), -0.5, 0, 0.7, Color.White);
        this.BlinkMask = new Box(Vector2.Zero, new Vector2(1920,1080), 1, 0, 0, new Color(0,0,0))
        this.Add(this.BlinkMeter);
        this.Add(this.SprintMeter);
        this.Add(this.BlinkMask);
    }

}