import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {  
        tagName:'',
        isFresh:false,
        newsDataItem:{},
    },
    mutations: {
        setTag(state, data) {
            state.tagName = data;
        },
        setFresh(state,data){
        state.isFresh = data;
        },
        setItem(state,data){
            state.newsDataItem=data;
        },
        clearItem(state){
            state.newsDataItem={};
        }
    },
})

export default store
