
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
                GameBase.Instance.Cache(v[1].trim())
                break;
            case "build":
                v = line.split('');
                let l = [];
                let x = 0;
                v.forEach(e => {
                    if (tex.hasOwnProperty(e)) {
                        if (tex[e].toLowerCase().startsWith("spawn/")) {
                            GameBase.Instance.Context.PlayerPosition = new Vector2(x*mapCont.TileSize + mapCont.TileSize*0.4, y*mapCont.TileSize + mapCont.TileSize*0.6);
                            let t = new Tile(tex[tex[e].split("/")[1]]);
                            l.push(t);
                            mapCont.AddTile(t, new Vector2(x, y));
                        }
                        else {
                            let t = new Tile(tex[e]);
                            l.push(t);
                            mapCont.AddTile(t, new Vector2(x, y));
                        }
                        
                    }
                    else {
                        let t = new Tile("/storage/img/rooms/emptyCollider.png");
                        l.push(t);
                        mapCont.AddTile(t, new Vector2(x, y));
                    }
                    x++;
                });
                mapCont.MapMatrix.push(l);
                y++;
                break;
        }
        
    }
}



export function ParseColliders(tile, txt) {

    let toParse = txt.split("\n");
    let mode = "colliders";

    for (let y = 0; y < toParse.length; y++) {
        let line = toParse[y];
        let x = 0;
        let v;
        if (line.startsWith("---")) {
            if(mode == "doors") {
                mode = "graph";
                continue;
            }
            mode = "doors";
            continue;
        }
        switch (mode) {
            case "colliders":
                v = line.split('');
                v.forEach(e => {
                    if (e == "0") {
                        tile.AddCollider(new Vector2(x, y));
                    }
                    x++;
                });
                break;
            case "doors":
                try {
                    v = line.split(';')
                    let pos = new Vector2(parseInt(v[0].split(":")[0]), parseInt(v[0].split(":")[1]));
                    let vertical = v[1].toLowerCase().startsWith("v");
                    let tilePos = new Vector2(tile.X / tile.Parent.TileSize, tile.Y / tile.Parent.TileSize);
                    let level = v.length > 2 && !v[2].toLowerCase().startsWith("c") ? parseInt(v[2]) : 0
                    let ck = v.length > 3 && v[3].toLowerCase().startsWith("c");
                    tile.Parent.AddDoor(tilePos, pos, vertical, ck, level);
                } catch (e) {
                    console.warn("Silent Error : ", e)
                }

                break;
            case "graph":
                tile.Links = line.toUpperCase();
                break;
            
        }

    }

}