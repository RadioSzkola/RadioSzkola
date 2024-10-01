<script setup lang="ts">
const email = ref("");
const password = ref("");

async function handleSubmit() {
    try {
        const res = await $fetch("http://localhost:8080/v1/web/login", {
            method: "POST",
            body: {
                email: email.value,
                password: password.value,
            },
        });

        console.log(res);
    } catch (e) {
        console.error(e);
    }

    email.value = "";
    password.value = "";
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col p-4 w-24">
        <input class="bg-blue-400" type="email" v-model="email" />
        <input class="bg-blue-400" type="password" v-model="password" />
        <button type="submit">Login</button>
    </form>
</template>
