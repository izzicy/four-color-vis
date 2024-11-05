import { map, reduce } from 'lodash-es';
import { Graph } from './graph';

export function createGraphFromNodeEdges<T>(nodes: T[], edges: T[][]): Graph<T> {
    const nodeIndexMap = mapNodeIndexes(nodes);
    const graph = new Graph(nodes);

    graph.addMultipleEdges(
        map(edges, (edge) => [<number>nodeIndexMap.get(edge[0]), <number>nodeIndexMap.get(edge[1])])
    );

    return graph;
}

export function mapNodeIndexes<T>(nodes: T[]) {
    return reduce(nodes, (carry, node, index) => {
        carry.set(node, index);

        return carry;
    }, new Map<T, number>);
}
