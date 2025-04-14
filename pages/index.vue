<script setup lang="ts">
definePageMeta({
    layout: "home",
    title: "RadioSzkola - Radiowęzeł Liceum Ogólnokształcącego Nr 2 w Raciborzu",
    description:
        "Oficjalna strona szkolnego radiowęzła Liceum Ogólnokształcącego Nr 2 w Raciborzu. Zobacz co leci na przerwie i dowiedz się czego słuchaliśmy ostatnio.",
});
</script>

<template>
    <div class="p-8 flex flex-col gap-8 items-center font-sans">
        <main
            class="flex items-center gap-4 md:gap-12 flex-col-reverse md:flex-row"
        >
            <div class="flex flex-col items-center md:items-start gap-4">
                <header>
                    <h1 class="text-4xl font-mono text-red-500 font-bold">
                        RADIOWĘZEŁ
                    </h1>
                </header>
                <p class="text-lg text-red-950 max-w-[32rem] text-justify">
                    Radiowęzeł LO2 to oficjalna strona szkolnego radiowęzła
                    Liceum Ogólnokształcącego Nr 2 w Raciborzu. Zobacz co leci
                    na przerwie i dowiedz się czego słuchaliśmy ostatnio. System
                    proponowania muzyki przez uczniów w trakcie budowy 🚧
                </p>
                <div class="flex gap-4 mt-2">
                    <a href="#home-now-playing">
                        <UButton size="xl" icon="fluent:arrow-down-12-filled"
                            >Co dzisiaj gra?</UButton
                        >
                    </a>
                    <a href="#home-recent-tracks">
                        <UButton size="xl" icon="fluent:arrow-down-12-filled"
                            >Co grało ostatnio?</UButton
                        >
                    </a>
                </div>
            </div>
            <NuxtImg
                src="/speaker.png"
                alt="Speaker"
                class="max-w-32 md:max-w-64"
            />
        </main>
        <HomeNowPlaying />
        <HomeRecentTracks />
    </div>
</template>
