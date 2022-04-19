


export class GraphNode {
    Position;
    Connectors;
    constructor(Position) {
        this.Connectors = [];
        this.Position = Position;
    }

    Add(Node) {
        this.Connectors.push(Node);
    }
}