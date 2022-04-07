import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color} from "/storage/js/framework/data.js";


export class MapContainer extends Container {
    Tiles;
    TileSize;
    constructor() {
        super(Vector2.Zero, Vector2.Zero, 5, 0, 1, Color.White);
        this.Tiles = [];
        this.TileSize = 100;
        this.AlwaysPresent = true;
    }

    Update() {
        this.Position = new Vector2(0-GameBase.Instance.Context.PlayerPosition.X, 0-GameBase.Instance.Context.PlayerPosition.Y);
    }

    AddTile(Sprite, Position) {
        Sprite.Parent = this;
        Sprite.Size = new Vector2(this.TileSize, this.TileSize);
        Sprite.Position = new Vector2(Position.X*this.TileSize, Position.Y*this.TileSize);
        this.Tiles.push(Sprite);
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