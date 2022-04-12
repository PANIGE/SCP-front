import {Vector2} from "/storage/js/framework/data.js";
import {GameBase} from "/storage/js/framework/GameBase.js";
import { Tile } from "/storage/js/SCP/map/Tile.js";

export function MapParser(mapCont, txt) {
    let toParse = txt.split("\n");
    let current = "init"
    let tex = {}
    let v;
    let y = 0;
    for (let i = 0; i < toParse.length; i++) {
        let line = toParse[i];
        if (line == "" || line == "\r") {
            continue;
        }
        if (line.startsWith("//")) {
            continue;
        }
        if (line.startsWith("---") && current != "build") {
            current = "build";
            continue;
        }
        switch (current) {
            case "init":
                v = line.split(":");
                tex[v[0].trim()] = v[1].trim()
                break;
            case "build":
                v = line.split('');
                
                let x = 0;
                v.forEach(e => {
                    if (tex.hasOwnProperty(e)) {
                        if (tex[e].toLowerCase().startsWith("spawn/")) {
                            GameBase.Instance.Context.PlayerPosition = new Vector2(x*mapCont.TileSize + mapCont.TileSize/2, y*mapCont.TileSize + mapCont.TileSize/2);
                            mapCont.AddTile(new Tile(tex[tex[e].split("/")[1]]), new Vector2(x, y));
                        }
                        else {
                            mapCont.AddTile(new Tile(tex[e]), new Vector2(x, y));
                        }
                        
                    }
                    x++;
                });
                y++;
                break;
        }
    }
}

export function ParseColliders(tile, txt) {

    console.log(txt)
    let toParse = txt.split("\n");
    for (let y = 0; y < toParse.length; y++) {
        let line = toParse[y];
        let v = line.split('');
        let x = 0;
        v.forEach(e => {
            if (e == "0") {
                console.log(e)
                tile.AddCollider(new Vector2(x, y));
            }
            x++;
        });
    }

}