<script setup lang="ts">
const colorMode = useColorMode();

function handleSwitchColorTheme() {
    if (colorMode.value === "dark") {
        colorMode.preference = "light";
    } else {
        colorMode.preference = "dark";
    }
}
</script>

<template>
    <h1>{{ colorMode.value }}</h1>
    <button v-on:click="handleSwitchColorTheme">Switch the theme!</button>
</template>
