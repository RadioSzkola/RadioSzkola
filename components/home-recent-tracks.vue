<script setup lang="ts">
import type { TrackHistoryItem } from "~/types/spotify";

const { add: addToast } = useToast();
const recentTracks = ref<TrackHistoryItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Formatted time function
const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
    });
};

// Format duration from ms to MM:SS
const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Fetch recent tracks
async function fetchRecentTracks() {
    loading.value = true;
    error.value = null;

    try {
        // Fetch from an API endpoint we'll need to create
        const response = await $fetch("/api/spotify/history");
        recentTracks.value = response as TrackHistoryItem[];
    } catch (err) {
        console.error("Failed to fetch recent tracks:", err);
        error.value = "Nie udało się pobrać ostatnio odtwarzanych utworów";
        addToast({
            description: "Nie udało się pobrać ostatnio odtwarzanych utworów",
            color: "error",
            close: false,
        });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchRecentTracks();
});

function openSpotifyTrack(track: TrackHistoryItem) {
    window.open(`https://open.spotify.com/track/${track.id}`, "_blank");
}
</script>

<template>
    <div
        id="home-recent-tracks"
        class="p-8 border border-black shadow-lg my-8 scroll-m-[15vh]"
    >
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-extrabold font-mono text-red-600 mr-2">
                OSTATNIO GRANE UTWORY
            </h2>
            <UButton
                color="primary"
                :loading="loading"
                icon="i-heroicons-arrow-path"
                size="xl"
                @click="fetchRecentTracks"
            >
                Odśwież
            </UButton>
        </div>

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

        <div v-else-if="recentTracks.length === 0" class="text-center py-8">
            <p class="text-gray-500 font-mono">Brak historii odtwarzania</p>
        </div>

        <div v-else class="space-y-4">
            <!-- Track List -->
            <div class="bg-amber-50 p-4">
                <div
                    class="grid grid-cols-12 gap-4 py-2 border-b-2 border-black font-mono"
                >
                    <div class="col-span-1">#</div>
                    <div class="col-span-8 md:col-span-4">Utwór</div>
                    <div class="hidden md:block col-span-3">Wykonawca</div>
                    <div class="hidden md:block col-span-2">Album</div>
                    <div class="col-span-3 md:col-span-2 text-right">
                        Czas trwania
                    </div>
                </div>

                <div class="divide-y divide-gray-500">
                    <div
                        v-for="(track, index) in recentTracks"
                        :key="track.id"
                        class="grid grid-cols-12 gap-4 py-3 items-center hover:translate-x-4 transition-transform hover:underline"
                    >
                        <div class="col-span-1 font-mono text-gray-500">
                            {{ index + 1 }}
                        </div>
                        <div
                            class="col-span-8 md:col-span-4 flex items-center gap-3"
                        >
                            <img
                                :src="track.album?.images[0]?.url || ''"
                                :alt="track.album?.name"
                                class="w-12 h-12 object-cover rounded shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                                @click="openSpotifyTrack(track)"
                                :title="`Open ${track.name} on Spotify`"
                            />
                            <div class="truncate">
                                <p class="font-medium truncate">
                                    {{ track.name }}
                                </p>
                                <p
                                    class="text-xs text-gray-500 md:hidden truncate"
                                >
                                    {{
                                        track.artists
                                            ?.map((a) => a.name)
                                            .join(", ")
                                    }}
                                </p>
                            </div>
                        </div>
                        <div class="hidden md:block col-span-3 truncate">
                            {{ track.artists?.map((a) => a.name).join(", ") }}
                        </div>
                        <div class="hidden md:block col-span-2 truncate">
                            {{ track.album?.name }}
                        </div>
                        <div class="col-span-3 md:col-span-2 text-right">
                            <p class="font-mono">
                                {{ formatDuration(track.duration) }}
                            </p>
                            <p
                                class="text-xs hidden md:block text-gray-500 font-mono"
                            >
                                {{ formatTime(track.startedAt) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
