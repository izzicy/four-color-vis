import { Graph } from './graph';

export function isCyclic<G extends Graph<T>, T>(graph: G): boolean {
    const visited = new Set<number>();
    const recStack = new Set<number>();
    const nodes = graph.getNodes();

    for (let i = 0; i < nodes.length; i++) {
        if ( ! visited.has(i) && isCyclicDfs<G, T>(graph, i, visited, recStack)) {
            return true;
        }
    }

    return false;
}

function isCyclicDfs<G extends Graph<T>, T>(graph: G, node: number, visited: Set<number>, recStack: Set<number>) {
    visited.add(node);
    recStack.add(node);

    for (const neighbor of (graph.getEdges().get(node) || [])) {
        if ( ! visited.has(neighbor) && isCyclicDfs(graph, neighbor, visited, recStack)) {
            return true;
        } else if (recStack.has(neighbor)) {
            return true;
        }
    }

    recStack.delete(node);

    return false;
}
