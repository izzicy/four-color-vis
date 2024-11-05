import { Graph } from './graph';
import { topologicalSort } from './topologicalSort';

export function markTrees<G extends Graph<T>, T>(graph: G) {
    const visited = new Set<number>();
    const sections = new Map<number, number>();
    const nodes = topologicalSort(graph);
    let sectionId = 0;

    for (const node of nodes) {
        if ( ! visited.has(node)) {
            sectionId++;
            dfsSectioning(graph, node, visited, sectionId, sections);
        }
    }

    return sections;
}

function dfsSectioning<G extends Graph<T>, T>(graph: G, node: number, visited: Set<number>, sectionId: number, sections: Map<number, number>) {
    visited.add(node);
    sections.set(node, sectionId);

    for (const neighbor of (graph.getEdges().get(node) || [])) {
        if( ! visited.has(neighbor)) {
            dfsSectioning(graph, neighbor, visited, sectionId, sections);
        }
    }
}
