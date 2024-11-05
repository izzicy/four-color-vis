import { uniq } from 'lodash-es';
import { toX } from './toX';
import { toY } from './toY';
import { toIndex } from './toIndex';

export function resolveCenterPointsFromMarkings(markings: Int16Array, width: number, height: number) {
    const distances = new Int32Array(markings.length).fill(-1);
    const marks = uniq(markings);
    const centerPoints = new Map<number, number>();

    for (const mark of marks) {
        centerPoints.set(
            mark,
            getCenterPointOfMarking(markings, distances, mark, width),
        );
    }

    return centerPoints;

}

function getCenterPointOfMarking(markings: Int16Array, distances: Int32Array, relevantMark: number, width: number) {
    const queue = [];
    const indicesInSection = [];

    for (let i = 0; i < markings.length; i++) {
        if (markings[i] === relevantMark) {
            indicesInSection.push(i);
        }
    }

    for (const index of indicesInSection) {
        const x = toX(index, width);
        const y = toY(index, width);

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const neighbor = toIndex(nx, ny, width);

            if (markings[neighbor] !== relevantMark) {
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
            const neighborMark = markings[neighbor];

            if (neighborMark === relevantMark && distances[neighbor] === -1) {
                distances[neighbor] = distances[node] + 1;
                queue.push(neighbor);
            }
        }
    }

    let maxDistance = -1;
    let centerPoint = null;

    console.log(indicesInSection, distances);

    for (const index of indicesInSection) {
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