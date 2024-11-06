<script setup lang="ts">
import { useFileDialog } from '@vueuse/core';
import { loadImageData } from './util/loadImageData';
import { createImageRegions } from './util/createImageRegions';
import { createImageFromRegions } from './util/createImageFromRegions';
import { resolveCenterPointsFromRegions } from './util/resolveCenterPointsFromRegions';
import { createGraphImage } from './util/createGraphImage';
import { ref } from 'vue';
import { resolveEdgesFromRegions } from './util/resolveEdgesFromRegions';
import { createRegionIndexMap } from './util/createRegionIndexGroups';

const url1 = ref('');
const url2 = ref('');
const url3 = ref('');

const { files, open, reset, onCancel, onChange } = useFileDialog({
    accept: 'image/*', // Set to accept only image files
    multiple: false,
});

onChange(async (files) => {
    if (files && files[0]) {
        const {
            image,
            pixels,
        } = await loadImageData(files[0]);

        const {
            regions,
            boundaries,
        } = createImageRegions(pixels, image.width, image.height);

        const regionMap = createRegionIndexMap(regions);

        const centerPoints = resolveCenterPointsFromRegions(regions, regionMap, image.width);
        const edges = resolveEdgesFromRegions(regions, boundaries, image.width, image.height);

        centerPoints.delete(-1);

        console.log(centerPoints, edges);

        url1.value = (await createImageFromRegions(regions, image.width, image.height)).src;
        url2.value = (await createImageFromRegions(boundaries, image.width, image.height)).src;
        url3.value = (await createGraphImage(centerPoints, edges, image.width, image.height)).src;
    }
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
    </div>
</template>
