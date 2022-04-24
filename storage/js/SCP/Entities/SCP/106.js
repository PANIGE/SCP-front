 import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { SCPBase }from "/storage/js/SCP/Entities/SCP/base.js"

function find_angle(p0,p1,c) {
    //https://stackoverflow.com/questions/1211212/how-to-calculate-an-angle-from-three-points
    var p0c = Math.sqrt(Math.pow(c.X-p0.X,2)+
                        Math.pow(c.Y-p0.Y,2)); // p0->c (b)   
    var p1c = Math.sqrt(Math.pow(c.X-p1.X,2)+
                        Math.pow(c.Y-p1.Y,2)); // p1->c (a)
    var p0p1 = Math.sqrt(Math.pow(p1.X-p0.X,2)+
                         Math.pow(p1.Y-p0.Y,2)); // p0->p1 (c)         
    return (Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c))* (180 / Math.PI));
}

export class SCP106 extends SCPBase
{

   

    StepIn;

    Bump;
    Spawn;
    Breathing;



    Active;
    canMove;
    Speed;

    LastFrame;
    Killed;
    constructor() {
        
        let size = 90;
        super(Vector2.Zero,new Vector2(size, size), "/storage/img/scp/106.png");
        GameBase.Instance.Cache("/storage/img/scp/106.png");
        GameBase.Instance.Cache("/storage/img/scp/106Liquid.png");

        this.Bump = new Audio("/storage/sounds/SCP/106/bump.mp3");
        this.Bump.loop = true;

        this.Spawn = new Audio("/storage/sounds/SCP/106/Emerge.mp3");
        this.Breathing = new Audio("/storage/sounds/SCP/106/Breathing.mp3");
        this.Breathing.loop = true;

        this.Active = false;
        this.Speed = 0.5;
        this.StepIn = 0;

        this.Scheduler.AddDelayed(() => this.Appear(), 180000);
        this.LastFrame = 0;
        this.Killed = false;
    }

    Appear() {
        this.Position = new Vector2(GameBase.Instance.Context.PlayerPosition.X-45, GameBase.Instance.Context.PlayerPosition.Y-45);
        this.FadeInFromZero(10000);


        let SpawnPortal = new Sprite(Vector2.Zero, Vector2.Zero, -0.5, 0, "/storage/img/scp/106Liquid.png", 1, Color.White);
        SpawnPortal.Position = new Vector2(GameBase.Instance.Context.PlayerPosition.X, GameBase.Instance.Context.PlayerPosition.Y);
        SpawnPortal.SizeTo(new Vector2(300,300), 8000);
        SpawnPortal.FadeInFromZero(8000);
        SpawnPortal.MoveTo(new Vector2(GameBase.Instance.Context.PlayerPosition.X-150, GameBase.Instance.Context.PlayerPosition.Y-150), 8000);
        this.Spawn.play();
        this.Breathing.play();

        this.Parent.Add(SpawnPortal);

        this.Scheduler.AddDelayed(() => {
            this.Bump.play();
            this.Active = true;

            this.Scheduler.AddDelayed(() => {
                this.Active = false;
                this.Breathing.pause();
                this.Bump.pause();
                this.FadeOutFromOne(8000);

                let SpawnPortal = new Sprite(Vector2.Zero, Vector2.Zero, -0.5, 0, "/storage/img/scp/106Liquid.png", 1, Color.White);
                SpawnPortal.Position = new Vector2(this.CenterPosition.X, this.CenterPosition.Y);
                SpawnPortal.SizeTo(new Vector2(300,300), 8000);
                SpawnPortal.FadeInFromZero(8000);
                SpawnPortal.MoveTo(new Vector2(this.CenterPosition.X-150, this.CenterPosition.Y-150), 8000);
                this.Parent.Add(SpawnPortal);
                this.Spawn.play();

                this.Scheduler.AddDelayed(() => this.Appear(), 120000 + Math.random()*60000);
            }, 30000)

        }, 8000);
        

    }


    Update() {
        let FrameTime = Math.floor((Date.now() - this.LastFrame));
        this.LastFrame = Date.now();
        this.Speed = (FrameTime / 4) * 0.7;
        
        let vol = Math.abs((Math.min(1000, this.PlayerDist) - 1000)/1000)*0.5;
        if (isNaN(vol)) {
            vol = 0.5;
        }
        this.Breathing.volume = vol;
        this.Spawn.volume = vol;
        this.Alpha = ((this.IsInSight || this.PlayerDist<120) && this.HasInSight && this.Active) ? 1 : 0;


        if (this.Active) {
            let toGo = GameBase.Instance.Context.PlayerPosition;

            if (this.StepIn < Date.now()) {
                this.StepIn = Date.now() + 500;
                let SpawnPortal = new Sprite(Vector2.Zero, Vector2.Zero, -0.5, 0, "/storage/img/scp/106Liquid.png", 1, Color.White);
                SpawnPortal.Position = new Vector2(this.CenterPosition.X, this.CenterPosition.Y);
                SpawnPortal.Rotation = Math.random()*360;
                SpawnPortal.SizeTo(new Vector2(100,100), 2000);
                SpawnPortal.FadeInFromZero(2000);
                let t =  new Audio("/storage/sounds/SCP/106/step.ogg")
                t.volume = vol;
                t.play();
                SpawnPortal.MoveTo(new Vector2(this.CenterPosition.X-50, this.CenterPosition.Y-50), 2000);
                this.Parent.Add(SpawnPortal);
            }

            if (this.PlayerDist < 50 && !this.Killed && !GameBase.Instance.GodMode) {
                this.Killed = true;
                new Audio("/storage/sounds/SCP/106/laugh.mp3").play();
                this.position = Vector2.Zero;
                GameBase.Instance.Kill("Cause of Death: Body partially decomposed by what is assumed to be SCP-106's \"corrosion\" effect. Body disposed of via incineration.", "As a reminder to all MTF units, when SCP-106 appears, you must flee the entity as fast as you can. one contact is enough for him to terminate you.");
                this.Bump.pause();
                this.Breathing.pause();
                this.Active = false;
            }

            let a = find_angle(new Vector2(this.Position.X, this.Position.Y+50), toGo, this.Position)
            if (this.Position.X < toGo.X) {
                a = 360 - a;
            }
            this.Rotation = a;

            let dif = new Vector2(toGo.X - this.Position.X - 45, toGo.Y - this.Position.Y - 45)
            

            let move = new Vector2(0,0)
            if (dif.X < 0) {
                move.X = 0-this.Speed
            }            
            else {
                move.X = this.Speed
            }
            if (dif.Y < 0) {
                move.Y = 0-this.Speed
            }            
            else {
                move.Y = this.Speed
            }

            this.Position.X += move.X;
            this.Position.Y += move.Y;

        }

    }

    
    
}