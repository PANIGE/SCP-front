import {GameBase} from "/storage/js/framework/GameBase.js";
import {Vector2, Color, Transform, TransformState} from "/storage/js/framework/data.js";

export class Drawable {
    Position; // Vector2
    Size; // Vector2

    Depth; // Float
    
    Rotation; // Float 0 => 360

    Alpha; // Float 0 => 1;

    Color; // Color

    Transforms; // Tansforms list

    Parent; // Transform list

    isHovered;

    BlocksHover;

    AlwaysPresent; //Blocks Object Container Streaming


    get Scheduler() {
        return GameBase.Instance.Scheduler;
    }

    get EffectivePosition() { //Get the effective position of the drawable in the field
        if (this.Parent == null) {
            return this.Position;
        }
        return new Vector2(this.Parent.EffectivePosition.X + this.Position.X, 
            this.Parent.EffectivePosition.Y + this.Position.Y)
    }

/* -------------------------------------------------------------------------- */
/*                             Transforms section                             */
/* -------------------------------------------------------------------------- */
//They follow the same scheme, it use the current state, create a new empty
//apply the wanted transform, and add it to the transform list

    MoveTo(pos, time) {
        let current = this.CurrentTransformState;
        let future = TransformState.Empty;
        future.Position = pos;
        future.Time = Date.now() + time;
        let transform = new Transform(current, future);
        this.Transforms.push(transform);
    }

    RotateTo(angle, time) {
        let current = this.CurrentTransformState;
        let future = TransformState.Empty;
        future.Rotation = angle;
        future.Time = Date.now() + time;
        let transform = new Transform(current, future);
        this.Transforms.push(transform);
    }

    FadeTo(alpha, time) {
        let current = this.CurrentTransformState;
        let future = TransformState.Empty;
        future.Alpha = alpha;
        future.Time = Date.now() + time;
        let transform = new Transform(current, future);
        this.Transforms.push(transform);
    }

    FadeOutFromOne(time) {
        this.Alpha = 1;
        this.FadeTo(0, time);
    }

    FadeInFromZero(time) {
        this.Alpha = 0;
        this.FadeTo(1, time);
    }

    SizeTo(size, time) {
        let current = this.CurrentTransformState;
        let future = TransformState.Empty;
        future.Size = size;
        future.Time = Date.now() + time;
        let transform = new Transform(current, future);
        this.Transforms.push(transform);
    }


    ClearTransforms() {
        this.Transforms = [];
    }

    FinishTransforms() { //Put all transforms to their final state and clear
        
        this.Transforms.forEach(s => {
            Object.keys(s.State2).forEach(v => {
                if (s.State2[v] != undefined && v != "Time") {
                    this[v] = s.State2[v];
                }
            });
        });
        this.ClearTransforms()
    }

    get CurrentTransformState() {
       return new TransformState(this.Color, this.Position, this.Size, this.Alpha, this.Rotation, Date.now());
    }

    /* ------------------------------- Constructor ------------------------------ */

    constructor(Position, Size, Depth, Rotation, Alpha, Color) {
        this.Position = Position;
        this.Size = Size;
        this.Depth = Depth;
        this.Rotation = Rotation;
        this.Alpha = Alpha;
        this.Color = Color;
        this.Transforms = [];
        this.Parent = undefined;
        this.isHovered = false;
        this.BlocksHover = false;
    }
    
    Update() {
        //Empty for drawable since it's a base class
    }

    Load() {
        //Empty for drawable since it's a base class
    }

    OnClick() {
        return false; // False = Continue propagation, True = stop propagation
    }

    OnHover() {
        //Empty for drawable since it's a base class
    }

    OnHoverLost() {
        //Empty for drawable since it's a base class
    }

    Draw(cat="div") {
        this.ApplyTransforms();
        //Calculate if the drawable is outside the screen, if so, cancel drawing, that's called Object Container Streaming (OCS)
        if (((this.EffectivePosition.X > 1920 || this.EffectivePosition.X + this.Size.X < 0)
        ||
        (this.EffectivePosition.Y - this.Size.Y > 1080 || this.EffectivePosition.Y + this.Size.Y < 0)) && !this.AlwaysPresent) {
            return;
        }

        
        let element = document.createElement(cat);
        element.ondragstart = () => { return false; };
        if (this.Parent == undefined) 
            GameBase.Instance.Canvas.appendChild(element);
        
        element.style.height = this.Size.Y * GameBase.Instance.GetRatioMultiplier() + "px";
        element.style.width = this.Size.X * GameBase.Instance.GetRatioMultiplier() + "px";

        element.style.position = "absolute";
        
        element.style.top = this.Position.Y * GameBase.Instance.GetRatioMultiplier() + "px";
        element.style.left = this.Position.X * GameBase.Instance.GetRatioMultiplier() + "px";
        
        element.style.opacity = this.Alpha;
        element.style.transform = "rotate(" + this.Rotation + "deg)";

        return element;
    }

    ApplyTransforms() {
        let toRemove = [];
        this.Transforms.forEach(s => {
            if (s.State1.Time > Date.now()) {
                return; //Do not do anything about transforms that aren't active yet
            }
            if (s.State2.Time < Date.now()) {
                toRemove.push(s) //Remove expired transforms but apply them
            }
            let state = s.CalcFrame(Date.now());
            Object.keys(state).forEach(v => {
                if (state[v] != undefined && v != "Time") {
                    this[v] = state[v];
                }
            });
        });

        toRemove.forEach(s => this.Transforms.splice(this.Transforms.indexOf(s), 1))
    }


}