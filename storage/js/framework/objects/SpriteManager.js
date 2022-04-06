import { Vector2 } from "/storage/js/framework/data.js";
import {GameBase} from "/storage/js/framework/GameBase.js";

export class SpriteManager {
    sprites;

    EffectivePosition;

    constructor() {
        this.sprites = []
        this.EffectivePosition = new Vector2(0,0)
        
    }

    HandleClick() {
        let toHandle = [...this.sprites].reverse()
        let stopPropagation = false;
        toHandle.forEach(s => {
            if (stopPropagation)
                return;
            let beg = new Vector2(s.Position.X, s.Position.Y);
            let end = new Vector2(s.Position.X + s.Size.X, s.Position.Y + s.Size.Y);
            let cur = GameBase.Instance.MousePos;
            
            if ((cur.X >= beg.X && cur.X <= end.X)
              && (cur.Y >= beg.Y && cur.Y <= end.Y)) //We are in the 
              {
                stopPropagation = s.OnClick()
              }
              
        });
    }

    HandleHover() {
        let toHandle = [...this.sprites].reverse()
        let stopPropagation = false;
        toHandle.forEach(s => {
            if (stopPropagation)
                return;
            let beg = new Vector2(s.Position.X, s.Position.Y);
            let end = new Vector2(s.Position.X + s.Size.X, s.Position.Y + s.Size.Y);
            let cur = GameBase.Instance.MousePos;
            
            if ((cur.X >= beg.X && cur.X <= end.X)
              && (cur.Y >= beg.Y && cur.Y <= end.Y)) 
              {
                stopPropagation = s.BlocksHover;
                if (!s.isHovered) {
                    s.OnHover();
                    s.isHovered = true;
                }
            }
            else {
                if (s.isHovered) {
                    s.OnHoverLost();
                    s.isHovered = false;
                }
            }
              
        });
    }


    Add(Sprite) {
        this.sprites.push(Sprite);
        Sprite.Parent = this;
        Sprite.Load();
        this.sprites.sort(function(a, b) {
            if (a.Depth > b.Depth) return -1;
            if (a.Depth < b.Depth) return 1;
            return 0;
          });
    }

    Update() {
        GameBase.Instance.Canvas.innerHTML = "";
        this.sprites.forEach(s => {
            s.Update();
            s.Draw();
        })
    }

    Remove(Sprite) {
        this.sprites.slice(this.sprites.indexOf(Sprite), 1)
    }

    Clear() {
        this.sprites = [];
    }
}