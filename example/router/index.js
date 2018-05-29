import Vue from 'vue'
import Router from 'vue-router'
import PageForm from '../pages/form/form.vue'
import Board from '../pages/board/board.vue'
import book from '../pages/book/book.vue'
import AlignLine from '../pages/align-line/align-line.vue'
import Ruler from '../pages/ruler/ruler.vue'

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
      path: '/book',
      name: 'PageBook',
      component: book
    },
    {
      path: '/align-line',
      name: 'PageAlignLine',
      component: AlignLine
    },
    {
      path: '/ruler',
      name: 'PageRuler',
      component: Ruler
    }
  ]
})
