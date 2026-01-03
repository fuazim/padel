<script lang="ts">
    import { currentLanguage } from "$lib/stores/language";
    import { onMount } from "svelte";

    let previousLanguage = $currentLanguage;
    let isTransitioning = false;
    let isFadedOut = false;

    // Handle smooth language transition
    $: if ($currentLanguage !== previousLanguage) {
        // Start fade out
        isTransitioning = true;
        isFadedOut = true;

        // After fade out, update and fade in
        setTimeout(() => {
            previousLanguage = $currentLanguage;
            isFadedOut = false;

            // Remove transitioning class after animation
            setTimeout(() => {
                isTransitioning = false;
            }, 250);
        }, 150);
    }

    onMount(() => {
        previousLanguage = $currentLanguage;
    });
</script>

<div
    class="language-wrapper"
    class:is-transitioning={isTransitioning}
    class:faded-out={isFadedOut}
>
    <slot />
</div>

<style>
    .language-wrapper {
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .language-wrapper.is-transitioning {
        will-change: opacity, transform;
    }

    .language-wrapper.faded-out {
        opacity: 0;
        transform: translateY(-6px);
    }
</style>
