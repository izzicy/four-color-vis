import { ref } from 'vue';

export function useHighlight() {
    const highlighted = ref<string>();

    const isHighlighted = (el: string) => {
        return highlighted.value === el;
    };

    const toggleHighlight = (el: string) => {
        if (highlighted.value === el) {
            highlighted.value = undefined;
        } else {
            highlighted.value = el;
        }
    };

    return {
        isHighlighted,
        toggleHighlight,
    };
}
