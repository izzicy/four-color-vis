import { toIndex } from './toIndex';
import { toX } from './toX';
import { toY } from './toY';

export function resolveEdgesFromMarkings(markings: Int16Array, boundaries: Int16Array, width: number, height: number) {
    const edgeResolver = new EdgeResolver(markings, boundaries, width, height);
    const edges = new Map<number, Set<number>>();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if ( ! edgeResolver.isVisited(x, y) && markings[toIndex(x, y, width)] >= 0) {
                edgeResolver.resolve(x, y, edges);
            }
        }
    }

    return edges;
}

class EdgeResolver {
    protected markings;
    protected boundaries;
    protected pixels;
    protected width;
    protected height;
    protected visited;

    public constructor(
        markings: Int16Array,
        boundaries: Int16Array,
        width: number,
        height: number,
    ) {
        this.markings = markings;
        this.boundaries = boundaries;
        this.width = width;
        this.height = height;
        this.visited = new Int8Array(height * width);
    }

    public resolve(x: number, y: number, edges: Map<number, Set<number>>) {
        const index = toIndex(x, y, this.width);
        const queue = [index];

        this.visited[index] = 1;

        while (queue.length > 0) {
            const node = queue.shift();
            const nodeMark = this.markings[node];
            const qx = toX(node, this.width);
            const qy = toY(node, this.width);

            for (const [dx, dy] of directions) {
                const nx = qx + dx;
                const ny = qy + dy;
                const neighbor = toIndex(nx, ny, this.width);

                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && ! this.visited[neighbor]) {
                    const boundaryMark = this.boundaries[neighbor];

                    if (boundaryMark >= 0 && nodeMark !== boundaryMark) {
                        if ( ! edges.has(nodeMark)) {
                            edges.set(nodeMark, new Set());
                        }

                        edges.get(nodeMark).add(boundaryMark);
                    }

                    if (this.markings[neighbor] >= 0) {
                        queue.push(neighbor);
                        this.visited[neighbor] = 1;
                    }
                }
            }
        }
    }

    public isVisited(x: number, y: number) {
        return this.visited[toIndex(x, y, this.width)];
    }
}

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];