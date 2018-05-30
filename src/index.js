import Form from './components/form'
import Textbox from './components/textbox'
import Button from './components/button'
import Dialog from './components/dialog'
import Board from './components/board'
import Book from './components/book'
import Draggable from './components/draggable'
import AlignLine from './components/align-line'
import Ruler from './components/ruler'

const components = {
  Form,
  Textbox,
  Button,
  Dialog,
  Board,
  Book,
  Draggable,
  AlignLine,
  Ruler
}

const install = (Vue) => {
  for (let i in components) {
    if (components[i].install) {
      components[i].install(Vue)
    } else {
      Vue.component(components[i].name, components[i])
    }
  }
}

export {
  Form,
  Textbox,
  Button,
  Dialog,
  Board,
  Book,
  Draggable,
  AlignLine,
  Ruler
}

export default {...components, install}
