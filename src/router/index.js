import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeInfo from '../components/HomeInfo'
import InputView from '../views/InputView'

Vue.use(VueRouter)


export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'enter',
      component: InputView
    },
    {
      path: '/homeInfo',
      name: 'home',
      component: HomeInfo
    }
  ]
})