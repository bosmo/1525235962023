import Board from './board'

Board.install = (Vue) => {
  Vue.component(Board.name, Board)
}
export default Board
