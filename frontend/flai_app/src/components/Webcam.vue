<template>
  <div
    ref="webcamContainer"
    class="webcam-container"
    :class="borderclass"
  ></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import store from '../store'

defineProps<{ borderclass: string }>()

const webcamFeed = computed(() => store.webcamdata.webcam.webcamFeed)
const webcamContainer = ref<HTMLDivElement>()

const initWebcam = () => {
  if (webcamFeed.value) {
    const webcamFeedCopy = Object.assign(webcamFeed.value)
    webcamFeedCopy.autoplay = true
    webcamFeedCopy.loop = true
    webcamFeedCopy.id = 'webcam-feed'
    webcamContainer.value?.appendChild(webcamFeedCopy)
    // needed since autoplay does not always work after mount
    webcamFeedCopy.play()
  }
}

onMounted(() => initWebcam())

// only nedded in case the webcamFeed changes after mounting the component
watch(webcamFeed, () => initWebcam())
</script>
