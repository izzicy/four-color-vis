import { toX } from './toX';
import { toY } from './toY';

export function createGraphImage(nodes: Map<number, number>, edges: Map<number, Set<number>>, width: number, height: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'red';

    for (const [mark, index] of nodes.entries()) {
        for (const edge of (edges.get(mark) ?? [])) {
            const edgeIndex = nodes.get(edge);

            ctx.beginPath();
            ctx.moveTo(
                toX(index, width),
                toY(index, width),
            );
            ctx.lineTo(
                toX(edgeIndex, width),
                toY(edgeIndex, width),
            );
            ctx.stroke();
        }
    }

    for (const [mark, index] of nodes.entries()) {
        ctx.beginPath();
        ctx.arc(
            toX(index, width),
            toY(index, width),
            3,
            0,
            2 * Math.PI,
        );
        ctx.fill();
    }

    const img = new Image();

    img.src = canvas.toDataURL();

    return new Promise<HTMLImageElement>((resolve) => {
        img.onload = () => {
            resolve(img);
        };
    });
}
