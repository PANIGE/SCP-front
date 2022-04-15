import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js"
import { MapItem } from "/storage/js/SCP/Objects/MapItem.js";
import { InventoryItem } from "/storage/js/SCP/Objects/InventoryItem.js";

export class MKeyCard1 extends MapItem {
    constructor() {
        super("/storage/img/objects/keycards/1map.png");
        this.Size = new Vector2(30,30);
    }

    GetInventoryItem() {
        return new IKeyCard1();
    }
}

export class IKeyCard1 extends InventoryItem {

    Level;

    constructor() {
        super("/storage/img/objects/keycards/1inventory.png");
        this.Name = "Level 1 Key Card";
        this.Level = 1;
        this.Equipable = true;
        this.Type = "keycard";
    }

    GetMapItem() {
        let t = new MKeyCard1();
        t.Rotation = Math.random() * 360;
        return t;
    }
}