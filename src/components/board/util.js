const unique = (() => {
  let number = 0
  return () => {
    return 'board-' + (++number)
  }
})()

export {
  unique
}
