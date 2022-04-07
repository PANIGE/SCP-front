function Lerp(v1, v2, ratio) { //PrimitiveLerp
    return v1 + (v2 - v1)*ratio;
}

export class Vector2 {
    X;
    Y;
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
    static Lerp(v1, v2, ratio) {
        let Vec = new Vector2(0);
        Vec.X = v1.X + (v2.X - v1.X)*ratio;
        Vec.Y = v1.Y + (v2.Y - v1.Y)*ratio;
        return Vec;
    }

    static get Zero() {
        return new Vector2(0,0);
    }
}


export class Color {
    R;
    G;
    B;

    constructor(r,g,b) {
        this.R = r;
        this.G = g;
        this.B = b;
    }

    static Lerp(v1, v2, ratio) {
        let Col = new Color(0,0,0);
        col.R = v1.R + (v2.R - v1.R)*ratio;
        col.G = v1.G + (v2.G - v1.G)*ratio;
        col.B = v1.B + (v2.B - v1.B)*ratio;
        return Col;
    }

    static get White() {
        return new Color(255,255,255);
    }
}

export class TransformState {
    Color;
    Position;
    Size;
    Alpha;
    Rotation;

    Time;

    constructor(Color, Position, Size, Alpha, Rotation, Time) {
        this.Color = Color;
        this.Position = Position;
        this.Size = Size;
        this.Alpha = Alpha;
        this.Rotation = Rotation;
        this.Time = Time;
    }
    static get Empty() { //For Lerping purpose
        let Color = undefined;
        let Position = undefined;
        let Size = undefined;
        let Alpha = undefined;
        let Rotation = undefined;
        let Time = undefined;

        return new TransformState(Color, Position, Size, Alpha, Rotation, Time)
    }
    
}

export class Transform {
    State1;
    State2;

    constructor(State1, State2) {
        this.State1 = State1;
        this.State2 = State2;
    }

    CalcFrame(current) {
        let ratio;
        let t2 = this.State2.Time;
        let t1 = this.State1.Time;

        if (t2-t1 != 0) {
            ratio = (current-t1) / (t2-t1);
        }
        else {
            return this.State2;
        }

        let state = TransformState.Empty;
        state.Color = (this.State1.Color != undefined && this.State2.Color != undefined) ? Color.Lerp(this.State1.Color, this.State2.Color, ratio) : undefined;
        state.Position = (this.State1.Position != undefined && this.State2.Position != undefined) ?  Vector2.Lerp(this.State1.Position, this.State2.Position, ratio): undefined;
        state.Size = (this.State1.Size != undefined && this.State2.Size != undefined) ?  Vector2.Lerp(this.State1.Size, this.State2.Size, ratio): undefined;
        state.Alpha = (this.State1.Alpha != undefined && this.State2.Alpha != undefined) ?  Lerp(this.State1.Alpha, this.State2.Alpha, ratio): undefined;
        state.Rotation = (this.State1.Rotation != undefined && this.State2.Rotation != undefined) ?  Lerp(this.State1.Rotation, this.State2.Rotation, ratio): undefined;
        state.Time = current;
        return state;
    }
}