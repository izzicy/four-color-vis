import { filter } from 'lodash-es';

export function filterNodesByStringEdges<T>(nodes: T[], edges: string[][], toString: (node: T) => string) {
    const edgedSet = new Set<string>();

    edges.forEach(edge => edgedSet.add(edge[0]).add(edge[1]));

    return filter(nodes, node => edgedSet.has(toString(node)));
}
