import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";

let DEBUGSIGHT = true;

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

export class SCPBase extends Sprite
{

    LastLastKnownPosition;

    constructor(position, size, texture) {
        super(position, size, -1, 0,texture, 1, Color.White);
        this.LastKnwonPos = undefined;
    }



    get PlayerDist() { return Math.sqrt(Math.pow(GameBase.Instance.Context.PlayerPosition.X - (this.CenterPosition.X),2) + Math.pow(GameBase.Instance.Context.PlayerPosition.Y - (this.CenterPosition.Y),2));}


    get IsInSight() {
        let t = GameBase.Instance.Context.Player.ViewTriangle;
        if (!t) {
            return;
        }
        return PointInTriangle(this.CenterPosition, t.c, t.p1, t.p2);
    }



    Update() {
        super.Update();
        this.Alpha = ((this.IsInSight || this.PlayerDist<120) && this.HasInSight) ? 1 : 0;
        
        if (this.HasInSight) {
            //console.log("SCP see player")
            this.LastKnownPosition = new Vector2(GameBase.Instance.Context.PlayerPosition.X, GameBase.Instance.Context.PlayerPosition.Y);
        }
            
    }

    get HasInSight() { //If SCP see player
        if (!GameBase.Instance.Context.PlayerPosition)
            return false;
        if (this.PlayerDist > 3000)
            return false; //Range view of 3000
        let CheckCount = Math.max(Math.floor(this.PlayerDist / 10), 3);
        
        let DistCheck = this.PlayerDist/CheckCount;



        for (let i = 1; i < CheckCount; i++) {
            let toCheck = i*DistCheck;
            let angle;
            if (this.Position.X - GameBase.Instance.Context.PlayerPosition.X < 0) {
                angle = 360 - find_angle(new Vector2(this.Position.X, this.Position.Y+960), GameBase.Instance.Context.PlayerPosition, this.Position)+90;
            }
            else {
                angle = find_angle(new Vector2(this.Position.X, this.Position.Y+960), GameBase.Instance.Context.PlayerPosition, this.Position)+90;
            }
            angle = angle * (Math.PI/180)
            
 
            //this.Parent.Add(new Box(new Vector2(this.Position.X+Math.cos(angle)*toCheck,this.Position.Y + Math.sin(angle)*toCheck), new Vector2(5,5), -5, 0, 1, Color.White));
            if (this.Parent.CollideAtPoint(
                new Vector2(this.CenterPosition.X+Math.cos(angle)*toCheck,this.CenterPosition.Y + Math.sin(angle)*toCheck)
            )) {
                return false;
            }
            
        }
        return true;
    }
}