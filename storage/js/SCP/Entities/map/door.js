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
    static KeyPass;
    static KeyFail;

    static Checkpoint;
    static CheckpointList;
    Checkpoint;

    door1;
    door2;

    Level;

    Locked;

    constructor(ck = false, level=0) {
        super(Vector2.Zero, Vector2.Zero, -1, 0, 1, Color.White);
        this.Masking = true;

        this.Checkpoint = ck;

        this.Openned = false;
        this.Operating = false;
        if (Door.OpenSound == undefined) {
            Door.OpenSound = new Audio("/storage/sounds/doors/DoorOpen.ogg");
            Door.CloseSound = new Audio("/storage/sounds/doors/DoorClose.ogg");
            Door.Checkpoint =  new Audio("/storage/sounds/doors/DoorCheckpoint.ogg");
            Door.KeyPass =  new Audio("/storage/sounds/doors/KeycardPass.ogg");
            Door.KeyFail =  new Audio("/storage/sounds/doors/KeycardFail.ogg");
            Door.CheckpointList = []
        }

        if (ck) {
            Door.CheckpointList.push(this);
        }
        this.Level = level;

        this.Locked = false;
    }



    get PlayerDist() { return Math.sqrt(Math.pow(GameBase.Instance.Context.PlayerPosition.X - (this.CenterPosition.X),2) + Math.pow(GameBase.Instance.Context.PlayerPosition.Y - (this.CenterPosition.Y),2));}


    Load() {
        let vert = this.Width < this.Height;
        if (vert) {
            this.door1 = new Box(Vector2.Zero, new Vector2(this.Width/2, this.Height), 0,0,1, new Color(20,20,20));
            this.door2 = new Box(new Vector2(this.Width/2, 0), new Vector2(this.Width/2, this.Height), 0,0,1, new Color(20,20,20));
        }
        else {
            this.door1 = new Box(Vector2.Zero, new Vector2(this.Width, this.Height/2), 0,0,1, new Color(20,20,20));
            this.door2 = new Box(new Vector2(0, this.Height/2), new Vector2(this.Width, this.Height/2), 0,0,1, new Color(20,20,20));
        }
        this.Add(this.door1);
        this.Add(this.door2);
    }

    Update() {
        super.Update(); 
        if (this.PlayerDist < 150 && !this.Operating) {
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

        if (this.Locked) {
            GameBase.Instance.Overlays.ShowMessage("This door seems to be blocked");
            return;
        }

        if (this.Level > 0 && (GameBase.Instance.Context.Player.Inventory.Equipped == undefined)) {
            GameBase.Instance.Overlays.ShowMessage("This door seems to require a keycard");
            return;
        }
        else if (this.Level > 0 && (GameBase.Instance.Context.Player.Inventory.Equipped.Type != "keycard")){
            GameBase.Instance.Overlays.ShowMessage("This door seems to require a keycard");
            return;
        }
        else if (this.Level > 0 &&GameBase.Instance.Context.Player.Inventory.Equipped != undefined && GameBase.Instance.Context.Player.Inventory.Equipped.Level < this.Level) {
            GameBase.Instance.Overlays.ShowMessage("The card was inserted into the slot, but nothing seems to happen, try to get a higer keycard");
            Door.KeyFail.play();
            return;
        }
        else if (this.Level > 0 &&GameBase.Instance.Context.Player.Inventory.Equipped != undefined && GameBase.Instance.Context.Player.Inventory.Equipped.Level >= this.Level) {
            GameBase.Instance.Overlays.ShowMessage("The card was inserted into the slot");
            Door.KeyPass.play();
        }
        
        this.Operating = true;
        let waitTime = this.Level > 0 ? 773 : 0;
        this.Scheduler.AddDelayed(() => {
            if (this.Checkpoint) {
                Door.CheckpointList.forEach(element => {
                    element.Operating = true;
                    element.door1.MoveTo(new Vector2(0-element.Width, 0), 1000);
                    element.door2.MoveTo(new Vector2(element.Width, element.Height/2), 1000);
                });

                Door.Checkpoint.pause();
                Door.Checkpoint.currentTime = 0;
                Door.Checkpoint.play();

                this.Scheduler.AddDelayed(() => {
                    Door.CheckpointList.forEach(element => {
                        element.Openned = true;
                    });
                }, 1000);

                this.Scheduler.AddDelayed(() => {
                    Door.Checkpoint.play();
                    Door.CheckpointList.forEach(element => {
                        element.door1.MoveTo(Vector2.Zero, 1000);
                        element.door2.MoveTo(new Vector2(0, element.Height/2), 1000);
                    });
                }, 6000);

                this.Scheduler.AddDelayed(() => {
                    Door.CheckpointList.forEach(element => {
                        element.Openned = false;
                    });
                }, 6500);

                this.Scheduler.AddDelayed(() => {
                    Door.CheckpointList.forEach(element => {
                        element.Operating = false;
                    });
                }, 7000);

                


            }
            else {

                let vert = this.Width < this.Height;

    
                if (this.Openned) {
                    Door.CloseSound.play();

                    this.door1.MoveTo(Vector2.Zero, 1276);
                    if (vert) {
                        this.door2.MoveTo(new Vector2(this.Width/2, 0), 1276);
                    }
                    else {
                        this.door2.MoveTo(new Vector2(0, this.Height/2), 1276);
                    }

                    this.Scheduler.AddDelayed(() => {
                        this.Openned = false;
                    },638);

                    this.Scheduler.AddDelayed(() => {
                        this.Operating = false;
                    }, 1276);
                }
                else {
                    Door.OpenSound.play();

                    
                    
                    if (vert) {
                        this.door1.MoveTo(new Vector2(0, 0-this.Height), 1565);
                        this.door2.MoveTo(new Vector2(this.Width/2, this.Height), 1565);
                    }
                    else {
                        this.door1.MoveTo(new Vector2(0-this.Width, 0), 1565);
                        this.door2.MoveTo(new Vector2(this.Width, this.Height/2), 1565);
                    }

                    this.Scheduler.AddDelayed(() => {
                        this.Openned = true;
                        
                        
                        
                        if (Math.random()*1000 < 100) {
                            if (vert) {
                                let before = this.Position.X < GameBase.Instance.Context.PlayerPosition.X;
                                if (before) {
                                    GameBase.Instance.SCP173.Position = new Vector2(this.Position.X - this.Parent.TileSize/3, this.Position.Y);
                                }
                                else {
                                    GameBase.Instance.SCP173.Position = new Vector2(this.Position.X + this.Parent.TileSize/3, this.Position.Y);
                                }
                                
                            }
                            else {
                                let before = this.Position.Y < GameBase.Instance.Context.PlayerPosition.Y;
                                if (before) {
                                    GameBase.Instance.SCP173.Position = new Vector2(this.Position.X, this.Position.Y- this.Parent.TileSize/3);
                                }
                                else {
                                    GameBase.Instance.SCP173.Position = new Vector2(this.Position.X , this.Position.Y+ this.Parent.TileSize/3);
                                }
                            }
                            GameBase.Instance.SCP173.SpottedSound.play();
                        }
        
                    },782);

                    this.Scheduler.AddDelayed(() => {
                        this.Operating = false;
                    }, 1565);
                }
            }

        },waitTime);


    }

}