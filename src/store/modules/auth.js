import axios from 'axios'

const state = {
  apiKey: ''
}

const mutations = {
  setApiKey(state, apiKey) {
    state.apiKey = apiKey
  }
}

const actions = {
  async getApiKey ( { commit } ) {
    await axios
      .get("https://1adw40daxl.execute-api.eu-west-1.amazonaws.com/dev/getapikey")
      .then(response => {
        commit('setApiKey', response.data.maps_api)
      })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
