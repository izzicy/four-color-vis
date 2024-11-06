import { hexToRgb } from '../hexToRgb';

export function drawRegionColor(imageData: ImageData, pixels: Uint8ClampedArray, regionIndexes: Int32Array, color: string | 'UNSET') {


    for (const index of indexes) {
        const i = index * 4;

        if (color === 'UNSET') {
            imageData.data[i + 0] = 0;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
        }

        imageData.data[i + 0] = 0;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = 255;

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
