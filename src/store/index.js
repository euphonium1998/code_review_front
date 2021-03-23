import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  name: 'store',
  state: {
    editorContent: '',
    userInfo: null
  },
  mutations: {
    [types.SET_USER_INFO](state, payload) {
      state.userInfo = payload
    },
    [types.SET_EDITOR_CONTENT](state, payload) {
      state.editorContent = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
