<script setup lang="ts">
type Link = {
    label: string;
    to?: string;
    modal?: "signin" | "signup" | "signout";
};

const optionsLoggedIn = [
    {
        label: "Playlista",
    },
    {
        label: "Informacje",
    },
    {
        label: "Szkoła",
        to: "http://2loraciborz.pl/",
    },
    {
        label: "Zaloguj się",
        modal: "signin",
    },
    {
        label: "Zarejestruj się",
        modal: "signup",
    },
] as Link[];
const optionsLoggedOut = [
    {
        label: "Playlista",
    },
    {
        label: "Informacje",
    },
    {
        label: "Szkoła",
        to: "http://2loraciborz.pl/",
    },
    {
        label: "Konto",
        to: "/konto",
    },
    {
        label: "Wyloguj się",
        modal: "signout",
    },
] as Link[];

const { loggedIn } = useUserSession();
const options = computed(() => (loggedIn ? optionsLoggedIn : optionsLoggedOut));
</script>

<template>
    <nav
        class="sticky top-0 w-full py-4 px-8 h-20 flex justify-between items-center backdrop-blur-xl z-50"
    >
        <NuxtImg src="/logo-light.png" alt="Logo" class="w-20 h-20" />
        <ul class="gap-8 hidden md:flex">
            <li v-for="link in options" :key="link.label">
                <NuxtLink
                    v-if="!link.modal"
                    :href="link.to"
                    :to="link.to"
                    class="hover:underline text-lg font-semibold text-black cursor-pointer"
                    >{{ link.label }}</NuxtLink
                >
                <UModal v-else>
                    <span
                        class="hover:underline text-lg font-semibold text-black cursor-pointer"
                        >{{ link.label }}</span
                    >
                </UModal>
            </li>
        </ul>
        <UModal class="md:hidden">
            <UHamburger />
            <template #content>
                <ul class="gap-8 flex flex-col p-8 bg-amber-100 text-black">
                    <li v-for="link in options" :key="link.label">
                        <NuxtLink
                            v-if="!link.modal"
                            :href="link.to"
                            :to="link.to"
                            class="hover:underline text-lg font-semibold cursor-pointer"
                            >{{ link.label }}</NuxtLink
                        >
                        <UModal v-else>
                            <span
                                class="hover:underline text-lg font-semibold cursor-pointer"
                                >{{ link.label }}</span
                            >
                        </UModal>
                    </li>
                </ul>
            </template>
        </UModal>
        <div
            class="border-t-4 border-black mx-4 my-8 absolute -bottom-8 w-screen -left-4"
        />
    </nav>
</template>
