<script setup lang="ts">
const { add: addToast } = useToast();
const { clear } = useUserSession();

const { execute, status } = await useFetch("/api/auth/signout", {
    method: "POST",
    immediate: false,
    cache: "no-cache",
    watch: false,
});

watch(status, () => {
    if (status.value === "success") {
        addToast({
            color: "success",
            description: "Zostałeś pomyślnie wylogowany. Do zobaczenia!",
            close: false,
        });
        // Optionally redirect to home page or login page
        // navigateTo("/");
    }
});

async function onSignout() {
    await execute();
    await clear();
}
</script>

<template>
    <UButton
        class="text-center font-bold"
        size="lg"
        variant="subtle"
        :active="status === 'pending' ? true : false"
        @click="onSignout"
    >
        Wyloguj się
    </UButton>
</template>
