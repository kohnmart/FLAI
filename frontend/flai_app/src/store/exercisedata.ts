import { readonly, reactive } from 'vue'
import { random } from '../ressources/ts/random'
import signData from './signdata'

export interface ExerciseSettings {
  id: string
  level1: number
  level2: number
  maxProgress: number
  wordLength: number
  unlockedSigns: number
}

const exerciseSettings: ExerciseSettings = reactive({
  id: '',
  level1: 100,
  level2: 200,
  maxProgress: 300,
  wordLength: 4,
  unlockedSigns: 4,
})

export interface Exercise {
  id: string
  name: string
  description: string
  firstStart: number
  sessionDuration: number
  // TODO: type readonly not compatible if you change to type Sign[]
  signs: any[]
}

const exercises: Exercise[] = reactive([])

const methods = {
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    exerciseSettings.wordLength = wordLength
  },
  changeExerciseSettingsUnlockedSigns(unlockedSigns: number) {
    exerciseSettings.unlockedSigns = unlockedSigns
  },
  startNewExercise(name: string, description: string) {
    const word: any[] = []
    for (let i = 0; i < exerciseSettings.wordLength; i++) {
      const index = random(0, exerciseSettings.unlockedSigns)
      word.push(signData.signs[index])
    }
    console.log('word', word)
    const exercise: Exercise = {
      id: '' + exercises.length,
      name: name,
      description: description,
      firstStart: Date.now(),
      sessionDuration: 0,
      signs: word,
    }
    exercises.push(exercise)
  },
  stopExercise(id: string) {
    const index = exercises.findIndex((el) => el.id === id)
    exercises[index].sessionDuration = Date.now() - exercises[index].firstStart
    console.log(exercises[index])
  },
}

export default {
  exerciseSettings: readonly(exerciseSettings),
  exercises: readonly(exercises),
  methods,
}
