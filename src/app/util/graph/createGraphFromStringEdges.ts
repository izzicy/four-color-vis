import { map, reduce } from 'lodash-es';
import { Graph } from './graph';

export function createGraphFromStringEdges<T>(nodes: T[], edges: string[][], toString: (node: T) => string): Graph<T> {
    const nodeIndexMap = mapNodeIndexes(nodes, toString);
    const graph = new Graph(nodes);

    graph.addMultipleEdges(
        map(edges, (edge) => [<number>nodeIndexMap.get(edge[0]), <number>nodeIndexMap.get(edge[1])])
    );

    return graph;
}

export function mapNodeIndexes<T>(nodes: T[], toString: (node: T) => string) {
    return reduce(nodes, (carry, node, index) => {
        carry.set(toString(node), index);

        return carry;
    }, new Map<string, number>());
}
