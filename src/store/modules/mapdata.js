const state = {
  overlayFile: null,
  overlayData: {}
}

const getters = {
  valuesOnly: state => {
    return [...new Set(Object.entries(state.overlayData).map(item => [item[1].name, item[1].metricValue]))]
  }
}

const mutations = {
  setData(state, data) {
    state.overlayData = data
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
