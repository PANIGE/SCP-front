import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";

function find_angle(p0,p1,c) {
    //https://stackoverflow.com/questions/1211212/how-to-calculate-an-angle-from-three-points
    var p0c = Math.sqrt(Math.pow(c.X-p0.X,2)+
                        Math.pow(c.Y-p0.Y,2)); // p0->c (b)   
    var p1c = Math.sqrt(Math.pow(c.X-p1.X,2)+
                        Math.pow(c.Y-p1.Y,2)); // p1->c (a)
    var p0p1 = Math.sqrt(Math.pow(p1.X-p0.X,2)+
                         Math.pow(p1.Y-p0.Y,2)); // p0->p1 (c)         
    return (Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c)) * (180 / Math.PI));
}


export class Player extends Container {
    FlashLight;
    FoV;
    Preload;
    pSize;
    ViewTriangle;
    constructor() {
        
        let size = 90;
        super(new Vector2(960-(size/2), 540-(size/2)), new Vector2(size, size), -1, 0, 1, Color.White);


        this.pSize = size;

        this.Add(new Sprite(Vector2.Zero,new Vector2(size, size), -1, 270, "/storage/img/player.png", 1, Color.White));
        this.FoV = new Sprite(new Vector2(-1500 + size/2,-1500+size/2),new Vector2(3000,3000), 1, 0, "/storage/img/FoV.png", 0.9, Color.White);
        this.Add(this.FoV);


        this.FlashLight = false;
        GameBase.Instance.Cache("/storage/img/FoVFL.png");
        GameBase.Instance.Cache("/storage/img/FoV.png");


    }

    Update() {
        let t = Math.floor(find_angle(new Vector2(960, 0), GameBase.Instance.MousePos, new Vector2(960, 540)));
        if (GameBase.Instance.MousePos.X < 960) {
            this.Rotation = 360-t
        }
        else {
            this.Rotation = t
        }
        if (this.FlashLight) {
            this.FoV.Texture = "/storage/img/FoVFL.png";
        }
        else {
            this.FoV.Texture = "/storage/img/FoV.png";
        }
        
        let angRadL = (this.Rotation - 45 - 90) *(Math.PI/180);
        let angRadR = (this.Rotation + 45 - 90)*(Math.PI/180) ;
        let dist = this.FlashLight? 2000 : 300;
        let playerPos = GameBase.Instance.Context.PlayerPosition;
        this.ViewTriangle = {
            "c" : GameBase.Instance.Context.PlayerPosition,
            "p1" : new Vector2(playerPos.X + Math.cos(angRadL)*dist, playerPos.Y + Math.sin(angRadL)*dist),
            "p2" : new Vector2(playerPos.X + Math.cos(angRadR)*dist, playerPos.Y + Math.sin(angRadR)*dist),
        }
        
        
    }
}