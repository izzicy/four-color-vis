import { toIndex } from './toIndex';
import { toX } from './toX';
import { toY } from './toY';

export function createImageSectionMarkings(pixels: Uint8ClampedArray, width: number, height: number) {
    const marker = new Marker(pixels, width, height);
    let marking = 0;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if ( ! marker.isVisited(x, y) && marker.isPixelWhite(x, y)) {
                marker.mark(x, y, marking);
                marking++;
            }
        }
    }

    return {
        markings: marker.getMarkings(),
        boundaries: marker.getBoundaries(),
    };
}

class Marker {
    protected pixels;
    protected width;
    protected height;
    protected visited;
    protected marking;
    protected boundaries;

    public constructor(
        pixels: Uint8ClampedArray,
        width: number,
        height: number,
    ) {
        this.pixels = pixels;
        this.width = width;
        this.height = height;
        this.visited = new Int8Array(height * width);
        this.marking = new Int16Array(height * width).fill(-1);
        this.boundaries = new Int16Array(height * width).fill(-1);
    }

    public mark(x: number, y: number, marking: number) {
        const index = toIndex(x, y, this.width);
        const queue = [index];

        this.visited[index] = 1;
        this.marking[index] = marking;

        while (queue.length > 0) {
            const node = queue.shift();
            const qx = toX(node, this.width);
            const qy = toY(node, this.width);

            for (const [dx, dy] of directions) {
                const nx = qx + dx;
                const ny = qy + dy;
                const neighbor = toIndex(nx, ny, this.width);

                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && ! this.visited[neighbor]) {
                    if (this.isPixelWhite(nx, ny)) {
                        this.visited[neighbor] = 1;
                        this.marking[neighbor] = marking;
                        queue.push(neighbor);
                    } else {
                        this.visited[neighbor] = 1;
                        this.boundaries[neighbor] = marking;
                    }
                }
            }
        }
    }

    public isVisited(x: number, y: number) {
        return this.visited[toIndex(x, y, this.width)];
    }

    public getMarkings() {
        return this.marking;
    }

    public getBoundaries() {
        return this.boundaries;
    }

    public isPixelWhite(x: number, y: number) {
        const pixels = this.pixels;
        const index = toIndex(x, y, this.width) * 4;

        return (
            (
                pixels[index] > 240
                && pixels[index + 1] > 240
                && pixels[index + 2] > 240
            ) || pixels[index + 3] < 10
        );
    }
}

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];
