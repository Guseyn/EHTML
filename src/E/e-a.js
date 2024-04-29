const turnEhtmlMutationObserverOn = require('./../turnEhtmlMutationObserverOn')
const turnEhtmlMutationObserverOff = require('./../turnEhtmlMutationObserverOff')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')

window.addEventListener('popstate', (event) => {
  if (event.state && event.state.itIsEhtmlState) {
    updatePage(event.state.htmlAsString)
    setTimeout(function() {
      (document.documentElement || document.body).scrollTo(
        event.state.scrollLeft,
        event.state.scrollTop
      )
    }, 20)
  }
})

module.exports = (node) => {
  const href = node.getAttribute('data-href')
  if (!href) {
    throw new Error('e-a must have "data-href" attribute')
  }

  const a = document.createElement('a')
  a.setAttribute('is', 'e-a')
  a.href = href
  a.innerHTML = node.innerHTML
  for (let i = 0; i < node.attributes.length; i++) {
    if (node.attributes[i].name !== 'data-href') {
      a.setAttribute(
        node.attributes[i].name,
        node.attributes[i].value
      )
    }
  }
  node.parentNode.replaceChild(a, node)

  a.addEventListener('click', (event) => {
    event.preventDefault()

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

    if (window.history.state !== null) {
      window.history.replaceState(
        {
          itIsEhtmlState: true,
          htmlAsString: window.history.state.htmlAsString,
          scrollTop,
          scrollLeft
        },
        null,
        window.location.path
      )
    }

    let progressStartAction = a.getAttribute('data-actions-on-progress-start')
    let progressEndAction = a.getAttribute('data-actions-on-progress-end')

    if (progressStartAction) {
      evaluateStringWithActionsOnProgress(progressStartAction, a)
    }

    loadCurrentPageSourceIfNeeded(() => {
      responseFromAjaxRequest({
        url: encodeURI(href),
        method: 'GET',
        headers: JSON.parse(
          evaluatedStringWithParams(
            a.getAttribute('data-request-headers')
          ) || '{}'
        )
      }, undefined, (err, resObj) => {
        if (err) {
          throw err
        }

        const htmlAsString = resObj.body

        if (progressEndAction) {
          evaluateStringWithActionsOnProgress(progressEndAction, a)
        }

        window.history.pushState(
          {
            itIsEhtmlState: true,
            htmlAsString,
            scrollTop: 0,
            scrollLeft: 0
          },
          null,
          href
        )

        updatePage(htmlAsString)
      })
    })
  })
}

function updatePage (htmlAsString) {
  const html = new DOMParser().parseFromString(htmlAsString, 'text/html')
  const title = html.title
  const head = html.head
  const body = html.body

  turnEhtmlMutationObserverOff(
    window.ehtmlMutationObserver
  )

  document.title = title

  const icon = head.querySelector('link[rel="icon"]')
  const meta = head.querySelectorAll('meta')
  const preloads = head.querySelectorAll('link[rel="preload"]')
  const stylesAsLink = head.querySelectorAll('link[rel="stylesheet"]')
  const styles = head.querySelectorAll('style')
  const scripts = head.querySelectorAll('script')

  if (icon) {
    const currentIcon = document.querySelector('link[rel="icon"]')
    if (currentIcon) {
      currentIcon.parentNode.removeChild(currentIcon)
    }
    document.head.appendChild(icon)
  }

  const currentMeta = document.querySelectorAll('meta')
  currentMeta.forEach(m => {
    m.parentNode.removeChild(m)
  })
  meta.forEach(m => {
    document.head.appendChild(m)
  })

  preloads.forEach(preload => {
    if (preload.hasAttribute('href') && !document.querySelector(`link[rel="preload"][href="${preload.getAttribute('href')}"]`)) {
      const newPreload = document.createElement('link')
      for (let i = 0; i < preload.attributes.length; i++) {
        newPreload.setAttribute(
          preload.attributes[i].name,
          preload.attributes[i].value
        )
      }
      document.head.appendChild(preload)
    }
  })

  stylesAsLink.forEach(style => {
    if (style.hasAttribute('href') && !document.querySelector(`link[rel="stylesheet"][href="${style.getAttribute('href')}"]`)) {
      const newStyle = document.createElement('link')
      newStyle.setAttribute('rel', 'stylesheet')
      for (let i = 0; i < style.attributes.length; i++) {
        newStyle.setAttribute(
          style.attributes[i].name,
          style.attributes[i].value
        )
      }
      document.head.appendChild(newStyle)
    }
  })
  styles.forEach(style => {
    document.head.appendChild(style)
  })

  scripts.forEach(script => {
    if (script.hasAttribute('src') && !document.querySelector(`script[src="${script.getAttribute('src')}"]`)) {
      const newScript = document.createElement('script')
      for (let i = 0; i < script.attributes.length; i++) {
        newScript.setAttribute(
          script.attributes[i].name,
          script.attributes[i].value
        )
      }
      document.head.appendChild(newScript)
    } else if (!script.hasAttribute('src')) {
      document.head.appendChild(script)
    }
  })

  const currentHtmlTag = document.querySelector('html')
  const htmlTag = html.querySelector('html')

  if (htmlTag.hasAttribute('class')) {
    currentHtmlTag.setAttribute('class', htmlTag.getAttribute('class'))
  } else {
    currentHtmlTag.removeAttribute('class')
  }

  turnEhtmlMutationObserverOn(
    window.ehtmlMutationObserver
  )

  document.documentElement.replaceChild(body, document.body)
}

function loadCurrentPageSourceIfNeeded (callback) {
  if (window.history.state === null) {
    responseFromAjaxRequest({
      url: encodeURI(window.location.href),
      method: 'GET',
      headers: {}
    }, undefined, (err, resObj) => {
      if (err) {
        throw err
      }

      const htmlAsString = resObj.body

      window.history.replaceState(
        {
          itIsEhtmlState: true,
          htmlAsString,
          scrollTop: 0,
          scrollLeft: 0
        },
        null,
        window.location.path
      )

      callback()
    })
  } else {
    callback()
  }
}
