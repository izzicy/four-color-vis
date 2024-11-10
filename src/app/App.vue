<script setup lang="ts">
import { computedAsync, useFileDialog } from '@vueuse/core';
import { loadImageData } from './util/loadImageData';
import { createImageRegions } from './util/createImageRegions';
import { createImageFromRegions } from './util/createImageFromRegions';
import { resolveCenterPointsFromRegions } from './util/resolveCenterPointsFromRegions';
import { createGraphImage } from './util/createGraphImage';
import { computed, ref, watch, watchEffect } from 'vue';
import { resolveEdgesFromRegions } from './util/resolveEdgesFromRegions';
import { createRegionIndexMap } from './util/createRegionIndexMap';
import { createFourColorSolver } from './util/createFourColorSolver';
import { createAsyncFourColorSolver } from './util/createAsyncFourColorSolver';
import { createColoredRegionImage } from './util/createColoredRegionImage';
import { useColoredRegionDrawer } from './util/useColoredRegionDrawer';
import { useHighlight } from './util/useHighlight';
import { createNanoEvents } from 'nanoevents';
import { UncoloredMap } from './util/types';

const url1 = ref('');
const url2 = ref('');
const url3 = ref('');
const url4 = ref('');

const { files, open } = useFileDialog({
    accept: 'image/*',
    multiple: false,
});

const borderThreshold = ref(0.9);
const stepDelay = ref(500);
const imageAndPixels = computedAsync(async () => files.value && await loadImageData(files.value[0]));
const image = computed(() => imageAndPixels.value?.image);
const pixels = computed(() => imageAndPixels.value?.pixels);

const emitter = createNanoEvents();

const animatedSolverCanvas = ref<HTMLCanvasElement>();
const uncoloredMap = ref<UncoloredMap>();

const {
    isHighlighted,
    toggleHighlight,
} = useHighlight()

useColoredRegionDrawer({
    uncoloredMap,
    canvas: animatedSolverCanvas,
    emitter,
});

watch([image, pixels], async ([imageValue, pixelsValue]) => {
    if ( ! imageValue || ! pixelsValue) {
        return;
    }

    const width = imageValue.width;
    const height = imageValue.height;

    const {
        regions,
        boundaries,
    } = createImageRegions(pixelsValue, width, height, borderThreshold.value);

    const regionMap = createRegionIndexMap(regions);

    const centerPoints = resolveCenterPointsFromRegions(regions, regionMap, width);
    const edges = resolveEdgesFromRegions(regions, boundaries, width, height);
    const colorMap = createFourColorSolver({
        edges,
    });

    centerPoints.delete(-1);
    centerPoints.delete(0);

    createAsyncFourColorSolver({
        edges,
        emitter,
        stepDelay,
    }).solve();

    uncoloredMap.value = {
        width,
        height,
        basePixels: pixelsValue,
        regionMap,
    };

    // url1.value = (await createImageFromRegions(regions, width, height)).src;
    // url2.value = (await createImageFromRegions(boundaries, width, height)).src;
    url3.value = (await createGraphImage(centerPoints, edges, width, height)).src;
    url4.value = (await createColoredRegionImage(pixelsValue, regionMap, colorMap, width, height)).src;

})

</script>

<template>
    <div class="min-vh-100 d-flex flex-column">
        <div class="position-relative flex-grow-1 h-100">
            <div class="visualizer-element" :class="{ highlighted: isHighlighted('anim') }" @click="toggleHighlight('anim')" style="left: 0; top: 0;">
                <canvas class="mh-100 mw-100" ref="animatedSolverCanvas"></canvas>
            </div>
            <div class="visualizer-element" :class="{ highlighted: isHighlighted('result') }" @click="toggleHighlight('result')" style="left: 50%; top: 0;">
                <img class="mh-100 mw-100" :src="url4" alt="">
            </div>
            <div class="visualizer-element" :class="{ highlighted: isHighlighted('graph') }" @click="toggleHighlight('graph')" style="left: 0; top: 50%;">
                <img class="mh-100 mw-100" :src="url3" alt="">
            </div>
            <!-- <div class="position-absolute d-flex align-items-center justify-content-center w-50 h-50" style="left: 50%; top: 50%;">t</div> -->
        </div>

        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-primary" @click="() => open()">
                        Choose file
                    </button>
                </div>

                <div class="col">
                    <label for="time-range" class="form-label">Animation duration</label> {{ stepDelay / 1000 }}s
                    <br>
                    <input v-model="stepDelay" min="20" max="2000" type="range" class="form-range w-auto" id="time-range">
                </div>

                <div class="col">
                    <label for="border-threshold" class="form-label">Border threshold</label> {{ Math.round(borderThreshold * 100) }}%
                    <br>
                    <input v-model="borderThreshold" min="0.01" max="1" step="0.01" type="range" class="form-range w-auto" id="border-threshold">
                </div>
            </div>
        </div>
    </div>
</template>
