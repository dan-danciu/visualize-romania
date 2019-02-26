import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import mapdata from './modules/mapdata'

Vue.use(Vuex)

export const store =  new Vuex.Store({
  modules: {
    auth,
    mapdata
  }
})
