import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js"
import { MapItem } from "/storage/js/SCP/Objects/MapItem.js";
import { InventoryItem } from "/storage/js/SCP/Objects/InventoryItem.js";

export class MDocument106 extends MapItem {
    constructor() {
        super("/storage/img/objects/document.png");
        this.Size = new Vector2(30,30);
    }

    GetInventoryItem() {
        return new IDocument106();
    }
}

export class IDocument106 extends InventoryItem {


    constructor() {
        super("/storage/img/objects/documentInv.png");
        this.Name = "SCP 106 Document";
        this.Equipable = false;
        this.Type = "document";
    }

    GetMapItem() {
        let t = new MDocument106();
        t.Rotation = Math.random() * 360;
        return t;
    }

    Use() {
        let t = new Sprite(new Vector2(578,0), new Vector2(764, 1080), -5, 0, "/storage/img/objects/Documents/106.jpg", 1, Color.White);
        GameBase.Instance.CanMove = false;
        t.OnClick = () => {
            GameBase.Instance.CanMove = true;
            GameBase.Instance.SpriteManager.Remove(t);
            return true;
        }
        
        GameBase.Instance.SpriteManager.Add(t);
    }
}