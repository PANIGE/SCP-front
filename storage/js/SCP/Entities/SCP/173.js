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

export class SCP173 extends SCPBase
{

   

    WasMoving;
    WasInSight;

    JumpScareSound;
    NearSound;
    SpottedSound;

    Wandering
    constructor(position) {
        
        let size = 90;
        super(position,new Vector2(size, size), "/storage/img/scp/173.png");
        GameBase.Instance.Cache("/storage/img/scp/173.png");
        this.WasMoving = false;
        this.WasInSight = false;
        this.JumpScareSound = new Audio("/storage/sounds/scp/173/JumpScare.ogg");
        this.NearSound = new Audio("/storage/sounds/scp/173/Nearing.ogg");
        this.SpottedSound = new Audio("/storage/sounds/scp/173/Spotted.ogg");

        this.Wandering = [
            new Audio("/storage/sounds/scp/173/Wandering1.ogg"),
            new Audio("/storage/sounds/scp/173/Wandering2.ogg"),
            new Audio("/storage/sounds/scp/173/Wandering3.ogg")
        ]

    }



    Update() {

        let vol = Math.abs((Math.min(1000, this.PlayerDist) - 1000)/1000)*0.5;
        if (isNaN(vol)) {
            vol = 0.5;
        }
        this.Wandering.forEach(s => s.volume = vol);

        if (!this.WasInSight && (this.IsInSight && this.HasInSight)) {
            this.SpottedSound.play();
        }
        this.WasInSight = this.IsInSight;

        super.Update();
        if (Math.random()*1000 < 5) {
            let t = Math.floor(Math.random()*2);
            this.Wandering[t].play()
        }
        let speed = Math.min(50, this.PlayerDist)
        if (this.WasMoving && this.IsInSight && !GameBase.Instance.Context.Blinking) {
            this.WasMoving = false;
            if (this.PlayerDist < 300) {
                this.JumpScareSound.play();
            }
            else if (this.PlayerDist < 1000) {
                this.NearSound.play();
            }
        }
        //console.warn(this.HasInSight)
        if (this.HasInSight && ((GameBase.Instance.Context.Blinking && !this.WasMoving) || !this.IsInSight)) {
            //can move !
            
            let blinkMove = (GameBase.Instance.Context.Blinking && !this.WasMoving);
            if (blinkMove) {
                speed = Math.min(this.PlayerDist, 600);
            }

            let angle;
            if (this.Position.X - GameBase.Instance.Context.PlayerPosition.X < 0) {
                angle = 360 - find_angle(new Vector2(this.Position.X, this.Position.Y+960), GameBase.Instance.Context.PlayerPosition, this.Position)+90;
                
            }
            else {
                angle = find_angle(new Vector2(this.Position.X, this.Position.Y+960), GameBase.Instance.Context.PlayerPosition, this.Position)+90;
                
            }
            this.Rotation = 90 - angle;
            if (isNaN(angle)) {
                angle = 0;
            }
            angle = angle * (Math.PI/180);
            this.Position = new Vector2(this.Position.X+Math.cos(angle)*speed,this.Position.Y + Math.sin(angle)*speed);
            
         
            
            this.WasMoving = true;
        }/*
        else if (!this.HasInSight) {
            

            //If the player is lost by 173 it will move to the last known position to track the player
            
            let angle;
            if (this.Position.X - this.LastKnownPosition.X < 0) {
                angle = 360 - find_angle(new Vector2(this.Position.X, this.Position.Y+960), this.LastKnownPosition, this.Position)+90;
            }
            else {
                angle = find_angle(new Vector2(this.Position.X, this.Position.Y+960), this.LastKnownPosition, this.Position)+90;
            }
            this.Rotation = 90 - angle;
            angle = angle * (Math.PI/180);
            
            if (this.Parent.Collide(this.Position, (this.Position.X - this.LastKnownPosition.X > 0 ? -50 : 50), false)) {
                this.Position.X += (this.Position.X - this.LastKnownPosition.X > 0 ? -20 : 20)
            }
            if (this.Parent.Collide(this.Position, (this.Position.Y - this.LastKnownPosition.Y > 0 ? -50 : 50), true)) {
                this.Position.Y += (this.Position.Y - this.LastKnownPosition.Y > 0 ? -20 : 20)
            }
            this.Position = new Vector2(this.Position.X+Math.cos(angle)*speed,this.Position.Y + Math.sin(angle)*speed);
            this.WasMoving = true;
            
        }*/
       //Remove the fact that SCP 173 can track players... becuz with his gameplay, it would be TOO HARD for the player to survive 173
    }

    
    
}