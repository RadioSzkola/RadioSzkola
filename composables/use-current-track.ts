export interface CurrentTrack {
  isPlaying: boolean;
  track: {
    id: string;
    name: string;
    artists: Array<{
      id: string;
      name: string;
    }>;
    album: {
      id: string;
      name: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
    };
    duration: number;
    progress: number;
    startedAt: number;
  } | null;
  profile: {
    id: number;
    name: string;
  } | null;
}

export function useCurrentTrack(pollingDelay = 5000) {
  const currentTrack = ref<CurrentTrack | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let pollingInterval: NodeJS.Timeout | null = null;

  // Update progress locally between API calls
  const progressInterval = ref<NodeJS.Timeout | null>(null);
  const localProgress = ref<number>(0);

  async function fetchCurrentTrack() {
    try {
      const response = await $fetch<CurrentTrack>("/api/spotify/nowplaying");
      currentTrack.value = response;

      // Update local progress
      if (response?.track?.progress) {
        localProgress.value = response.track.progress;
      }

      // Reset error if successful
      error.value = null;
    } catch (e) {
      console.error("Failed to fetch current track:", e);
      error.value = "Failed to fetch current track";
    }
  }

  function updateLocalProgress() {
    if (currentTrack.value?.isPlaying && currentTrack.value.track) {
      localProgress.value += 1000; // Add 1 second
      currentTrack.value.track.progress = localProgress.value;

      // Reset if we've reached the end of the track
      if (localProgress.value >= currentTrack.value.track.duration) {
        localProgress.value = 0;
      }
    }
  }

  function startPolling() {
    // Clear any existing intervals
    stopPolling();

    // Start API polling
    pollingInterval = setInterval(fetchCurrentTrack, pollingDelay);

    // Start progress updates
    progressInterval.value = setInterval(updateLocalProgress, 1000);
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }

    if (progressInterval.value) {
      clearInterval(progressInterval.value);
      progressInterval.value = null;
    }
  }

  // Initial fetch
  onMounted(async () => {
    loading.value = true;
    await fetchCurrentTrack();
    loading.value = false;
    startPolling();
  });

  // Cleanup
  onUnmounted(() => {
    stopPolling();
  });

  // Handle visibility change to prevent unnecessary polling when tab is hidden
  if (import.meta.client) {
    watch(
      () => document.visibilityState,
      (newState) => {
        if (newState === "visible") {
          fetchCurrentTrack();
          startPolling();
        } else {
          stopPolling();
        }
      },
    );
  }

  // Computed properties for convenience
  const isPlaying = computed(() => currentTrack.value?.isPlaying ?? false);
  const trackProgress = computed(
    () => currentTrack.value?.track?.progress ?? 0,
  );
  const trackDuration = computed(
    () => currentTrack.value?.track?.duration ?? 0,
  );
  const progressPercentage = computed(() => {
    if (!trackDuration.value) return 0;
    return (trackProgress.value / trackDuration.value) * 100;
  });

  return {
    currentTrack: readonly(currentTrack),
    loading: readonly(loading),
    error: readonly(error),
    isPlaying,
    trackProgress,
    trackDuration,
    progressPercentage,
    fetchCurrentTrack,
    startPolling,
    stopPolling,
  };
}
