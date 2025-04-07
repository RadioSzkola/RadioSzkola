<script setup lang="ts">
const { user } = useUserSession();
const { add: addToast } = useToast();

const spotifyProfiles = ref<SpotifyProfile[]>([]);
const APIGetProfiles = await useFetch("/api/spotify/profiles", {
    method: "GET",
    watch: false,
    immediate: false,
});

async function fetchProfiles() {
    await APIGetProfiles.execute();

    if (APIGetProfiles.error.value) {
        addToast({
            description: getErrorDescription(
                APIGetProfiles.error.value?.data.statusText,
            ),
            color: "error",
            close: false,
        });
        return;
    }

    spotifyProfiles.value = APIGetProfiles.data.value ?? [];
}

async function connectSpotify() {
    window.location.href = "/api/spotify/login";
}

async function disconnectProfile(id: number) {
    const result = await useFetch(`/api/spotify/profiles/${id}`, {
        method: "DELETE",
    });

    if (result.error.value) {
        addToast({
            description: getErrorDescription(
                result.error.value?.data.statusText,
            ),
            color: "error",
            close: false,
        });
        return;
    }

    addToast({
        description: "Profil Spotify został odłączony",
        color: "success",
        close: false,
    });

    await fetchProfiles();
}

async function activateProfile(id: number) {
    const response = await handleAsync(() =>
        $fetch("/api/spotify/profiles/" + id + "/activate", {
            method: "POST",
        }),
    );

    if (!response.success) {
        addToast({
            description: "Błąd :( Profil Spotify nie został aktywowany",
            color: "error",
            close: false,
        });
        return;
    }

    addToast({
        description: "Profil Spotify został aktywowany",
        color: "success",
        close: false,
    });

    await fetchProfiles();
}

onMounted(async () => {
    await fetchProfiles();
});
</script>

<template>
    <div v-if="user?.permissions === 'role-admin'" class="space-y-8 my-8">
        <!-- Spotify Connection Section -->
        <div class="bg-amber-100 p-8 border-shadow">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold font-mono">
                    Połączenie ze Spotify
                </h2>
                <UButton
                    variant="soft"
                    color="success"
                    icon="i-simple-icons-spotify"
                    @click="connectSpotify"
                >
                    Połącz ze Spotify
                </UButton>
            </div>

            <!-- Connected Profiles -->
            <div v-if="spotifyProfiles.length > 0">
                <h3 class="text-lg font-mono mb-4">Połączone Profile</h3>
                <div class="space-y-4">
                    <div
                        v-for="profile in spotifyProfiles"
                        :key="profile.id"
                        class="bg-amber-50 p-4 border-shadow-sm"
                    >
                        <div class="flex items-center justify-between">
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-mono font-bold">{{
                                        profile.name
                                    }}</span>
                                    <UBadge
                                        :color="
                                            profile.active
                                                ? 'success'
                                                : 'neutral'
                                        "
                                    >
                                        {{
                                            profile.active
                                                ? "Aktywny"
                                                : "Nieaktywny"
                                        }}
                                    </UBadge>
                                </div>
                                <div class="text-sm text-gray-600 font-mono">
                                    ID Spotify: {{ profile.spotifyId }}
                                </div>
                                <div class="text-sm text-gray-600 font-mono">
                                    Nazwa Spotify: {{ profile.spotifyUsername }}
                                </div>
                                <div class="text-sm text-gray-600 font-mono">
                                    Token wygasa:
                                    {{
                                        new Date(
                                            profile.refreshTokenExpiresAt,
                                        ).toLocaleString("pl-PL")
                                    }}
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <UButton
                                    v-if="!profile.active"
                                    variant="soft"
                                    icon="i-heroicons-check"
                                    @click="activateProfile(profile.id)"
                                >
                                    Aktywuj
                                </UButton>
                                <UButton
                                    variant="soft"
                                    icon="i-heroicons-trash"
                                    @click="disconnectProfile(profile.id)"
                                >
                                    Odłącz
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-gray-500 py-4">
                <p class="font-mono">Brak połączonych profili Spotify</p>
            </div>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
        <div class="text-xl font-mono">
            Brak dostępu do panelu administratora
        </div>
    </div>
</template>
