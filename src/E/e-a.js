const mapToTemplate = require('./../actions/mapToTemplate')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')

module.exports = (node) => {
  const href = node.getAttribute('data-href')
  if (!href) {
    throw new Error('e-a must have "data-href" attribute')
  }
  const text = node.innerText
  const a = document.createElement('a')
  a.href = href
  a.innerText = text
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

    if (a.hasAttribute('data-actions-on-progress-start')) {
      evaluateStringWithActionsOnProgress(
        a.getAttribute('data-actions-on-progress-start'),
        a
      )
    }

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

      window.history.pushState(null, null, href)

      const html = new DOMParser().parseFromString(resObj.body, 'text/html')
      const title = html.title
      const head = html.head
      const body = html.body

      document.title = title

      const scripts = head.querySelectorAll('script')
      const stylesAsLink = head.querySelectorAll('link[rel="stylesheet"]')
      const styles = head.querySelectorAll('style')

      scripts.forEach(script => {
        if (script.src && !document.querySelector(`script[src="${script.src}"]`)) {
          const newScript = document.createElement('script')
          newScript.setAttribute('type', 'text/javascript') 
          newScript.src = script.src
          document.head.appendChild(newScript)
        } else {
          const newScript = document.createElement('script')
          newScript.setAttribute('type', 'text/javascript') 
          newScript.textContent = script.textContent
          document.head.appendChild(newScript)
        }
      })
      stylesAsLink.forEach(style => {
        if (style.href && document.querySelector(`script[href="${style.href}"]`)) {
          const newStyle = document.createElement('link')
          newScript.setAttribute('rel', 'stylesheet') 
          newScript.href = style.href
          document.head.appendChild(newScript)
        }
      })
      styles.forEach(style => {
        const newStyle = document.createElement('style');
        newStyle.textContent = style.textContent;
        document.head.appendChild(newStyle);
      })

      document.body.innerHTML = body.innerHTML

      if (a.hasAttribute('data-actions-on-progress-end')) {
        evaluateStringWithActionsOnProgress(
          a.getAttribute('data-actions-on-progress-end'),
          a
        )
      }
    })

  })
}
