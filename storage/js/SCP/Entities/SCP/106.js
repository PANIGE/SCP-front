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

   

    Bump;
    Spawn;
    Breathing;

    Laugh;


    Active;
    canMove;
    Speed;
    constructor() {
        
        let size = 90;
        super(Vector2.Zero,new Vector2(size, size), "/storage/img/scp/106.png");
        GameBase.Instance.Cache("/storage/img/scp/106.png");
        GameBase.Instance.Cache("/storage/img/scp/106Liquid.png");

        this.Bump = new Audio("/storage/sounds/SCP/106/bump.mp3");
        this.Spawn = new Audio("/storage/sounds/SCP/106/Emerge.mp3");
        this.Breathing = new Audio("/storage/sounds/SCP/106/Breathing.mp3");
        this.Laugh = new Audio("/storage/sounds/SCP/106/Laugh.mp3");

        this.Active = false;
        this.Speed = 1;

        this.Scheduler.AddDelayed(() => this.Appear(), 1500)
    }

    Appear() {
        this.Position = new Vector2(GameBase.Instance.Context.PlayerPosition.X, GameBase.Instance.Context.PlayerPosition.Y);
        this.Active = true;
    }


    Update() {
        this.Alpha = this.Active ? 1:0
        let vol = Math.abs((Math.min(1000, this.PlayerDist) - 1000)/1000)*0.5;
        if (isNaN(vol)) {
            vol = 0.5;
        }
        this.Breathing.volume = vol;
        this.Spawn.volume = vol;
        super.Update();


        if (this.Active) {
            let toGo = GameBase.Instance.Context.PlayerPosition;

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