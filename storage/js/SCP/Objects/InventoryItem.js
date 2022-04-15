import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js"

export class InventoryItem extends Sprite {

    Equipable;

    Name;

    Type;

    constructor(texture) {
        super(Vector2.Zero, Vector2.Zero, -2, 0, texture, 1, Color.White);
        this.Equipable = false;
        this.Type = "unknown";
    }

    OnClick() {
        if (GameBase.Instance.PressedKeys.control) {
            this.Parent.Drop(this);
            return true;
        }
        if (this.Equippable) {
            this.Parent.Equip(this);
        }
        else {
            this.Parent.Use(this);
        }
        
        return true;
    }

    Use() {

    };

    GetMapItem() {
        
    }

}