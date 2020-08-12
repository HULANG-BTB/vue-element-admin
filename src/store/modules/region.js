const state = {
  region: {},
  parentId: ''
}

const mutations = {
  SET_REGION: (state, region) => {
    state.region = region
  },
  SET_PARENTID: (state, parentId) => {
    state.parentId = parentId
  }
}

const actions = {
  setRegion ({ commit }, region) {
    return new Promise((resolve) => {
      commit('SET_REGION', region)
      resolve()
    })
  },
  setParentId ({ commit }, parentId) {
    commit('SET_PARENTID', parentId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

