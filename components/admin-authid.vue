<script setup lang="ts">
import { Param } from "drizzle-orm";

const { user } = useUserSession();
const { add: addToast } = useToast();

const newAuthIdInput = reactive({
    id: "",
});
const authIds = ref<AuthId[]>([]);
const pagination = reactive<Pagination>({
    offset: 0,
    limit: 50,
});

const APIGenAuthId = await useFetch("/api/auth/genid", {
    method: "POST",
    body: newAuthIdInput,
    watch: false,
    immediate: false,
    cache: "no-store",
});

const APIGetAuthIds = await useFetch("/api/auth/ids", {
    method: "GET",
    watch: false,
    query: pagination,
    immediate: false,
});

async function generateAuthId() {
    await APIGenAuthId.execute();
    pagination.offset = 0;
    await fetchAuthIds();
}

async function fetchAuthIds() {
    await APIGetAuthIds.execute();
}

function handleCopyAuthId(authId: string) {
    navigator.clipboard.writeText(authId);
    addToast({
        description: "Kod rejestracyjny skopiowany do schowka",
        color: "info",
        close: false,
    });
}

watch(APIGetAuthIds.status, () => {
    switch (APIGetAuthIds.status.value) {
        case "success":
            authIds.value = APIGetAuthIds.data.value ?? [];
            break;
        case "error":
            addToast({
                description: getErrorDescription(
                    APIGetAuthIds.error.value?.data.statusText,
                ),
                color: "error",
                close: false,
            });
            break;
    }
});

watch(APIGenAuthId.status, () => {
    switch (APIGenAuthId.status.value) {
        case "success":
            addToast({
                description: "Kod rejestracyjny stworzony.",
                color: "success",
                close: false,
            });
            break;
        case "error":
            addToast({
                description: getErrorDescription(
                    APIGenAuthId.error.value?.data.statusText,
                ),
                color: "error",
                close: false,
            });
            break;
    }
});

function onPaginationForwards() {
    pagination.offset += pagination.limit;
    fetchAuthIds();
}

function onPaginationBackwards() {
    if (pagination.offset === 0) {
        return;
    }

    pagination.offset -= pagination.limit;
    fetchAuthIds();
}

onMounted(async () => {
    await fetchAuthIds();
});
</script>

<template>
    <div v-if="user?.permissions === 'role-admin'" class="space-y-8 my-8">
        <!-- ID Generator Section -->
        <div class="bg-amber-100 p-8 border-shadow">
            <h2 class="text-xl font-bold font-mono mb-4">
                Generator Kodów Rejestracyjnych
            </h2>
            <div class="flex flex-col md:flex-row gap-4">
                <UInput
                    v-model="newAuthIdInput.id"
                    placeholder="Wprowadź kod rejestracyjny"
                    class="flex-1"
                    :ui="{
                        base: 'bg-amber-50 font-mono',
                    }"
                />
                <UButton
                    variant="soft"
                    icon="i-heroicons-key"
                    @click="generateAuthId"
                >
                    Generuj Kod
                </UButton>
            </div>
        </div>

        <!-- Auth IDs List -->
        <div class="bg-amber-100 p-8 border-shadow">
            <h2 class="text-xl font-bold font-mono mb-4">
                Lista Kodów Rejestracyjnych
            </h2>

            <!-- Header -->
            <div
                class="grid grid-cols-4 gap-4 py-2 border-b-2 border-black font-mono"
            >
                <div class="text-left">Kod</div>
                <div class="text-left">Status</div>
                <div class="text-left">Data Wygaśnięcia</div>
                <div class="text-left">Akcje</div>
            </div>

            <!-- List Items -->
            <div class="space-y-2 mt-2">
                <div
                    v-for="authId in authIds"
                    :key="authId.id"
                    class="grid grid-cols-4 gap-4 py-2 border-b border-black/20 items-center"
                >
                    <div class="font-mono">{{ authId.id }}</div>
                    <div>
                        <UBadge :color="authId.userId ? 'error' : 'success'">
                            {{ authId.userId ? "Użyty" : "Dostępny" }}
                        </UBadge>
                    </div>
                    <div class="font-mono">
                        {{
                            new Date(authId.expiresAt).toLocaleDateString(
                                "pl-PL",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                },
                            )
                        }}
                    </div>
                    <div>
                        <UButton
                            v-if="!authId.userId"
                            variant="soft"
                            color="info"
                            icon="i-heroicons-clipboard"
                            @click="handleCopyAuthId(authId.id)"
                        />
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex items-center justify-end gap-4">
                <UButton
                    :disabled="pagination.offset === 1"
                    variant="soft"
                    @click="onPaginationBackwards"
                >
                    Poprzednia
                </UButton>
                <UButton variant="soft" @click="onPaginationForwards">
                    Następna
                </UButton>
                <span class="text-lg text-gray-500 font-mono">
                    {{ pagination.offset + 1 }} -
                    {{ pagination.offset + pagination.limit + 1 }}
                </span>
            </div>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
        <div class="text-xl font-mono">
            Brak dostępu do panelu administratora
        </div>
    </div>
</template>
