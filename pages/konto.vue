<script setup lang="ts">
definePageMeta({
    layout: "home",
});

const { user } = useUserSession();
</script>

<template>
    <div class="p-8">
        <AccountPanel :user="user ?? undefined" />
    </div>
</template>
