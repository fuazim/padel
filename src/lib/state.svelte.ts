// Shared language state for Svelte 5
export const languageState = $state({
    current: "ID" // Default language: Indonesian
});

// Shared authentication state for Svelte 5
export const authState = $state<{
    user: { name: string; email: string; image?: string | null; avatar?: string } | null;
    checked: boolean;
}>({
    user: null,
    checked: false
});
