import {Game} from "/storage/js/SCP/Game.js";

var gameBase = new Game();

window.onload = () => {
    let Canvas = document.getElementById("GameWindow");
    gameBase.Load(Canvas);
    
}

