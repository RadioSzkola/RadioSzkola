<script setup lang="ts">
onMounted(async () => {
    const res = await fetch("http://localhost:8080/v1/test/headers", {
        method: "GET",
    });
    const data = await res.json();
    console.log(data);
});
</script>

<template>
    <h1>That's just a test page</h1>
</template>
