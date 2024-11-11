import { promiseTimeout } from '@vueuse/core';
import { each, every, first } from 'lodash-es';
import { createNanoEvents, Emitter } from 'nanoevents';
import { MaybeRefOrGetter, toValue, unref } from 'vue';

export const NO_COLOR = 0;
export const COLOR_1 = 1 << 0;
export const COLOR_2 = 1 << 1;
export const COLOR_3 = 1 << 2;
export const COLOR_4 = 1 << 3;
export const ALL_COLORS = COLOR_1 | COLOR_2 | COLOR_3 | COLOR_4;
export const COLORS = [
    COLOR_1,
    COLOR_2,
    COLOR_3,
    COLOR_4,
];

export type CreateFourColorSolverOptions = {
    edges: Map<number, Set<number>>;
};

export function createFourColorSolver(options: CreateFourColorSolverOptions) {
    const {
        edges,
    } = options;

    const regionMarks = Array.from(edges.keys());
    const solver = new FourColorSolver(
        regionMarks,
        edges,
    );

    solver.solve();

    return solver.getColors();
}

class FourColorSolver {
    protected regionMarks;
    protected edges;
    protected colors = new Map<number, number>();

    public constructor(
        regionMarks: number[],
        edges: Map<number, Set<number>>,
    ) {
        this.regionMarks = regionMarks;
        this.edges = edges;
    }

    public solve() {
        this.dfs();
    }

    public getColors() {
        return this.colors;
    }

    protected dfs() {
        const currentColors = new Int8Array(this.regionMarks.length).fill(-1);
        let stackIndex = 0;

        while (stackIndex < this.regionMarks.length) {
            const mark = this.regionMarks[stackIndex];
            let available = ALL_COLORS;

            for (const edge of (this.edges.get(mark) ?? [])) {
                available &= ~(this.colors.get(edge) ?? NO_COLOR);
            }

            const colorIndex = currentColors[stackIndex] + 1;

            if (colorIndex + 1 > COLORS.length) {
                this.colors.delete(mark);

                currentColors[stackIndex] = -1;
                stackIndex--;
            } else if (COLORS[colorIndex] & available) {
                this.colors.set(mark, COLORS[colorIndex]);

                stackIndex++;
            }
        }
    }
}
