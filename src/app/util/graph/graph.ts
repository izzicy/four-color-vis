export class Graph<T = any> {
    protected nodes;
    protected adjList;

    public constructor(nodes: T[]) {
        this.nodes = nodes;
        this.adjList = new Map<number, number[]>();

        for (let i = 0; i < nodes.length; i++) {
            this.adjList.set(i, []);
        }
    }

    public addMultipleEdges(edges: number[][]) {
        for(let edge of edges) {
            this.addEdge(edge[0], edge[1]);
        }
    }

    public addEdge(startNode: number, endNode: number) {
        this.adjList.get(startNode)?.push(endNode);
    }

    public getNodes() {
        return this.nodes;
    }

    public getEdges() {
        return this.adjList;
    }
}
