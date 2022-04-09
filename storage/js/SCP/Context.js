import { Vector2 } from "../framework/data.js";

export class Context {
    PlayerPosition;
    Player;
    
    BlinkTime;
    Endurance;
    constructor() {
        this.PlayerPosition = new Vector2(0,0);
        this.BlinkTime = 100;
        this.Endurance = 100;
    }

    get Blinking() {
        return this.BlinkTime<=0;
    }
}