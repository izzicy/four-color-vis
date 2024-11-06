import { promiseTimeout } from '@vueuse/core';
import { every } from 'lodash-es';
import { createNanoEvents, Emitter } from 'nanoevents';
import { MaybeRefOrGetter, toValue } from 'vue';

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
    stepDelay?: MaybeRefOrGetter<number>;
    emitter?: Emitter;
    edges: Map<number, Set<number>>;
};

export function createFourColorSolver(options: CreateFourColorSolverOptions) {
    const {
        stepDelay = 0,
        emitter = createNanoEvents(),
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
        this.dfs(0);
    }

    public getColors() {
        return this.colors;
    }

    protected dfs(mark: number): boolean {
        const edges = Array.from((this.edges.get(mark) ?? []));
        let available = ALL_COLORS;

        for (const edge of edges) {
            available &= ~(this.colors.get(edge) ?? NO_COLOR);
        }

        for (const color of COLORS) {
            if (color & available) {
                this.colors.set(mark, color);

                if (every(edges, (edge) => this.colors.has(edge) || this.dfs(edge))) {
                    return true;
                }

                this.colors.delete(mark);
            }
        }

        return false;
    }
}

class AsyncFourColorSolver {
    protected regionMarks;
    protected edges;
    protected emitter;
    protected colors = new Map<number, number>();
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
        await this.dfs(0);
    }

    public getColors() {
        return this.colors;
    }

    protected async dfs(mark: number): Promise<boolean> {
        const edges = Array.from((this.edges.get(mark) ?? []));
        let available = ALL_COLORS;

        for (const edge of edges) {
            available &= ~(this.colors.get(edge) ?? NO_COLOR);
        }

        for (const color of COLORS) {
            if (color & available) {
                await promiseTimeout(toValue(this.stepDelay));

                this.colors.set(mark, color);
                this.emitter.emit('color-set', {
                    mark,
                    color,
                });

                if (await this.forEveryEdge(edges)) {
                    return true;
                }

                await promiseTimeout(toValue(this.stepDelay));

                this.colors.delete(mark);
                this.emitter.emit('color-unset', {
                    mark,
                });
            }
        }

        return false;
    }

    protected async forEveryEdge(edges: number[]): Promise<boolean> {
        let everyTrue = true;

        for (const edge of edges) {
            if ((this.colors.has(edge) || await this.dfs(edge)) === false) {
                everyTrue = false;
                continue;
            }
        }

        return everyTrue;
    }
}
