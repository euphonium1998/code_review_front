import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  name: 'store',
  state: {
    editorContent: '',
    userInfo: null,
    questionForm: {
      id: -1,
      writer: '',
      name: '',
      questionDescription: '',
      inputDescription: '',
      outputDescription: '',
      sampleInput: '',
      sampleOutput: '',
    },
  },

  mutations: {
    [types.SET_USER_INFO](state, payload) {
      state.userInfo = payload
    },
    [types.SET_EDITOR_CONTENT](state, payload) {
      state.editorContent = payload
    },
    [types.SET_QUESTION_FORM](state, payload) {
      //todo
      /*
      更新当前题目
      deprecated
       */
    },
  },
  actions: {
  },
  modules: {
  }
})
