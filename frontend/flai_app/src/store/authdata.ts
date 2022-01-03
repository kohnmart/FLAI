import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
export interface Auth {
  token: string
  email: string
  password: string
  user_id: string
  isAuth: boolean
}

const auth = reactive({
  token: '',
  email: 'miriam.weber@email.com',
  password: 'supersecret',
  user_id: '',
  isAuth: false,
})

const methods = {
  fetchToken() {
    return auth.token
  },
  fetchUserId() {
    return auth.user_id
  },

  fetchIsAuth() {
    return auth.isAuth
  },

  setAuth(state: boolean) {
    return (auth.isAuth = state)
  },
}

const actions = {
  /* eslint-disable */
  async loginUser() {
    const jsonData = await jsonAction(
      {
        method: 'post',
        url: 'auth/login',
        data: { email: auth.email, password: auth.password },
      },
      console.log('login failed')
    )
    if (jsonData?.status === 200) {
      auth.token = jsonData?.data.jwt
      auth.user_id = jsonData?.data.id
      auth.isAuth = methods.setAuth(true)
    }
  },

  logoutUser() {
    auth.token = ''
    auth.isAuth = false
    console.log('User logged out')
  },
  /* eslint-enable */
}

const authData = {
  auth: readonly(auth) as Auth,
  methods,
  actions,
}

export default authData
