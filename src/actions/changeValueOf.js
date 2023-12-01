function changeValueOf (elmSelector, value) {
  const elm = document.querySelector(elmSelector)
  elm.value = value
}

window.changeValueOf = changeValueOf
module.exports = changeValueOf
