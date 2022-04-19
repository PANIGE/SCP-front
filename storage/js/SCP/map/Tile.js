import {GameBase} from "/storage/js/framework/GameBase.js";
import {Sprite} from "/storage/js/framework/objects/graphic/sprite.js";
import {Box} from "/storage/js/framework/objects/graphic/Box.js";
import {cursor} from "/storage/js/framework/objects/graphic/cursor.js";
import {Container} from "/storage/js/framework/objects/graphic/Container.js";
import {Vector2, Color, Rectangle} from "/storage/js/framework/data.js";
import { ParseColliders } from "/storage/js/SCP/map/parser.js";


export class Tile extends Sprite {
    Colliders;
    ColliderRect;
    Links;
    constructor(Texture) {
        super(Vector2.Zero, Vector2.Zero, 5, 0,Texture, 1, Color.White);
        this.Colliders = [];
        this.colliderRect = 12; //Numbers of colliders per side
        this.Links = "";
    }

    get TileSize() { return this.Parent.TileSize / this.colliderRect;  } 

    MakeColliders() {
        //console.log(GameBase.Instance.cache["col"])

        if (GameBase.Instance.cache["col"][this.Texture + ".map"]) {
            if (GameBase.Instance.cache["col"][this.Texture + ".map"] == "working") {
                setTimeout( () => {
                    this.MakeColliders()
                }, 500)
            }
            else if (GameBase.Instance.cache["col"][this.Texture + ".map"] == "404") {
                
                return
            }
            else {
                ParseColliders(this, GameBase.Instance.cache["col"][this.Texture + ".map"]);
            }
            
        }
        else {
        
            GameBase.Instance.cache["col"][this.Texture + ".map"] = "working";
            setTimeout(() => {
                fetch(this.Texture + ".map").then(response => response.text()).then(s => {
                    if (s.startsWith("<!doctype html>")) {
                        GameBase.Instance.cache["col"][this.Texture + ".map"] = '404';
                        return;
                    }
                    GameBase.Instance.cache["col"][this.Texture + ".map"] = s;
                    ParseColliders(this, s);
                });
            })
    
        }


    }

    AddCollider(Position) {
        this.Colliders.push(new Rectangle(
            new Vector2(Position.X*this.TileSize, Position.Y*this.TileSize),
            new Vector2(this.TileSize, this.TileSize)
            ));
    }
    
}