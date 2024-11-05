export default function resolveNodesFromEdges<E>(edges: E[][]): E[] {
    const set = new Set<E>();

    edges.forEach(e => set.add(e[0]).add(e[1]));

    return Array.from(set.values());
}
