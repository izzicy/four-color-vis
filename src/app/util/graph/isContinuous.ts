import { uniq } from 'lodash-es';
import { Graph } from './graph';
import { markTrees } from './markTrees';

export function isContinuous<G extends Graph<T>, T>(graph: G): boolean {
    return uniq(Array.from(markTrees(graph).values())).length === 1;
}
