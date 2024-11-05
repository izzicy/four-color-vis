export async function loadImageData(file: File) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fr = new FileReader();

    return new Promise<{
        image: HTMLImageElement;
        pixels: Uint8ClampedArray;
    }>((resolve) => {
        fr.onload = () => {
            const image = new Image;

            image.src = String(fr.result);

            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                resolve({
                    image,
                    pixels,
                });
            };
        };
        fr.readAsDataURL(file);
    });
}
