<script setup lang="ts">
import { useCurrentTrack } from "#imports";

const { currentTrack, loading, error } = useCurrentTrack();

const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Computed property for progress percentage
const progressPercentage = computed(() => {
    if (!currentTrack.value?.track) return 0;
    return (
        (currentTrack.value.track.progress /
            currentTrack.value.track.duration) *
        100
    );
});

// Computed property for background gradient based on album art
const backgroundStyle = computed(() => {
    if (!currentTrack.value?.track?.album.images[0]) return {};
    return {
        backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(251, 243, 219, 0.9),
        rgba(251, 243, 219, 0.95)
      ),
      url(${currentTrack.value.track.album.images[0].url})
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
    };
});
</script>

<template>
    <div
        class="relative overflow-hidden shadow-lg border border-black rounded-lg my-16 w-full md:w-2xl lg:w-4xl"
    >
        <div
            :style="backgroundStyle"
            class="absolute inset-0 blur-lg opacity-50"
        />

        <div class="relative p-8 bg-amber-100/10 backdrop-blur-sm">
            <div v-if="loading" class="flex justify-center items-center py-12">
                <ULoadingIcon />
            </div>

            <div
                v-else-if="error"
                class="flex flex-col items-center justify-center py-12 text-red-500"
            >
                <div class="i-heroicons-exclamation-circle text-4xl mb-2" />
                <p>{{ error }}</p>
            </div>

            <div
                v-else-if="!currentTrack?.isPlaying"
                class="flex flex-col items-center justify-center py-12 text-black"
            >
                <div class="i-heroicons-musical-note text-4xl mb-2" />
                <p class="text-lg font-mono">Teraz nie gra nic :(</p>
            </div>

            <div v-else-if="currentTrack?.track" class="space-y-6">
                <div class="flex justify-center md:justify-start">
                    <h2 class="text-2xl font-mono text-black font-bold">
                        Teraz gra
                    </h2>
                </div>

                <div class="flex gap-8 flex-col md:flex-row">
                    <div class="flex-shrink-0">
                        <img
                            :src="currentTrack.track.album.images[0]?.url"
                            :alt="currentTrack.track.album.name"
                            class="w-full aspect-square max-w-sm md:w-48 md:h-48 rounded-lg shadow-lg"
                        />
                    </div>

                    <div class="flex flex-col justify-between flex-grow">
                        <div class="space-y-2">
                            <h3
                                class="text-xl font-bold line-clamp-2 text-black"
                            >
                                {{ currentTrack.track.name }}
                            </h3>
                            <p class="text-gray-700">
                                {{
                                    currentTrack.track.artists
                                        .map((a) => a.name)
                                        .join(", ")
                                }}
                            </p>
                            <p class="text-black text-sm">
                                {{ currentTrack.track.album.name }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <div
                                class="h-2 bg-gray-200 rounded-full overflow-hidden"
                            >
                                <div
                                    class="h-full bg-red-500 transition-all duration-1000"
                                    :style="{ width: `${progressPercentage}%` }"
                                />
                            </div>
                            <div
                                class="flex justify-between text-sm text-gray-700"
                            >
                                <span>{{
                                    formatTime(currentTrack.track.progress)
                                }}</span>
                                <span>{{
                                    formatTime(currentTrack.track.duration)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.blur-xl {
    filter: blur(24px);
}
</style>
