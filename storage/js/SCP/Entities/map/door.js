import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";

export class Door extends Container
{

    Openned;
    Operating;
    static OpenSound;
    static CloseSound;

    static Checkpoint;
    Checkpoint;

    get Colliders() {
        //console.log(this.Position, this.Size)
        if (this.Openned) {
            return []
        }
        else {
            return [
                new Rectangle(this.Position, new Vector2(Math.min(this.Size.X, this.Size.Y), Math.min(this.Size.X, this.Size.Y)))
            ]
        }
    }

    constructor(ck = false) {
        super(Vector2.Zero, Vector2.Zero, -1, 0, 1, Color.White);
        this.Masking = true;

        this.Checkpoint = ck;

        this.Openned = false;
        this.Operating = false;
        if (Door.OpenSound == undefined) {
            Door.OpenSound = new Audio("/storage/sounds/doors/DoorOpen.ogg");
            Door.CloseSound = new Audio("/storage/sounds/doors/DoorClose.ogg");
            Door.Checkpoint =  new Audio("/storage/sounds/doors/DoorCheckpoint.ogg");
        }
    }



    get PlayerDist() { return Math.sqrt(Math.pow(GameBase.Instance.Context.PlayerPosition.X - (this.CenterPosition.X),2) + Math.pow(GameBase.Instance.Context.PlayerPosition.Y - (this.CenterPosition.Y),2));}


    Load() {
        this.Add(new Box(Vector2.Zero, this.Size, 0,0,1, new Color(20,20,20)));
    }

    Update() {
        super.Update(); 
        this.Alpha = this.Openned ? 0 : 1;
        if (this.PlayerDist < 150) {
            GameBase.Instance.Focused = this;
        }
        else if (GameBase.Instance.Focused == this) {
            GameBase.Instance.Focused = undefined;
        }
    }


    Interract() {
        if (this.Operating) {
            return;
        }
        this.Operating = true;
        if (this.Checkpoint) {
            this.Operating = true;
            Door.Checkpoint.play();
            this.Openned = true;

            this.Scheduler.AddDelayed(() => {
                this.Openned = false;
                Door.Checkpoint.play();
                this.Operating = false;
            }, 6000)
        }
        else {
            if (this.Openned) {
                Door.CloseSound.play();
                this.Scheduler.AddDelayed(() => {
                    this.Openned = false;
                    this.Operating = false;
                }, 1276)
            }
            else {
                Door.OpenSound.play();
                this.Scheduler.AddDelayed(() => {
                    this.Openned = true;
                    this.Operating = false;
                }, 1565)
            }
        }


    }

}