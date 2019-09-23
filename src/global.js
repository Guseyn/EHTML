'use strict'

if (!sessionStorage.getItem('isFirstStatePushedToHistory')) {
  sessionStorage.setItem('isFirstStatePushedToHistory', 'false')
}

window.onpopstate = (event) => {
  if (event.state) {
    document.body.innerHTML = event.state.body
    document.title = event.state.title
  }
}

window.onload = () => {
  if (sessionStorage.getItem('isFirstStatePushedToHistory') === 'false') {
    history.replaceState(
      {
        body: document.body.innerHTML,
        title: document.title
      },
      null,
      location.pathname + location.search
    )
    sessionStorage.setItem('isFirstStatePushedToHistory', 'true')
  }
}
