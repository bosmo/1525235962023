import Form from './form.vue'
import FormRow from './form-row.vue'
import FormCell from './form-cell.vue'

Form.install = (Vue) => {
  Vue.component(Form.name, Form)
  Vue.component(FormRow.name, FormRow)
  Vue.component(FormCell.name, FormCell)
}

export default Form
