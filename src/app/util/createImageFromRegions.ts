import * as _ from 'lodash-es';

export function createImageFromRegions(regions: Int32Array, width: number, height: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    canvas.width = width;
    canvas.height = height;

    const maxValue = _.max(regions);

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (regions[i / 4] === -1) {
            imageData.data[i + 0] = 0;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = 255;
        } else {
            const weight = 255 * (regions[i / 4] / maxValue);

            imageData.data[i + 0] = weight;
            imageData.data[i + 1] = 127;
            imageData.data[i + 2] = 127;
            imageData.data[i + 3] = 255;
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
