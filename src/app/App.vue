<script setup lang="ts">
import { computedAsync, useFileDialog } from '@vueuse/core';
import { loadImageData } from './util/loadImageData';
import { createImageRegions } from './util/createImageRegions';
import { createImageFromRegions } from './util/createImageFromRegions';
import { resolveCenterPointsFromRegions } from './util/resolveCenterPointsFromRegions';
import { createGraphImage } from './util/createGraphImage';
import { computed, ref, watchEffect } from 'vue';
import { resolveEdgesFromRegions } from './util/resolveEdgesFromRegions';
import { createRegionIndexMap } from './util/createRegionIndexMap';
import { createFourColorSolver } from './util/createFourColorSolver';
import { createColoredRegionImage } from './util/createColoredRegionImage';

const url1 = ref('');
const url2 = ref('');
const url3 = ref('');
const url4 = ref('');

const { files, open } = useFileDialog({
    accept: 'image/*', // Set to accept only image files
    multiple: false,
});

const imageAndPixels = computedAsync(async () => files.value && await loadImageData(files.value[0]));
const image = computed(() => imageAndPixels.value?.image);
const pixels = computed(() => imageAndPixels.value?.pixels);

watchEffect(async () => {
    if ( ! (image.value && pixels.value)) {
        return;
    }

    const width = image.value.width;
    const height = image.value.height;

    const {
        regions,
        boundaries,
    } = createImageRegions(pixels.value, width, height);

    const regionMap = createRegionIndexMap(regions);

    const centerPoints = resolveCenterPointsFromRegions(regions, regionMap, width);
    const edges = resolveEdgesFromRegions(regions, boundaries, width, height);
    const colorMap = createFourColorSolver({
        edges,
    });

    centerPoints.delete(-1);
    centerPoints.delete(0);

    url1.value = (await createImageFromRegions(regions, width, height)).src;
    url2.value = (await createImageFromRegions(boundaries, width, height)).src;
    url3.value = (await createGraphImage(centerPoints, edges, width, height)).src;
    url4.value = (await createColoredRegionImage(pixels.value, regionMap, colorMap, width, height)).src;
});
</script>

<template>
    <div>
        <button type="button" @click="() => open()">
            Choose file
        </button>
        <img :src="url1" alt="">
        <img :src="url2" alt="">
        <img :src="url3" alt="">
        <img :src="url4" alt="">
    </div>
</template>
