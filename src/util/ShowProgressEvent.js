'use strict'

class ShowProgressEvent {
  constructor (progressBar, removeProgressBarAfter = false) {
    if (progressBar) {
      return (event) => {
        if (event.lengthComputable) {
          progressBar.style.display = ''
          const percentComplete = parseInt((event.loaded / event.total) * 100)
          progressBar.value = percentComplete
          if (progressBar.value === 100) {
            if (removeProgressBarAfter) {
              progressBar.parentNode.removeChild(progressBar)
            } else {
              progressBar.style.display = 'none'
            }
          }
        }
      }
    }
    return () => {}
  }
}

module.exports = ShowProgressEvent
