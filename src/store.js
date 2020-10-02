import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    eqid: null,
    eqhead: '地震信息',
    piclist: [],
    publishUri: ''
  },
  mutations: {
    seteqid: function (state, eqid) {
      state.eqid = eqid;
    },
    seteqhead: function (state, eqhead) {
      state.eqhead = eqhead;
    },
    setpiclist: function (state, list) {
      state.piclist = list;
    },
    setChangepic: function (state, index) {
      state.piclist[index].flag = state.piclist[index].flag ? false : true
    },
    setpublishUri: function (state, publishUri) {
      state.publishUri = publishUri;
    }
  },
  getters: {
    geteqid: function (state) {
      return state.eqid;
    },
    geteqhead: function (state) {
      return state.eqhead;
    },
    getpiclist: function (state) {
      return state.piclist;
    },
    getpublishUri: function (state) {
      return state.publishUri;
    }
  },
  actions: {}
})