import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js"

export class MapItem extends Sprite {

    constructor(texture) {
        super(Vector2.Zero, Vector2.Zero, -2, 0, texture, 1, Color.White);
        this.Equippable = false;
    }

    
    get PlayerDist() { return Math.sqrt(Math.pow(GameBase.Instance.Context.PlayerPosition.X - (this.CenterPosition.X),2) + Math.pow(GameBase.Instance.Context.PlayerPosition.Y - (this.CenterPosition.Y),2));}


    GetInventoryItem() {
        
    }

    Interract() {
        GameBase.Instance.Context.Player.Inventory.PickupItem(this)
    }

    Update() {
        if (this.PlayerDist < 150) {
            GameBase.Instance.Focused = this;
        }
        else if (GameBase.Instance.Focused == this) {
            GameBase.Instance.Focused = undefined;
        }
    }

}