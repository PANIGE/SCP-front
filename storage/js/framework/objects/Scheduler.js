export class Scheduler {

    Tasks;
    constructor() {
        this.Tasks = [];
    }


    Update() {
        let Expired = []
        this.Tasks.forEach(s => {
            if (s.Time < Date.now() && s.Done) {
                return Expired.push(s);
            }
            else if (s.Time < Date.now() && !s.Done) {
                s.Done = true;
                if (s.Async)
                    setTimeout(s.Delegate, 0);
                else
                    s.Delegate();
                
            }
        })
    }

    Clear() {
        this.Tasks = [];
    }

    Add(delegate, async=false) {
        this.Tasks.push(new Task(delegate, Date.now(), async));
    }

    AddDelayed(delegate, time, async=false) {
        this.Tasks.push(new Task(delegate, Date.now()+time, async));
    }

}

export class Task {
    Time;
    Delegate;
    Done;
    Async;
    constructor(delegate, time, async) {
        this.Time = time;
        this.Delegate = delegate;
        this.Done = false;
        this.Async = async;
    }
}
