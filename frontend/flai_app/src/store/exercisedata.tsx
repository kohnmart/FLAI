import { readonly, reactive } from 'vue'
import { random, weightedRandomIndex } from '../ressources/ts/random'
import { jsonAction } from '../common/service/rest'
import signData, { Sign } from './signdata'
import userData from './userdata'

export interface Exercise {
  id: string
  name: string
  description: string
  signs: Sign[]
}

const exercises: Exercise[] = reactive([])

const progressStep: number = 10
export interface ExerciseSettings {
  id: string
  level1: number
  level2: number
  level3: number
  exerciseId: string
  sortSignsByOrder: boolean
}

const exerciseSettings: ExerciseSettings = reactive({
  id: '',
  level1: 10,
  level2: 20,
  level3: 30,
  exerciseId: '',
  sortSignsByOrder: true,
})

export interface ExerciseSettingsUser {
  exerciseId: string
  wordLength: number
  unlockedSigns: number
}

const exerciseSettingsUser: ExerciseSettingsUser = reactive({
  exerciseId: '',
  wordLength: 4,
  unlockedSigns: 4,
})

export interface ExerciseSession {
  startTime: number
  sessionDuration: number
  order: number
  signs: Sign[]
}

const exerciseSessions: ExerciseSession[] = reactive([])

const methods = {
  getExercises() {
    const exercise: Exercise = {
      id: '0',
      name: 'test',
      description: 'this is testdata',
      signs: signData.methods.createNewSigns(),
    }
    exercises.push(exercise)
    exerciseSettings.exerciseId = exercise.id
    exerciseSettingsUser.exerciseId = exercise.id
    console.log('exercises:', JSON.stringify(exercises))
  },
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    if (wordLength <= exerciseSettingsUser.unlockedSigns)
      exerciseSettingsUser.wordLength = wordLength
  },
  increaseUnlockedSigns() {
    exerciseSettingsUser.unlockedSigns +=
      exerciseSettingsUser.unlockedSigns < 26 ? 1 : 0
  },
  decreaseUnlockedSigns() {
    if (exerciseSettingsUser.wordLength < exerciseSettingsUser.unlockedSigns)
      exerciseSettingsUser.unlockedSigns -=
        exerciseSettingsUser.unlockedSigns > 0 ? 1 : 0
  },
  startNewExerciseSession() {
    let word = this.generateWord()
    const newSession: ExerciseSession = {
      startTime: Date.now(),
      sessionDuration: 0,
      order: 0,
      signs: word,
    }
    exerciseSessions.push(newSession)
    return exerciseSessions
  },
  generateWord() {
    const word: Sign[] = []
    if (exercises.length > 0) {
      let signCopy = [...exercises[0].signs]
      for (let i = 0; i < exerciseSettingsUser.wordLength; i++) {
        //get sum of progress
        let weightArray = []
        for (let k = 0; k < exerciseSettingsUser.unlockedSigns - i; k++) {
          weightArray.push(signCopy[k].progress + 1)
        }
        let index = weightedRandomIndex(weightArray)
        word.push(signCopy[index])
        signCopy.splice(index, 1)
      }
    }
    console.log('word', word)
    return word
  },
  stopExercise(searchId: string) {
    //TODO: not necessary to stop a exercise right now, maybe in the future to track the times
  },
  increaseProgress(exerciseId: string, letter: string) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.name === letter
    )
    exercises[exerciseIndex].signs[signIndex].progress += progressStep
    console.log(
      'updatedSign',
      exercises[exerciseIndex].signs[signIndex].name,
      exercises[exerciseIndex].signs[signIndex].progress
    )
  },
  decreaseProgress(exerciseId: string, letter: string) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.name === letter
    )
    exercises[exerciseIndex].signs[signIndex].progress -= progressStep
    exercises[exerciseIndex].signs[signIndex].progress =
      exercises[exerciseIndex].signs[signIndex].progress > 0
        ? exercises[exerciseIndex].signs[signIndex].progress
        : 0
    console.log(
      'updatedSign',
      exercises[exerciseIndex].signs[signIndex].name,
      exercises[exerciseIndex].signs[signIndex].progress
    )
  },
  signAlreadySeen(letter: string) {
    let sign = exercises[0].signs.find((el: Sign) => el.name == letter)
    if (sign) {
      sign.alreadySeen = true
    }
  },
}

const actions = {
  /* eslint-disable */
  async getAllExercises() {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'exercise/all',
      data: {},
    })
    Object.assign(exercises, jsonData?.data.rows)
    console.log(exercises)
  },

  async getFullExerciseForUser(exerciseId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'exercise',
      // id == exercise_id
      data: {
        id: exerciseId,
        user_id: userData.user.id,
      },
    })
    const exerciseData = jsonData?.data.rows[0]

    // TODO: missing?: exerciseSettings.id
    //exerciseSettings.id = exerciseData.id
    exerciseSettings.exerciseId = exerciseId
    exerciseSettings.level1 = exerciseData.level_1
    exerciseSettings.level2 = exerciseData.level_2
    exerciseSettings.level3 = exerciseData.level_3
    exerciseSettings.sortSignsByOrder = exerciseData.sort_signs_by_order

    exerciseSettingsUser.wordLength = exerciseData.word_length
    exerciseSettingsUser.unlockedSigns = exerciseData.unlocked_signs
    console.log(exercises, exerciseSettings)
  },

  async patchExerciseSettings() {
    jsonAction({
      method: 'patch',
      url: 'exercise-settings',
      data: {
        ids: {
          exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
          user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
        },
        data: {
          task_split: 0.7,
          word_length: 5,
        },
      },
    })
  },

  async getTask() {
    jsonAction({
      method: 'get',
      url: 'task',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
      },
    })
  },
  async getActiveExerciseSession() {
    jsonAction({
      method: 'get',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
      },
    })
  },
  async postNewExerciseSession() {
    jsonAction({
      method: 'post',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '7600c936-7c07-4e4d-98ec-243612652ca3',
        start_time: '2021-12-31 13:12:00.595133+00',
      },
    })
  },
  async patchExerciseSession() {
    jsonAction({
      method: 'patch',
      url: 'exercise-session',
      data: {
        data: {
          session_duration: '00:50:00',
        },
        ids: {
          exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
          user_id: '7600c936-7c07-4e4d-98ec-243612652ca3',
          start_time: '2021-12-31 13:12:00.595133+00',
        },
      },
    })
  },
  async deleteExerciseSession() {
    jsonAction({
      method: 'delete',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '7600c936-7c07-4e4d-98ec-243612652ca3',
        start_time: '2021-12-31 13:12:00.595133+00',
      },
    })
  },
  /* eslint-enable */
}

const exerciseData = {
  exercises: readonly(exercises) as Exercise[],
  exerciseSettings: readonly(exerciseSettings) as ExerciseSettings,
  exerciseSettingsUser: readonly(exerciseSettingsUser) as ExerciseSettingsUser,
  exerciseSessions: readonly(exerciseSessions) as ExerciseSession[],
  methods,
  actions,
}

export default exerciseData
