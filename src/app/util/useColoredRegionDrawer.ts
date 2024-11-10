import * as _ from 'lodash-es';
import { COLOR_1, COLOR_2, COLOR_3, COLOR_4, NO_COLOR } from './createFourColorSolver';
import { computed, ref, toValue, watch } from 'vue';
import { MaybeRefOrGetter, tryOnScopeDispose } from '@vueuse/core';
import { UncoloredMap } from './types';
import { Emitter } from 'nanoevents';

export type UseColoredRegionDrawerOptions = {
    canvas: MaybeRefOrGetter<HTMLCanvasElement | null | undefined>;
    uncoloredMap: MaybeRefOrGetter<UncoloredMap | null | undefined>;
    emitter: Emitter;
};

export function useColoredRegionDrawer(options: UseColoredRegionDrawerOptions) {
    const {
        canvas,
        uncoloredMap,
        emitter,
    } = options;

    const drawer = ref<ColoredRegionDrawer>();
    const ctx = computed(() => toValue(canvas)?.getContext("2d"));

    const onColorSet = ({ mark, color }: { mark: number; color: number; }) => {
        drawer.value?.setRegionColor(mark, color);
    };

    const onColorUnset = ({ mark }: { mark: number; }) => {
        drawer.value?.unsetRegionColor(mark);
    };

    watch([ctx, () => toValue(uncoloredMap)], ([ctxValue, uncoloredMapValue]) => {
        if (ctxValue && uncoloredMapValue) {
            ctxValue.canvas.width = uncoloredMapValue.width;
            ctxValue.canvas.height = uncoloredMapValue.height;
            drawer.value = new ColoredRegionDrawer(ctxValue, uncoloredMapValue);
            drawer.value.initialize();
        }
    });

    const offColorSet = emitter.on('set-color', onColorSet);
    const offColorUnset = emitter.on('unset-color', onColorUnset);

    tryOnScopeDispose(() => {
        offColorSet();
        offColorUnset();
    });
}

class ColoredRegionDrawer {
    protected ctx;
    protected uncoloredMap;

    public constructor(
        ctx: CanvasRenderingContext2D,
        uncoloredMap: UncoloredMap,
    ) {
        this.ctx = ctx;
        this.uncoloredMap = uncoloredMap;
    }

    public initialize() {
        const imageData = new ImageData(this.uncoloredMap.basePixels.slice(), this.uncoloredMap.width, this.uncoloredMap.height);

        this.ctx.putImageData(imageData, 0, 0);
    }

    public setRegionColor(regionMark: number, color: number) {
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.colorRegion(regionMark, imageData, color);

        this.ctx.putImageData(imageData, 0, 0);
    }

    public unsetRegionColor(regionMark: number) {
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.colorRegion(regionMark, imageData, NO_COLOR);

        this.ctx.putImageData(imageData, 0, 0);
    }

    protected colorRegion(regionMark: number, imageData: ImageData, color: number) {
        const indexes = this.uncoloredMap.regionMap.get(regionMark);

        if ( ! indexes) {
            return;
        }

        for (const index of indexes) {
            const i = index * 4;

            if (color === NO_COLOR) {
                imageData.data[i + 0] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255;
            } if (color & COLOR_1) {
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
}
