import { promiseTimeout } from '@vueuse/core';
import { each, every, first } from 'lodash-es';
import { createNanoEvents, Emitter } from 'nanoevents';
import { MaybeRefOrGetter, reactive, toValue, unref } from 'vue';

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

export type CreateAsyncFourColorSolverOptions = {
    stepDelay?: MaybeRefOrGetter<number>;
    emitter?: Emitter;
    edges: Map<number, Set<number>>;
};

export function createAsyncFourColorSolver(options: CreateAsyncFourColorSolverOptions) {
    const {
        stepDelay = 0,
        emitter = createNanoEvents(),
        edges,
    } = options;

    const regionMarks = Array.from(edges.keys());
    const solver = new AsyncFourColorSolver(
        regionMarks,
        edges,
        emitter,
        stepDelay,
    );

    return {
        colors: solver.getColors(),
        emitter,
        solve: () => solver.solve(),
    };
}

class AsyncFourColorSolver {
    protected regionMarks;
    protected edges;
    protected emitter;
    protected colors = reactive(new Map<number, number>());
    protected stepDelay;

    public constructor(
        regionMarks: number[],
        edges: Map<number, Set<number>>,
        emitter: Emitter,
        stepDelay: MaybeRefOrGetter<number>,
    ) {
        this.regionMarks = regionMarks;
        this.edges = edges;
        this.emitter = emitter;
        this.stepDelay = stepDelay;
    }

    public async solve() {
        await promiseTimeout(toValue(this.stepDelay));
        await this.dfs();
    }

    public getColors() {
        return this.colors;
    }

    protected async dfs() {
        const currentColors = new Int8Array(this.regionMarks.length).fill(-1);
        let stackIndex = 0;

        while (stackIndex < this.regionMarks.length) {
            const mark = this.regionMarks[stackIndex];
            const edges = Array.from((this.edges.get(mark) ?? []));
            let available = ALL_COLORS;

            for (const edge of edges) {
                available &= ~(this.colors.get(edge) ?? NO_COLOR);
            }

            const colorIndex = currentColors[stackIndex] >= 0 ? currentColors[stackIndex] + 1 : 0;

            currentColors[stackIndex] = colorIndex;

            if (colorIndex + 1 > COLORS.length) {
                this.colors.delete(mark);
                this.emitter.emit('unset-color', { mark });

                await promiseTimeout(toValue(this.stepDelay));

                currentColors[stackIndex] = -1;
                stackIndex--;
            } else if (COLORS[colorIndex] & available) {
                this.colors.set(mark, COLORS[colorIndex]);
                this.emitter.emit('set-color', { mark, color: COLORS[colorIndex] });

                await promiseTimeout(toValue(this.stepDelay));

                stackIndex++;
            }
        }
    }
}
