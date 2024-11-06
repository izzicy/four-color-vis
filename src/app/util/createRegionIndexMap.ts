import { countBy } from 'lodash-es';

export function createRegionIndexMap(regions: Int16Array): Map<number, Int32Array> {
    const indexMap = new Map<number, Int32Array>();
    const counts = countBy(regions);
    const regionCounts = new Map<number, number>();

    for (const index in counts) {
        regionCounts.set(
            Number(index),
            counts[index],
        );
    }

    const regionMarks = Array.from(regionCounts.keys());

    for (const mark of regionMarks) {
        indexMap.set(mark, new Int32Array(regionCounts.get(mark) ?? 0));
    }

    const mapIndexPerRegion: Record<number, number> = {};

    for (let i = 0; i < regions.length; i++) {
        const mark = regions[i];

        if ( ! mapIndexPerRegion[mark]) {
            mapIndexPerRegion[mark] = 0;
        }

        const map = indexMap.get(mark);

        if (map) {
            map[mapIndexPerRegion[mark]] = i;
        }

        mapIndexPerRegion[mark]++;
    }

    return indexMap;
}
