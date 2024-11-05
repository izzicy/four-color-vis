import { dfs } from './dfs';
import { Graph } from './graph';

export function topologicalSort<G extends Graph<T>, T>(graph: G) {
    const stack: Array<number> = [];
    const visited = new Set<number>();
    const nodes = graph.getNodes();

    for (let i = 0; i < nodes.length; i++) {
        if( ! visited.has(i)) {
            dfs(graph, i, visited, stack);
        }
    }

    return stack.reverse();
}
