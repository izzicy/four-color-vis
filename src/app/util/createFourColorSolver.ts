import { every } from 'lodash-es';
import { createNanoEvents, Emitter } from 'nanoevents';

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
    stepDelay?: number;
    edges: Map<number, Set<number>>;
};

export function createFourColorSolver(options: CreateFourColorSolverOptions) {
    const {
        stepDelay = 0,
        edges,
    } = options;

    const emitter = createNanoEvents();
    const regionMarks = Array.from(edges.keys());
    const solver = new FourColorSolver(
        regionMarks,
        edges,
        emitter,
    );

    solver.solve();

    return solver.getColors();
}

class FourColorSolver {
    protected regionMarks;
    protected edges;
    protected emtiter;
    protected colors = new Map<number, number>();

    public constructor(
        regionMarks: number[],
        edges: Map<number, Set<number>>,
        emtiter: Emitter,
    ) {
        this.regionMarks = regionMarks;
        this.edges = edges;
        this.emtiter = emtiter;
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
