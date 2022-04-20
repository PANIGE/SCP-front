import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js";
import { GraphNode } from "/storage/js/SCP/Entities/map/graphNode.js";

let DEBUGCOLLIDES = false;

export function CalculateGraph(MapContainer) {
    let graphList = [];
    for (let y = 0; y < MapContainer.MapMatrix.length;y++) {
        let l = [];
        for (let x= 0; x < MapContainer.MapMatrix[y].length;x++) {
            let n = new GraphNode(new Vector2(x, y));
            let e = MapContainer.GetMatrixPos(new Vector2(x, y));
            
            if (e != null) {
                if (e.Links.includes("W")) {
                    n.Add(new Vector2(x-1, y));
                }
                if (e.Links.includes("E")) {
                    n.Add(new Vector2(x+1, y));
                }
                if (e.Links.includes("S")) {
                    n.Add(new Vector2(x, y+1));
                }
                if (e.Links.includes("N")) {
                    n.Add(new Vector2(x, y-1));
                }
                
            }
            l.push(n)
            
        }
        graphList.push(l);
    }
    return graphList
}



//NICE, exponential Complexity !!! Don't have time to do better
export function NextStep(EndPos, CurrentPos, graph, used) {
    let dists = [];
    console.log(graph[CurrentPos.Y])
    let c= graph[CurrentPos.Y][CurrentPos.X];
    if (c == undefined) {
        return {length: Infinity}
    }
    used.push(CurrentPos);
    if (CurrentPos.X == EndPos.X && CurrentPos.Y == EndPos.Y) {
        return used;
    }
    c.Connectors.forEach(s => {
        if (!used.some(t => {return s.X == t.X && s.Y == t.Y} )) { 
            let aa = NextStep(EndPos, s, graph, [...used]);
            dists.push(aa);
        }
        
    });

    
    if (dists.length == 0) {
        return {length: Infinity}
    }
    
    var shortest = dists.reduce(function(p,c) {return p.length<c.length?p:c;},{length:Infinity});
    return shortest;
}



export class MapContainer extends Container {
    Tiles;
    TileSize;
    MapMatrix;

    constructor() {
        super(Vector2.Zero, Vector2.Zero, 5, 0, 1, Color.White);
        this.Tiles = [];
        this.TileSize = 1000;
        this.AlwaysPresent = true;
        this.MapMatrix = [];
        
    }

    RouteGraph(StartPos, EndPos) {
        let graph = CalculateGraph(this);
        return NextStep(EndPos, StartPos, graph, []);
    }

    GetMatrixPos(v) {
        if (this.MapMatrix.length < v.Y)
            return null;

        if (this.MapMatrix[v.Y].length < v.X)
            return null;

        return this.MapMatrix[v.Y][v.X];
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

    CollideAtPoint(p1) {
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