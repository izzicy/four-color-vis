import { Graph } from './graph';

export function dfs<G extends Graph<T>, T>(graph: G, node: number, visited: Set<number>, stack: Array<number>) {
    visited.add(node);

    for(const neighbor of (graph.getEdges().get(node) || [])) {
        if( ! visited.has(neighbor)) {
            dfs(graph, neighbor, visited, stack);
        }
    }

    stack.push(node);
}
