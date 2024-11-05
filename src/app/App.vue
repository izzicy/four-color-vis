<script setup lang="ts">
import { useFileDialog } from '@vueuse/core';
import { loadImageData } from './util/loadImageData';
import { createImageSectionMarkings } from './util/createImageSectionMarkings';
import { createImageFromMarkings } from './util/createImageFromMarkings';
import { resolveCenterPointsFromMarkings } from './util/resolveCenterPointsFromMarkings';
import { createGraphImage } from './util/createGraphImage';
import { ref } from 'vue';
import { resolveEdgesFromMarkings } from './util/resolveEdgesFromMarkings';
import { uniq } from 'lodash-es';

const url1 = ref('');
const url2 = ref('');
const url3 = ref('');

const { files, open, reset, onCancel, onChange } = useFileDialog({
    accept: 'image/*', // Set to accept only image files
    multiple: false,
});

onChange(async (files) => {
    if (files[0]) {
        const {
            image,
            pixels,
        } = await loadImageData(files[0]);

        const {
            markings,
            boundaries,
        } = createImageSectionMarkings(pixels, image.width, image.height);

        const centerPoints = resolveCenterPointsFromMarkings(markings, image.width, image.height);
        const edges = resolveEdgesFromMarkings(markings, boundaries, image.width, image.height);

        centerPoints.delete(-1);

        console.log(centerPoints, edges);

        url1.value = (await createImageFromMarkings(markings, image.width, image.height)).src;
        url2.value = (await createImageFromMarkings(boundaries, image.width, image.height)).src;
        url3.value = (await createGraphImage(centerPoints, edges, image.width, image.height)).src;
    }
});
</script>

<template>
    <div>
        <button type="button" @click="open">Choose file</button>
        <img :src="url1" alt="">
        <img :src="url2" alt="">
        <img :src="url3" alt="">
    </div>
</template>
