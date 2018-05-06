import Form from './components/form'
import Textbox from './components/textbox'
import Button from './components/button'
import Dialog from './components/dialog'
import Board from './components/board'
import BookDesigner from './components/designer'
import Draggable from './components/draggable'

const components = {
  Form,
  Textbox,
  Button,
  Dialog,
  Board,
  BookDesigner,
  Draggable
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
  BookDesigner,
  Draggable
}

export default {...components, install}
