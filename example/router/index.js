import Vue from 'vue'
import Router from 'vue-router'
import PageForm from '../pages/form.vue'
import Board from '../pages/board/board.vue'
import BookDesigner from '../pages/book-designer/book-designer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PageForm',
      component: PageForm
    },
    {
      path: '/board',
      name: 'PageBoard',
      component: Board
    },
    {
      path: '/book-designer',
      name: 'BookDesigner',
      component: BookDesigner
    }
  ]
})
