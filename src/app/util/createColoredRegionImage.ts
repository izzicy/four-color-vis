import * as _ from 'lodash-es';
import { COLOR_1, COLOR_2, COLOR_3, COLOR_4, NO_COLOR } from './createFourColorSolver';

export function createColoredRegionImage(pixels: Uint8ClampedArray, regionMap: Map<number, Int32Array>, colorMap: Map<number, number>, width: number, height: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const imageData = new ImageData(pixels.slice(), width, height);

    canvas.width = width;
    canvas.height = height;

    for (const [regionMark, indexes] of regionMap.entries()) {
        const color = colorMap.get(regionMark) ?? NO_COLOR;

        for (const index of indexes) {
            const i = index * 4;

            if (color & COLOR_1) {
                imageData.data[i + 0] = 0;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = 255;
            } else if (color & COLOR_2) {
                imageData.data[i + 0] = 255;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = 255;
            } else if (color & COLOR_3) {
                imageData.data[i + 0] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255;
            } else if (color & COLOR_4) {
                imageData.data[i + 0] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = 255;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const img = new Image();

    img.src = canvas.toDataURL();

    return new Promise<HTMLImageElement>((resolve) => {
        img.onload = () => {
            resolve(img);
        };
    });
}
