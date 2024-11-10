import { uniq } from 'lodash-es';
import { toX } from './toX';
import { toY } from './toY';
import { toIndex } from './toIndex';

export function resolveCenterPointsFromRegions(regions: Int32Array, regionMap: Map<number, Int32Array>, width: number) {
    const distances = new Int32Array(regions.length).fill(-1);
    const marks = uniq(regions);
    const centerPoints = new Map<number, number>();

    for (const mark of marks) {
        centerPoints.set(
            mark,
            getCenterPointOfRegions(regions, (regionMap.get(mark) ?? new Int32Array()), distances, mark, width),
        );
    }

    return centerPoints;

}

function getCenterPointOfRegions(regions: Int32Array, regionMap: Int32Array, distances: Int32Array, relevantMark: number, width: number) {
    const queue = [];

    for (const index of regionMap) {
        const x = toX(index, width);
        const y = toY(index, width);

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const neighbor = toIndex(nx, ny, width);

            if (regions[neighbor] !== relevantMark) {
                distances[index] = 0;
                queue.push(index);
                break;
            }
        }
    }

    while (queue.length > 0) {
        const node = queue.shift();
        const x = toX(node, width);
        const y = toY(node, width);

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const neighbor = toIndex(nx, ny, width);
            const neighborMark = regions[neighbor];

            if (neighborMark === relevantMark && distances[neighbor] === -1) {
                distances[neighbor] = distances[node] + 1;
                queue.push(neighbor);
            }
        }
    }

    let maxDistance = -1;
    let centerPoint = -1;

    for (const index of regionMap) {
        if (distances[index] > maxDistance) {
            maxDistance = distances[index];
            centerPoint = index;
        }
    }

    return centerPoint;
}

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];
