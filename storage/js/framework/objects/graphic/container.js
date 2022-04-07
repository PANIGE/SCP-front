import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color} from "/storage/js/framework/data.js";
import { Drawable } from "/storage/js/framework/objects/graphic/drawable.js";

export class Container extends Drawable {
    Children;
    Masking;
    
    constructor(Position, Size, Depth, Rotation, Alpha, Color) {
        super(Position, Size, Depth, Rotation, Alpha, Color);
        
        this.Children = []
        this.Masking = false;
    }


    Add(Child){
        if (Child.Parent != undefined || GameBase.Instance.SpriteManager.sprites.indexOf(Child) != -1) {
            throw "You may not add drawable to multiple containers";
        }
        Child.Parent = this;
        this.Children.push(Child);
        this.Children.sort(function(a, b) {
            if (a.Depth > b.Depth) return -1;
            if (a.Depth < b.Depth) return 1;
            return 0;
          });
        Child.Load();
    }

    Remove(Child) {
        if (this.Children.indexOf(Child) == -1) {
            throw "this container does not contain this drawable";
        }
        Child.Parent = undefined;
        this.Children.slice(this.Children.indexOf(Child), 1);

    }

    
    Draw() {

        let container = super.Draw();
        if (container == null)
            return null;
        this.Children.forEach(s => {
            let drawable = s.Draw();
            if (drawable == null) {
                return;
            }
            container.appendChild(drawable);
        });
        return container;
    }

}