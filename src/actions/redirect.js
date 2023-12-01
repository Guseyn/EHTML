function redirect (url) {
  window.location.href = encodeURI(url)
}

window.redirect = redirect
module.exports = redirect
