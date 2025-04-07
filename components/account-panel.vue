<script setup lang="ts">
import { NuxtLink } from "#components";

const { user } = useUserSession();

const formattedDate = (timestamp?: number) => {
    if (!timestamp) return "---";
    return new Date(timestamp).toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
};

const roleDisplay = computed(() => {
    if (!user) return "---";
    return user.value?.permissions === "role-admin"
        ? "Administrator"
        : "Użytkownik";
});
</script>

<template>
    <div class="bg-amber-100 p-8 border-shadow">
        <div v-if="!user" class="text-center text-gray-500 py-8">
            <div class="text-xl font-mono">Brak danych użytkownika</div>
        </div>

        <div v-else class="space-y-8">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <h2 class="text-2xl text-red-600 font-bold font-mono">
                    Profil Użytkownika
                </h2>
                <UBadge class="text-sm">
                    {{ roleDisplay }}
                </UBadge>
            </div>

            <!-- User Info -->
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Basic Info Section -->
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <span class="text-sm text-gray-500 font-mono"
                                >Imię i Nazwisko</span
                            >
                            <p class="font-medium">{{ user.name }}</p>
                        </div>

                        <div class="space-y-2">
                            <span class="text-sm text-gray-500 font-mono"
                                >Email</span
                            >
                            <p class="font-medium">{{ user.email }}</p>
                        </div>
                    </div>

                    <!-- Timestamps Section -->
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <span class="text-sm text-gray-500 font-mono"
                                >Data utworzenia</span
                            >
                            <p class="font-medium">
                                {{ formattedDate(user.createdAt) }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <span class="text-sm text-gray-500 font-mono"
                                >Ostatnia aktualizacja</span
                            >
                            <p class="font-medium">
                                {{ formattedDate(user.updatedAt) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 border-amber-200">
                <NuxtLink v-if="user.permissions === 'role-admin'" to="/admin">
                    <UButton
                        variant="soft"
                        icon="i-heroicons-wrench-screwdriver"
                    >
                        Panel Administracyjny
                    </UButton>
                </NuxtLink>

                <UButton variant="soft" icon="i-heroicons-user">
                    Edytuj Profil
                </UButton>
            </div>
        </div>
    </div>
</template>
