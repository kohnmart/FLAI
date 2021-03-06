<template>
  <div
    v-if="word !== undefined && word.length > 0"
    :key="startSession"
    class="exercise-container"
  >
    <WatchWord
      v-if="stepOneWatch && newSigns.length > 0"
      :signs="newSigns"
      :exercise-id="exerciseId"
      @next="onNextStep"
      @correct="feedbackClass = 'correct'"
      @wrong="feedbackClass = 'wrong'"
      @waiting="feedbackClass = 'waiting'"
      @rendered="emit('watch-word')"
    />
    <ShowWord
      v-else
      :signs="signsFromWord"
      :exercise-id="exerciseId"
      :word-set="wordSet"
      @new-word="newWord"
      @correct="feedbackClass = 'correct'"
      @wrong="feedbackClass = 'wrong'"
      @waiting="feedbackClass = 'waiting'"
      @rendered="emit('show-word')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed, ComputedRef } from 'vue'
import { Sign } from '../../store/signdata'
import WatchWord from './WatchWord.vue'
import ShowWord from './ShowWord.vue'
import store from '../../store'
import { initExerciseRound } from '../../ressources/ts/methods'

const allSigns: ComputedRef<Sign[]> = computed(() => store.signdata.signs)

const word: ComputedRef<string[]> = computed(
  () => store.exercisedata.word.signs
)
const signsFromWord: ComputedRef<Sign[]> = computed(() => {
  const wordArray: Sign[] = []
  for (const signId of word.value) {
    const sign = allSigns.value?.find((el) => el.id === signId)
    if (sign) wordArray.push(sign)
  }
  return wordArray
})
const startSession = ref('false') // forces the div to rerender via the key: must be string/number
const newSigns = ref<Sign[]>([])
const stepOneWatch = ref(true)
const exerciseId: ComputedRef<string> = computed(
  () => store.exercisedata.exercises[0].id
)
const wordSet = ref(true)
const feedbackClass = ref('waiting')

const emit = defineEmits(['watch-word', 'show-word', 'correct', 'wrong'])

function getNewSigns() {
  newSigns.value.length = 0
  for (const signId of word.value) {
    const sign = allSigns.value?.find((el) => el.id === signId)
    if (sign?.intro_done === false) {
      if (!newSigns.value.includes(sign)) {
        newSigns.value.push(sign)
      }
    }
  }
}

function onNextStep() {
  stepOneWatch.value = false
}

async function newWord() {
  startSession.value = 'false'
  wordSet.value = false
  await initExerciseRound()
  wordSet.value = true
}

onBeforeMount(() => {
  store.sessiondata.methods.startTimer()
  startSession.value = 'true'
  getNewSigns()
})
</script>
