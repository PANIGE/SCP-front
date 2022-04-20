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

//https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
function sign (p1, p2, p3)
{
    return (p1.X - p3.X) * (p2.Y - p3.Y) - (p2.X - p3.X) * (p1.Y - p3.Y);
}

function PointInTriangle (pt, v1, v2, v3)
{


    let d1 = sign(pt, v1, v2);
    let d2 = sign(pt, v2, v3);
    let d3 = sign(pt, v3, v1);

    let has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    let has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}

export class SCP096 extends SCPBase
{


    IdleSound;
    Angering;
    ChaseMusic;
    Scream;
    Triggered;

    Active;

    Chase;

    Speed;

    UpdateIn;

    Path;
   
    constructor(position) {
        
        let size = 90;
        super(position,new Vector2(size, size), "/storage/img/scp/096idle.png");
        GameBase.Instance.Cache("/storage/img/scp/096idle.png");
        GameBase.Instance.Cache("/storage/img/scp/096rage.png");
        GameBase.Instance.Cache("/storage/img/scp/096Raging.png");
        this.Active = false;
        this.UpdateIn = 0;

        this.Rotation = 90;

        this.IdleSound = new Audio("/storage/sounds/SCP/096/Idle.ogg");
        this.Angering = new Audio("/storage/sounds/SCP/096/Angering.ogg");
        this.Scream = new Audio("/storage/sounds/SCP/096/Scream.ogg");
        this.Triggered = new Audio("/storage/sounds/SCP/096/Triggered.ogg");
        this.ChaseMusic = new Audio("/storage/sounds/SCP/096/ChaseMusic.ogg");

        this.IdleSound.loop = true;
        this.ChaseMusic.loop = true;
        this.Scream.loop = true;
        this.Chase = false;
        this.Scheduler.AddDelayed(() => this.IdleSound.play(), 2000);

        this.Speed = 3;
        this.Path = []
        
    }


    GetTileByPos(vector) {
        let divisor = 1/this.Parent.TileSize;
        return new Vector2(Math.floor(vector.X * divisor), Math.floor(vector.Y * divisor));
    }

    Trigger() {
        this.IdleSound.pause();
        this.Triggered.play();
        this.Angering.play();
        this.Texture = "/storage/img/scp/096raging.png";
        this.Scheduler.AddDelayed(() => {
            this.Scream.play();
            this.ChaseMusic.play();
            this.Texture = "/storage/img/scp/096Rage.png";
            this.Chase = true;
            this.UpdateIn = 0;
        }, 31249);
        this.UpdateIn = 0;
    }

    Update() {
        super.Update();
        let vol = Math.abs((Math.min(1000, this.PlayerDist) - 1000)/1000)*0.5;
        if (isNaN(vol)) {
            vol = 0.5;
        }
        
        this.Angering.volume = vol;
        this.IdleSound.volume = vol;

        vol = Math.abs((Math.min(5000, this.PlayerDist) - 5000)/5000)*0.5;
        if (isNaN(vol)) {
            vol = 0.5;
        }

        this.Scream.volume = vol;

        let diff = Math.abs(this.Rotation - GameBase.Instance.Context.Player.Rotation);
        if (this.IsInSight && diff < 30 && !this.Active && this.HasInSight) {
            this.Active = true;
            this.Trigger();
        }
        //this.Alpha = 1;
        if (!this.Active) {
            //Idle Mode
            if (this.UpdateIn < Date.now()) {
                this.UpdateIn = Date.now() + 1000 + 5000*Math.random();
                this.Rotation = 360*Math.random();
            }
            let r = (this.Rotation+90) * (Math.PI / 180);
            //console.log(this.Position.X + Math.cos(r), this.Position.X + Math.cos(r));
            if (!this.Parent.CollideAtPoint(new Vector2(this.Position.X+45+ + (Math.cos(r)/2), this.Position.Y+45)))
                this.Position.X += (Math.cos(r)/2);
            else {
                this.UpdateIn = Date.now() + 1000 + 5000*Math.random();
                this.Rotation -= 180
                this.Position.X -= (Math.cos(r)/2);
            }
            if (!this.Parent.CollideAtPoint(new Vector2(this.Position.X+45, this.Position.Y + (Math.sin(r)/2) +45)))
                this.Position.Y += (Math.sin(r)/2);
            else {
                this.UpdateIn = Date.now() + 1000 + 5000*Math.random();
                this.Rotation -= 180
                this.Position.Y -= (Math.sin(r)/2);
            }
        }
        else if (this.Chase) {
            //Chasing
            this.Alpha = 1;
            if (this.UpdateIn <= Date.now()) {
                this.UpdateIn = Date.now() + 3000;
                let pos96 = this.GetTileByPos(this.Position);
                let playerpos = this.GetTileByPos(GameBase.Instance.Context.PlayerPosition);
                this.Path = this.Parent.RouteGraph(pos96, playerpos);
            }
            
            
            let toGo;
            let p;
            console.log(this.Path)
            if (this.Path.length == 0) {
                toGo = GameBase.Instance.Context.PlayerPosition;
                p = true;
            }
            else {
                p = false;
                toGo = new Vector2(this.Path[0].X * this.Parent.TileSize + this.Parent.TileSize/2, 
                                    this.Path[0].Y * this.Parent.TileSize + this.Parent.TileSize/2);
            }
            

            let a = find_angle(new Vector2(this.Position.X, this.Position.Y+50), toGo, this.Position)
            if (this.Position.X < toGo.X) {
                a = 360 - a;
            }
            this.Rotation = a;

            let dif = new Vector2(toGo.X - this.Position.X, toGo.Y - this.Position.Y)
            
            if (Math.abs(dif.X) < 100 && Math.abs(dif.Y) < 100 && !p) {
                this.Path.splice(0,1);
            }

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