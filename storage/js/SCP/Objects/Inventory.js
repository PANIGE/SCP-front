import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { Box } from "/storage/js/framework/objects/graphic/Box.js";
import { Door } from "/storage/js/SCP/Entities/map/door.js"

export class Inventory extends Container {

    BoxList;
    Equipped;

    StoredItem;
    constructor() {
        super(new Vector2(1020, 960), new Vector2(1000, 100), -3, 0, 1, Color.White);
        this.StoredItem = [];
        this.BoxList = [];
    }


    Load() {
        for (let i = 0; i < 6; i++) {
            let b = new Box(new Vector2(i*100 + (i*50), 0), new Vector2(100, 100), 0, 0, 1, new Color(50,50,50));
            this.Add(b);
            this.BoxList.push(b);
        }
    }

    PickupItem(item) {
        if (this.StoredItem.length >= 6) {
            GameBase.Instance.Overlays.ShowMessage("You carry too many objects to pickup that");
            return;
        }
        GameBase.Instance.Map.Remove(item);
        let t = item.GetInventoryItem();
        GameBase.Instance.Overlays.ShowMessage(`You picked up ${t.Name}`)
        this.StoredItem.push(t);
        this.Add(t);
        let i = 0;
        this.StoredItem.forEach(s => {
            s.Position = new Vector2(i*100 + (i*50), 0);
            i++;
        });
        t.Size = new Vector2(100,100);
    }

    Drop(item) {
        
        if (this.Equipped != null && this.Equipped.Name == item.Name) {
            this.Equip(undefined);
        }
        this.StoredItem.splice(this.StoredItem.indexOf(item), 1)
        this.Remove(item);
        GameBase.Instance.Overlays.ShowMessage(`You dropped ${item.Name}`);

        //item.Parent = undefined;
        let i = 0;
        
        this.StoredItem.forEach(s => {
            s.Position = new Vector2(i*100 + (i*50), 0);
            i++;
        });
        let t = item.GetMapItem();
        t.Position = new Vector2(GameBase.Instance.Context.PlayerPosition.X, GameBase.Instance.Context.PlayerPosition.Y);
        GameBase.Instance.Map.Add(t);
    }

    Equip(item) {
        
        if (this.Equipped != undefined && item != undefined && this.Equipped.Name == item.Name) {
            return;
        }


        this.BoxList.forEach(s => {
            s.Color = new Color(50,50,50)
        });
        if (item != undefined) {
            this.BoxList[this.StoredItem.indexOf(item)].Color = new Color(150,150,150);
            if (this.Equipped != undefined) {
                
                GameBase.Instance.Overlays.ShowMessage(`You replaced ${this.Equipped.Name} with ${item.Name}`);
            }
            else {
                GameBase.Instance.Overlays.ShowMessage(`You equipped ${item.Name}`);
            }
        }
        else {
            GameBase.Instance.Overlays.ShowMessage(`You unequipped ${this.Equipped.Name}`);
        }
        this.Equipped = item;
    }

   

    Use(item) {
        if (item.Equipable) {
            this.Equip(item);
        }
        else {
            item.Use();
        }
    }
}