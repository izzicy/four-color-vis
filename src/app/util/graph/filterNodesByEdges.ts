import { filter } from 'lodash-es';

export function filterNodesByEdges<T, E>(nodes: T[], edges: E[][], toEdge: (node: T) => E) {
    const edgedSet = new Set<E>();

    edges.forEach(edge => edgedSet.add(edge[0]).add(edge[1]));

    return filter(nodes, node => edgedSet.has(toEdge(node)));
}
