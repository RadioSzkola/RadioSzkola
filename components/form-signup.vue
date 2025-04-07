<script setup lang="ts">
const { add: addToast } = useToast();
const { fetch } = useUserSession();

const state = reactive<Partial<SignupData>>({
    authId: undefined,
    email: undefined,
    password: undefined,
    name: undefined,
});

const { error, execute, status } = await useFetch("/api/auth/signup", {
    body: state,
    method: "POST",
    immediate: false,
    cache: "no-cache",
    watch: false,
});

watch(status, () => {
    switch (status.value) {
        case "error":
            addToast({
                color: "error",
                description: getErrorDescription(
                    error.value?.data.statusMessage,
                ),
                close: false,
            });
            break;
        case "success":
            addToast({
                color: "success",
                description:
                    "Gratulacje użytkowniku! Jesteś zarejestrowany. Witamy na stronie radiowęzła mickiewicza :)",
                close: false,
            });
            break;
    }
});

async function onSubmit() {
    await execute();
    await fetch();
}
</script>

<template>
    <UForm
        class="flex flex-col gap-2 items-center p-8 bg-amber-100"
        :schema="signupSchema"
        :state="state"
        @submit="onSubmit"
    >
        <UFormField
            class="w-full"
            label="Kod"
            name="authId"
            :ui="{
                root: 'w-3xs md:w-2xs',
                label: 'text-black font-mono text-lg',
                error: 'font-mono',
            }"
        >
            <UInput
                v-model="state.authId"
                :ui="{ base: 'bg-amber-100', root: 'w-full' }"
                size="lg"
            />
        </UFormField>
        <UFormField
            class="w-full"
            label="Email"
            name="email"
            :ui="{
                root: 'w-3xs md:w-2xs',
                label: 'text-black font-mono text-lg',
                error: 'font-mono',
            }"
        >
            <UInput
                v-model="state.email"
                :ui="{ base: 'bg-amber-100', root: 'w-full' }"
                size="lg"
            />
        </UFormField>
        <UFormField
            class="w-full"
            label="Hasło"
            name="password"
            :ui="{
                root: 'w-3xs md:w-2xs',
                label: 'text-black font-mono text-lg',
                error: 'font-mono',
            }"
        >
            <UInput
                v-model="state.password"
                :ui="{ base: 'bg-amber-100', root: 'w-full' }"
                size="lg"
            />
        </UFormField>
        <UFormField
            class="w-full"
            label="Imię i Nazwisko"
            name="name"
            :ui="{
                root: 'w-3xs md:w-2xs',
                label: 'text-black font-mono text-lg',
                error: 'font-mono',
            }"
        >
            <UInput
                v-model="state.name"
                :ui="{ base: 'bg-amber-100', root: 'w-full' }"
                size="lg"
            />
        </UFormField>

        <UButton
            type="submit"
            class="text-center mt-8 font-bold text-xl"
            size="xl"
            variant="subtle"
            :active="status === 'pending' ? true : false"
        >
            Zarejestruj się
        </UButton>
    </UForm>
</template>
