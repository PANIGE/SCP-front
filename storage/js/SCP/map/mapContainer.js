import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js"

let DEBUGCOLLIDES = false;

export class MapContainer extends Container {
    Tiles;
    TileSize;

    constructor() {
        super(Vector2.Zero, Vector2.Zero, 5, 0, 1, Color.White);
        this.Tiles = [];
        this.TileSize = 1000;
        this.AlwaysPresent = true;
    }

    Update() {
        super.Update();
        this.Tiles.forEach(s => s.Update())
        this.Position = new Vector2(0-GameBase.Instance.Context.PlayerPosition.X + 960, 0-GameBase.Instance.Context.PlayerPosition.Y + 540);
        
    }

    

    AddTile(Sprite, Position) {
        Sprite.Parent = this;
        Sprite.Size = new Vector2(this.TileSize, this.TileSize);
        Sprite.Position = new Vector2(Position.X*this.TileSize, Position.Y*this.TileSize);
        Sprite.MakeColliders();
        this.Tiles.push(Sprite);
    }

    AddDoor(TilePosition, DoorPosition, isVertical, Checkpoint, level) {
        let size;
        let position;
        let colliderSize = this.TileSize / 12;
        if (isVertical) {
            size = new Vector2(colliderSize, colliderSize*2);
            position = new Vector2((TilePosition.X * this.TileSize) + (DoorPosition.X * colliderSize) - (colliderSize/2), (TilePosition.Y * this.TileSize) + (DoorPosition.Y * colliderSize))
        }
        else {
            size = new Vector2( (this.TileSize / 12)*2, this.TileSize / 12);
            position = new Vector2((TilePosition.X * this.TileSize) + (DoorPosition.X * colliderSize), (TilePosition.Y * this.TileSize) + (DoorPosition.Y * colliderSize) - (colliderSize/2))
        }

        let t = new Door(Checkpoint, level);
        t.Parent = this;
        t.Position = position;
        t.Size = size;
        t.Load();
        this.Tiles.unshift(t);
    }


    Collide(Pos, speed, isVertical) {
        return this.Tiles.some(sprite => {
            let PlayerSize = GameBase.Instance.Context.Player.pSize;
            let p1 = isVertical? new Vector2(Pos.X, Pos.Y+speed) : 
                new Vector2(Pos.X+speed ,Pos.Y );
            let r = (PlayerSize / 4) + (this.TileSize/2);
            let SpriteCenterPos = new Vector2(sprite.Position.X + sprite.Size.X/2, sprite.Position.Y + sprite.Size.Y/2)
            
            
            if (sprite.hasOwnProperty("Openned")) {
                r = (PlayerSize / 4) + (Math.min(sprite.Size.X, sprite.Size.Y)/2)
            }
            
            if (Math.abs(p1.X - SpriteCenterPos.X) < r && Math.abs(p1.Y - SpriteCenterPos.Y) < r) {
                if (DEBUGCOLLIDES) {
                    if (!this.Children.some(e => typeof e == "Box")) {
                        let t = new Box(sprite.Position, sprite.Size, -2, 0, 0.05, new Color(200,255,200))
                        this.Add(t);
                        this.Scheduler.AddDelayed(() => this.Remove(t), 100)
                    }

                }
                
                if (sprite.hasOwnProperty("Openned")) {
                    r = (PlayerSize / 4) + (Math.min(sprite.Size.X, sprite.Size.Y)/2)
                    return !sprite.Openned
                }

                return sprite.Colliders.some(p2 => {
                    /*
                    if (DEBUGCOLLIDES) {
                        let t = new Box(new Vector2(sprite.X + p2.X, sprite.Y + p2.Y), new Vector2(sprite.TileSize, sprite.TileSize), -2, 0, 1, new Color(50,255,50))
                        this.Add(t);
                        this.Scheduler.AddDelayed(() => this.Remove(t), 50)
                    }*/

                    let ColliderCenterPos = new Vector2(sprite.X + p2.X + p2.Width/2, sprite.Y + p2.Y + p2.Height/2)
                    r = (PlayerSize / 2) + (sprite.TileSize/2);
                    return Math.abs(p1.X - ColliderCenterPos.X) < r && Math.abs(p1.Y -ColliderCenterPos.Y) < r;
                });
            }
            else return false;

        });
    }

    CollideAtPoint(p1, size=1) {
        return this.Tiles.some(sprite => {
            
            if ((p1.X > sprite.X && p1.X < sprite.X + sprite.Width) && (p1.Y > sprite.Y && p1.Y < sprite.Y + sprite.Height)) {
                
                if (sprite.hasOwnProperty("Openned")) {
                    return !sprite.Openned;
                }
                return sprite.Colliders.some(container => {
                    return (p1.X > sprite.X + container.X && p1.X < sprite.X + container.X + container.Width) && (p1.Y > sprite.Y + container.Y && p1.Y < sprite.Y + container.Y + container.Height);
                });
            }
            else return false;

        });
    }

    Draw() {
        let v = super.Draw();
        if (v == null)
            return;
        this.Tiles.forEach(s => {
            let t = s.Draw();
            if (t == null)
                return;
            v.insertBefore(t, v.firstChild);
            });
        
    }
}