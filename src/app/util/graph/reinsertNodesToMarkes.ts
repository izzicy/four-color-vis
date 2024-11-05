import { Graph } from './graph';

export function reinsertNodesToMarkes<G extends Graph, T extends (G extends Graph<infer S> ? S : never), M>(graph: G, markings: Map<number, M>): Map<T, M> {
    const nodes = graph.getNodes();
    const newMap = new Map<T, M>();

    markings.forEach((value, key) => {
        newMap.set(nodes[key], value);
    });

    return newMap;
}
