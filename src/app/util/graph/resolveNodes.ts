import { map } from 'lodash-es';
import { Graph } from './graph';

export function resolveNodes<G extends Graph, T extends (G extends Graph<infer S> ? S : never)>(graph: G, positionList: number[]): T[] {
    const nodes = graph.getNodes();

    return map(positionList, pos => nodes[pos]);
}
